/**
 * AgoraClass.tsx — Student's Live Class Room
 *
 * ROLE: Student (limited control)
 * - Can talk via microphone and video (both are publishers)
 * - Can view teacher's and other participants' streams
 * - Can request/initiate screen sharing (if allowed by session policy)
 * - Can raise/lower hand to get teacher's attention
 * - Can participate in real-time chat
 * - CANNOT: start/stop recording, end session for all
 *
 * HOW SCREEN SHARING WORKS:
 * - Uses a separate Agora client with a dedicated screenShareToken + screenShareUid
 * - Only one person (teacher or student) can share at a time
 * - Student sees shared screens from others in the main view area
 * - When a screen share UID (>= 100000 offset) is detected, it renders in the screen container
 *
 * HOW CHAT WORKS:
 * - Uses Agora data streams: createDataStream() + sendStreamMessage()
 * - A single data stream is created on join and reused for all messages
 * - Messages are wrapped in a DataStreamMessage with type "chat"
 * - Incoming messages are received via the "stream-message" event
 * - Messages display sender name, role badge (teacher/student), and timestamp
 *
 * HOW HAND RAISE WORKS:
 * - Student clicks the hand raise button → sends a "hand-raise" DataStreamMessage
 * - Teacher receives it and sees a notification + indicator
 * - Student can lower hand by clicking the button again → sends "hand-lower"
 */
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";
import type {
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteVideoTrack,
  IRemoteAudioTrack,
  ILocalVideoTrack,
  IAgoraRTCClient,
  UID,
} from "agora-rtc-sdk-ng";
import { axiosInstance } from "@elearning/shared";
import toast from "react-hot-toast";
import "./LiveClassRoom.css";

// ─── Types ───────────────────────────────────────────────────────────────
interface RemoteUser {
  uid: UID;
  name: string;
  role: string;
  audioMuted: boolean;
  videoMuted: boolean;
  hasVideo: boolean;
  hasAudio: boolean;
  handRaised: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  role: string;
  text: string;
  timestamp: number;
}

// Data stream message types for signaling between participants
interface DataStreamMessage {
  type: "chat" | "hand-raise" | "hand-lower" | "screen-share-notify";
  payload: any;
}

// Screen share UIDs are offset by this amount from regular UIDs
const SCREEN_SHARE_UID_OFFSET = 100000;

const AgoraClass = () => {
  const { channelName } = useParams<{ channelName: string }>();
  const navigate = useNavigate();

  // ─── Connection State ──────────────────────────────────────────────
  const [appId, setAppId] = useState("");
  const [token, setToken] = useState("");
  const [screenShareToken, setScreenShareToken] = useState("");
  const [screenShareUid, setScreenShareUid] = useState(0);
  const [localUid, setLocalUid] = useState(0);
  const [userName, setUserName] = useState("Student");
  const [classId, setClassId] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [loadingToken, setLoadingToken] = useState(true);

  // ─── Media State ───────────────────────────────────────────────────
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [remoteScreenShareUid, setRemoteScreenShareUid] = useState<UID | null>(null);

  // ─── Chat State ────────────────────────────────────────────────────
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  // ─── Participants State ────────────────────────────────────────────
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);
  const [activeSpeaker, setActiveSpeaker] = useState<UID | null>(null);

  // ─── Hand Raise State ──────────────────────────────────────────────
  const [handRaised, setHandRaised] = useState(false);

  // ─── Refs ──────────────────────────────────────────────────────────
  const client = useRef<IAgoraRTCClient>(
    AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
  );
  const screenClient = useRef<IAgoraRTCClient>(
    AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
  );
  const localVideoTrack = useRef<ICameraVideoTrack | null>(null);
  const localAudioTrack = useRef<IMicrophoneAudioTrack | null>(null);
  const screenVideoTrack = useRef<ILocalVideoTrack | null>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const screenShareRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const tokenRenewalInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const dataStreamId = useRef<number | null>(null);
  const chatOpenRef = useRef(chatOpen);

  // Keep chatOpenRef in sync for use inside event handlers
  useEffect(() => {
    chatOpenRef.current = chatOpen;
  }, [chatOpen]);

  // ─── Fetch Token ───────────────────────────────────────────────────
  useEffect(() => {
    if (!channelName) {
      toast.error("Invalid channel");
      navigate("/dashboard/live-classes");
      return;
    }

    const fetchToken = async () => {
      setLoadingToken(true);
      try {
        const res = await axiosInstance.get(
          `/live-classes/token?channel=${channelName}`
        );
        setAppId(res.data.appId);
        setToken(res.data.token);
        setLocalUid(res.data.uid);
        setUserName(res.data.userName || "Student");
        setClassId(res.data.classId);
        setScreenShareToken(res.data.screenShareToken || "");
        setScreenShareUid(res.data.screenShareUid || 0);
      } catch (err) {
        toast.error("Failed to get token");
        navigate("/dashboard/live-classes");
      } finally {
        setLoadingToken(false);
      }
    };
    fetchToken();

    return () => {
      leaveClass();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelName]);

  // ─── Auto-scroll Chat ─────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // ─── Reset Unread When Chat Opens ─────────────────────────────────
  useEffect(() => {
    if (chatOpen) setUnreadCount(0);
  }, [chatOpen]);

  // ─── Broadcast a data stream message ──────────────────────────────
  const broadcastDataMessage = useCallback(
    async (message: DataStreamMessage) => {
      try {
        const agoraClient = client.current as any; // bypass TS type checking

        if (dataStreamId.current === null) {
          dataStreamId.current = await agoraClient.createDataStream({
            ordered: true,
            reliable: true,
          });
        }

        const encoder = new TextEncoder();
        const data = encoder.encode(JSON.stringify(message));
        await agoraClient.sendStreamMessage(dataStreamId.current, data);
      } catch (err) {
        console.warn("Failed to broadcast data message:", err);
        dataStreamId.current = null;
      }
    },
    [],
  );

  // ─── Join Class ────────────────────────────────────────────────────
  const joinClass = async () => {
    if (!appId || !token || !channelName || joined) return;

    try {
      // Join the main RTC channel
      await client.current.join(appId, channelName, token, localUid);

      // Create and publish local audio + video tracks
      const [microphoneTrack, cameraTrack] =
        await AgoraRTC.createMicrophoneAndCameraTracks();
      localAudioTrack.current = microphoneTrack;
      localVideoTrack.current = cameraTrack;

      // Play local video preview
      if (localVideoRef.current) {
        cameraTrack.play(localVideoRef.current);
      }

      // Publish both tracks — student is a publisher so they can talk/video
      await client.current.publish([microphoneTrack, cameraTrack]);
      setJoined(true);

      // ─── Event Handlers ──────────────────────────────────────────
      client.current.on("user-published", async (user, mediaType) => {
        await client.current.subscribe(user, mediaType);
        const uid = user.uid;

        // Check if this is a screen share stream (UID >= offset)
        if (typeof uid === "number" && uid >= SCREEN_SHARE_UID_OFFSET) {
          if (mediaType === "video" && user.videoTrack) {
            setRemoteScreenShareUid(uid);
            toast("Screen sharing started", { icon: "🖥️" });
            setTimeout(() => {
              if (screenShareRef.current) {
                (user.videoTrack as IRemoteVideoTrack).play(screenShareRef.current);
              }
            }, 100);
          }
          return;
        }

        // Regular user video
        if (mediaType === "video") {
          setRemoteUsers((prev) => {
            const existing = prev.find((u) => u.uid === uid);
            if (existing) {
              return prev.map((u) => (u.uid === uid ? { ...u, hasVideo: true, videoMuted: false } : u));
            }
            return [
              ...prev,
              { uid, name: `User ${uid}`, role: "student", audioMuted: false, videoMuted: false, hasVideo: true, hasAudio: false, handRaised: false },
            ];
          });
          // Play remote video in its tile
          setTimeout(() => {
            const container = document.getElementById(`remote-video-${uid}`);
            if (container && user.videoTrack) {
              (user.videoTrack as IRemoteVideoTrack).play(container);
            }
          }, 200);
        }

        // Regular user audio
        if (mediaType === "audio") {
          (user.audioTrack as IRemoteAudioTrack)?.play();
          setRemoteUsers((prev) => {
            const existing = prev.find((u) => u.uid === uid);
            if (existing) {
              return prev.map((u) => (u.uid === uid ? { ...u, hasAudio: true, audioMuted: false } : u));
            }
            return [
              ...prev,
              { uid, name: `User ${uid}`, role: "student", audioMuted: false, videoMuted: false, hasVideo: false, hasAudio: true, handRaised: false },
            ];
          });
        }
      });

      client.current.on("user-unpublished", (user, mediaType) => {
        const uid = user.uid;
        if (typeof uid === "number" && uid >= SCREEN_SHARE_UID_OFFSET) {
          setRemoteScreenShareUid(null);
          return;
        }
        if (mediaType === "video") {
          setRemoteUsers((prev) =>
            prev.map((u) => (u.uid === uid ? { ...u, hasVideo: false, videoMuted: true } : u))
          );
        }
        if (mediaType === "audio") {
          setRemoteUsers((prev) =>
            prev.map((u) => (u.uid === uid ? { ...u, hasAudio: false, audioMuted: true } : u))
          );
        }
      });

      client.current.on("user-left", (user) => {
        const uid = user.uid;
        if (typeof uid === "number" && uid >= SCREEN_SHARE_UID_OFFSET) {
          setRemoteScreenShareUid(null);
          return;
        }
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== uid));
        toast("Participant left", { icon: "👋" });
      });

      client.current.on("user-joined", (user) => {
        const uid = user.uid;
        if (typeof uid === "number" && uid >= SCREEN_SHARE_UID_OFFSET) return;
        toast("New participant joined", { icon: "🎉" });
      });

      // Listen for data stream messages (chat + screen share notifications)
      client.current.on("stream-message", (_uid, data) => {
        try {
          const decoder = new TextDecoder();
          const message: DataStreamMessage = JSON.parse(decoder.decode(data));

          if (message.type === "chat") {
            const chatMsg = message.payload as ChatMessage;
            setChatMessages((prev) => [...prev, chatMsg]);
            if (!chatOpenRef.current) {
              setUnreadCount((c) => c + 1);
              toast(`💬 ${chatMsg.sender}: ${chatMsg.text.substring(0, 50)}`, {
                duration: 3000,
              });
            }
          } else if (message.type === "screen-share-notify") {
            const { userName: sharer, action } = message.payload;
            if (action === "started") {
              toast(`🖥️ ${sharer} started screen sharing`, { duration: 3000 });
            } else if (action === "stopped") {
              toast(`${sharer} stopped screen sharing`, { icon: "🖥️", duration: 2000 });
            }
          }
        } catch (err) {
          console.warn("Failed to parse data stream message:", err);
        }
      });

      // Active speaker detection
      client.current.enableAudioVolumeIndicator();
      client.current.on("volume-indicator", (volumes) => {
        const loudest = volumes.reduce(
          (max, v) => (v.level > max.level ? v : max),
          { uid: 0 as UID, level: 0 }
        );
        if (loudest.level > 5) {
          setActiveSpeaker(loudest.uid);
        }
      });

      // Token renewal every 50 minutes
      tokenRenewalInterval.current = setInterval(async () => {
        try {
          const res = await axiosInstance.get(
            `/live-classes/token?channel=${channelName}`
          );
          await client.current.renewToken(res.data.token);
          // Also update screen share token
          if (res.data.screenShareToken) {
            setScreenShareToken(res.data.screenShareToken);
          }
        } catch (err) {
          console.error("Failed to renew token:", err);
        }
      }, 50 * 60 * 1000);
    } catch (err) {
      console.error("Agora join error:", err);
      toast.error("Failed to join class. Please check your camera/mic permissions.");
    }
  };

  // ─── Leave Class ───────────────────────────────────────────────────
  const leaveClass = async () => {
    // Stop screen sharing if active
    if (isScreenSharing) {
      await stopScreenShare();
    }

    // Clean up token renewal
    if (tokenRenewalInterval.current) {
      clearInterval(tokenRenewalInterval.current);
      tokenRenewalInterval.current = null;
    }

    // Remove all event listeners
    client.current.removeAllListeners();

    // Clean up local tracks
    localAudioTrack.current?.stop();
    localAudioTrack.current?.close();
    localAudioTrack.current = null;

    localVideoTrack.current?.stop();
    localVideoTrack.current?.close();
    localVideoTrack.current = null;

    try {
      await client.current.leave();
    } catch (e) {
      // ignore
    }

    // Reset data stream ID
    dataStreamId.current = null;

    setJoined(false);
    setRemoteUsers([]);
    setRemoteScreenShareUid(null);
    setHandRaised(false);
  };

  // ─── Toggle Audio ──────────────────────────────────────────────────
  const toggleAudio = async () => {
    if (localAudioTrack.current) {
      await localAudioTrack.current.setEnabled(audioMuted);
      setAudioMuted(!audioMuted);
    }
  };

  // ─── Toggle Video ──────────────────────────────────────────────────
  const toggleVideo = async () => {
    if (localVideoTrack.current) {
      await localVideoTrack.current.setEnabled(videoMuted);
      setVideoMuted(!videoMuted);
    }
  };

  // ─── Start Screen Share ────────────────────────────────────────────
  /**
   * Students can also share their screen (e.g., for presentations).
   * Uses a separate client + dedicated token just like the teacher.
   * Only one person can share at a time.
   */
  const startScreenShare = async () => {
    if (isScreenSharing || remoteScreenShareUid) {
      toast.error("Someone is already sharing their screen");
      return;
    }

    try {
      const screenTrack = await AgoraRTC.createScreenVideoTrack(
        { encoderConfig: "1080p_1" },
        "disable"
      );

      const videoTrack = Array.isArray(screenTrack) ? screenTrack[0] : screenTrack;
      screenVideoTrack.current = videoTrack;

      // Join with the screen share client using dedicated token + UID
      await screenClient.current.join(appId, channelName!, screenShareToken, screenShareUid);
      await screenClient.current.publish([videoTrack]);

      setIsScreenSharing(true);

      // Show screen share locally
      if (screenShareRef.current) {
        videoTrack.play(screenShareRef.current);
      }

      // Notify others via data stream
      broadcastDataMessage({
        type: "screen-share-notify",
        payload: { userName, action: "started" },
      });

      // Handle user stopping screen share via browser UI
      videoTrack.on("track-ended", () => {
        stopScreenShare();
      });

      toast.success("Screen sharing started");
    } catch (err: any) {
      if (err.message?.includes("Permission denied") || err.code === "PERMISSION_DENIED") {
        return; // User cancelled browser dialog
      }
      console.error("Screen share error:", err);
      toast.error("Failed to start screen sharing");
    }
  };

  // ─── Stop Screen Share ─────────────────────────────────────────────
  const stopScreenShare = async () => {
    screenVideoTrack.current?.stop();
    screenVideoTrack.current?.close();
    screenVideoTrack.current = null;

    try {
      await screenClient.current.leave();
    } catch (e) {
      // ignore
    }

    setIsScreenSharing(false);

    broadcastDataMessage({
      type: "screen-share-notify",
      payload: { userName, action: "stopped" },
    });
  };

  // ─── Toggle Hand Raise ─────────────────────────────────────────────
  /**
   * Student raises/lowers their hand to get the teacher's attention.
   * Sends a data stream message that the teacher's app listens for.
   */
  const toggleHandRaise = async () => {
    const newState = !handRaised;
    setHandRaised(newState);

    if (newState) {
      await broadcastDataMessage({
        type: "hand-raise",
        payload: { uid: localUid, name: userName },
      });
      toast("Hand raised ✋", { duration: 2000 });
    } else {
      await broadcastDataMessage({
        type: "hand-lower",
        payload: { uid: localUid, name: userName },
      });
    }
  };

  // ─── Send Chat Message ────────────────────────────────────────────
  const sendChatMessage = async () => {
    const text = chatInput.trim();
    if (!text) return;

    const chatMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: userName,
      role: "student",
      text,
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [...prev, chatMsg]);
    setChatInput("");

    await broadcastDataMessage({ type: "chat", payload: chatMsg });
  };

  // ─── Compute Grid Class ───────────────────────────────────────────
  const totalParticipants = remoteUsers.filter(
    (u) => typeof u.uid === "number" && u.uid < SCREEN_SHARE_UID_OFFSET
  ).length + 1; // +1 for local
  const gridClass = `grid-${Math.min(totalParticipants, 10)}`;
  const hasScreenShare = isScreenSharing || remoteScreenShareUid !== null;

  // ─── Loading State ────────────────────────────────────────────────
  if (loadingToken) {
    return (
      <div className="lcr-loading">
        <div className="lcr-spinner" />
        <span>Preparing your classroom...</span>
      </div>
    );
  }

  // ─── Pre-Join Screen ──────────────────────────────────────────────
  if (!joined) {
    return (
      <div className="lcr-room">
        <div className="lcr-prejoin">
          <div className="lcr-prejoin-card">
            <h2>📚 Ready to Learn?</h2>
            <p>Channel: {channelName}</p>
            <div className="lcr-prejoin-preview" ref={localVideoRef} />
            <button
              className="lcr-join-btn"
              onClick={joinClass}
              disabled={!appId || !token}
            >
              Join Class
            </button>
            <button
              className="lcr-back-btn"
              onClick={() => navigate("/dashboard/live-classes")}
            >
              ← Back to Classes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Room UI ─────────────────────────────────────────────────
  return (
    <div className="lcr-room">
      {/* ─── Top Bar ─────────────────────────────────────────────── */}
      <div className="lcr-topbar">
        <div className="lcr-topbar-left">
          <span className="lcr-topbar-title">{channelName}</span>
          <span className="lcr-topbar-badge lcr-badge-live">● Live</span>
          <span className="lcr-topbar-badge lcr-badge-student">Student</span>
        </div>

        <div className="lcr-topbar-center">
          {/* Students don't see session timer or recording indicator */}
        </div>

        <div className="lcr-topbar-right">
          <div
            className="lcr-participants-count"
            onClick={() => setParticipantsOpen(!participantsOpen)}
          >
            👥 {totalParticipants}
          </div>
        </div>
      </div>

      {/* ─── Content Area ────────────────────────────────────────── */}
      <div className="lcr-content">
        <div className="lcr-video-area">
          {/* Screen Share Display */}
          {hasScreenShare && (
            <div className="lcr-screen-share-container">
              <div className="lcr-screen-share-label">
                🖥️ {isScreenSharing ? "You are sharing" : "Screen Share"}
              </div>
              <div ref={screenShareRef} style={{ width: "100%", height: "100%" }} />
            </div>
          )}

          {/* Video Grid — auto-adjusting layout for 1-10 participants */}
          <div className={`lcr-video-grid ${gridClass} ${hasScreenShare ? "with-screen-share" : ""}`}>
            {/* Local Video Tile */}
            <div
              className={`lcr-video-tile is-local ${activeSpeaker === localUid ? "active-speaker" : ""}`}
            >
              {videoMuted ? (
                <div className="lcr-video-avatar">
                  <div className="lcr-video-avatar-circle">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                </div>
              ) : (
                <div
                  ref={localVideoRef}
                  style={{ width: "100%", height: "100%" }}
                />
              )}
              <div className="lcr-video-tile-info">
                <span className="lcr-video-tile-name">
                  {userName} (You)
                </span>
                <div className="lcr-video-tile-indicators">
                  {audioMuted && <span className="lcr-indicator muted">🔇</span>}
                </div>
              </div>
            </div>

            {/* Remote Video Tiles */}
            {remoteUsers
              .filter((u) => typeof u.uid === "number" && u.uid < SCREEN_SHARE_UID_OFFSET)
              .map((user) => (
                <div
                  key={user.uid}
                  className={`lcr-video-tile ${activeSpeaker === user.uid ? "active-speaker" : ""}`}
                >
                  {!user.hasVideo ? (
                    <div className="lcr-video-avatar">
                      <div className="lcr-video-avatar-circle">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  ) : (
                    <div
                      id={`remote-video-${user.uid}`}
                      style={{ width: "100%", height: "100%" }}
                    />
                  )}
                  <div className="lcr-video-tile-info">
                    <span className="lcr-video-tile-name">{user.name}</span>
                    <div className="lcr-video-tile-indicators">
                      {user.audioMuted && <span className="lcr-indicator muted">🔇</span>}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* ─── Chat Sidebar ────────────────────────────────────────── */}
        <div className={`lcr-chat-sidebar ${chatOpen ? "" : "hidden"}`}>
          <div className="lcr-chat-header">
            <h3>💬 Chat</h3>
            <button className="lcr-chat-close" onClick={() => setChatOpen(false)}>
              ✕
            </button>
          </div>
          <div className="lcr-chat-messages">
            {chatMessages.length === 0 && (
              <div style={{ textAlign: "center", color: "var(--lcr-text-muted)", padding: "40px 0", fontSize: "0.85rem" }}>
                No messages yet. Start the conversation!
              </div>
            )}
            {chatMessages.map((msg) => (
              <div key={msg.id} className="lcr-chat-msg">
                <div className="lcr-chat-msg-header">
                  <span className="lcr-chat-msg-sender">{msg.sender}</span>
                  <span className={`lcr-chat-msg-role ${msg.role}`}>{msg.role}</span>
                  <span className="lcr-chat-msg-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="lcr-chat-msg-text">{msg.text}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="lcr-chat-input-area">
            <input
              className="lcr-chat-input"
              placeholder="Type a message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
            />
            <button
              className="lcr-chat-send"
              onClick={sendChatMessage}
              disabled={!chatInput.trim()}
            >
              ➤
            </button>
          </div>
        </div>

        {/* ─── Participants Panel ──────────────────────────────────── */}
        <div className={`lcr-participants-panel ${participantsOpen ? "" : "hidden"}`}>
          <div className="lcr-chat-header">
            <h3>👥 Participants ({totalParticipants})</h3>
            <button className="lcr-chat-close" onClick={() => setParticipantsOpen(false)}>
              ✕
            </button>
          </div>
          <div className="lcr-participants-list">
            {/* Local user (student) */}
            <div className="lcr-participant-item">
              <div className="lcr-participant-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="lcr-participant-info">
                <div className="lcr-participant-name">{userName} (You)</div>
                <div className="lcr-participant-role">Student</div>
              </div>
              <div className="lcr-participant-status">
                {handRaised && <span>✋</span>}
                {audioMuted && <span className="lcr-indicator muted">🔇</span>}
                {videoMuted && <span className="lcr-indicator muted">📷</span>}
              </div>
            </div>
            {/* Remote users */}
            {remoteUsers
              .filter((u) => typeof u.uid === "number" && u.uid < SCREEN_SHARE_UID_OFFSET)
              .map((user) => (
                <div key={user.uid} className="lcr-participant-item">
                  <div className="lcr-participant-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="lcr-participant-info">
                    <div className="lcr-participant-name">{user.name}</div>
                    <div className="lcr-participant-role">{user.role}</div>
                  </div>
                  <div className="lcr-participant-status">
                    {user.handRaised && <span>✋</span>}
                    {user.audioMuted && <span className="lcr-indicator muted">🔇</span>}
                    {user.videoMuted && <span className="lcr-indicator muted">📷</span>}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* ─── Control Bar ───────────────────────────────────────────── */}
      <div className="lcr-controls">
        {/* Mic */}
        <button
          className={`lcr-ctrl-btn ${audioMuted ? "muted-btn" : ""}`}
          onClick={toggleAudio}
        >
          {audioMuted ? "🔇" : "🎤"}
          <span className="lcr-btn-tooltip">{audioMuted ? "Unmute" : "Mute"}</span>
        </button>

        {/* Camera */}
        <button
          className={`lcr-ctrl-btn ${videoMuted ? "muted-btn" : ""}`}
          onClick={toggleVideo}
        >
          {videoMuted ? "📷" : "🎥"}
          <span className="lcr-btn-tooltip">{videoMuted ? "Start Video" : "Stop Video"}</span>
        </button>

        <div className="lcr-ctrl-divider" />

        {/* Screen Share */}
        <button
          className={`lcr-ctrl-btn ${isScreenSharing ? "active" : ""}`}
          onClick={isScreenSharing ? stopScreenShare : startScreenShare}
        >
          🖥️
          <span className="lcr-btn-tooltip">
            {isScreenSharing ? "Stop Sharing" : "Share Screen"}
          </span>
        </button>

        {/* Hand Raise */}
        <button
          className={`lcr-ctrl-btn ${handRaised ? "hand-active" : ""}`}
          onClick={toggleHandRaise}
        >
          ✋
          <span className="lcr-btn-tooltip">
            {handRaised ? "Lower Hand" : "Raise Hand"}
          </span>
        </button>

        <div className="lcr-ctrl-divider" />

        {/* Chat */}
        <button
          className={`lcr-ctrl-btn ${chatOpen ? "active" : ""}`}
          onClick={() => setChatOpen(!chatOpen)}
          style={{ position: "relative" }}
        >
          💬
          {unreadCount > 0 && (
            <span className="lcr-unread-badge">
              {unreadCount}
            </span>
          )}
          <span className="lcr-btn-tooltip">Chat</span>
        </button>

        <div className="lcr-ctrl-divider" />

        {/* Leave — Student can only leave, not end session for everyone */}
        <button
          className="lcr-ctrl-btn danger"
          onClick={() => {
            leaveClass();
            navigate("/dashboard/live-classes");
          }}
        >
          📞
          <span className="lcr-btn-tooltip">Leave Class</span>
        </button>
      </div>
    </div>
  );
};

export default AgoraClass;
