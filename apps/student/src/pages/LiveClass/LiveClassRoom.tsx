import React, { useEffect, useRef, useState, useCallback } from 'react';
import DailyIframe from '@daily-co/daily-js';
import type { DailyCall } from '@daily-co/daily-js';
import { useAuth } from '@elearning/shared';
import { useLocation, useNavigate } from 'react-router-dom';

const LiveClassRoom = () => {
    const callWrapperRef = useRef<HTMLDivElement>(null);
    const [callInstance, setCallInstance] = useState<DailyCall | null>(null);
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    
    // Expect the Daily room URL to be passed in state
    const roomUrl = location.state?.roomUrl;

    const cleanup = useCallback(() => {
         if (callInstance) {
            callInstance.destroy();
        }
    }, [callInstance]);

    useEffect(() => {
        if (!roomUrl) {
           navigate('/dashboard'); // Redirect if no room url
           return;
        }

        if (callWrapperRef.current && !callInstance) {
            const newCallInstance = DailyIframe.createFrame(callWrapperRef.current, {
                showLeaveButton: true,
                iframeStyle: {
                    width: '100%',
                    height: '100%',
                    border: '0',
                },
            });

            newCallInstance.join({ url: roomUrl, userName: user?.name });
            
            newCallInstance.on('left-meeting', () => {
                cleanup();
                navigate('/dashboard');
            });

            setCallInstance(newCallInstance);
        }

        return () => {
             // Cleanup on unmount handled by 'left-meeting' or manual destroy if component unmounts
             // Doing it here can cause issues if 'left-meeting' triggers navigation which unmounts
             // Best to rely on Daily's event or explicit leave action
        };

    }, [roomUrl, user, navigate, callInstance, cleanup]);

    // Unmount cleanup
    useEffect(() => {
        return () => {
             if (callInstance) {
                 callInstance.destroy();
             }
        }
    }, [])

    if (!roomUrl) return null;

    return (
        <div className="h-[calc(100vh-64px)] w-full bg-gray-900 flex flex-col">
             <div className="flex-1 relative" ref={callWrapperRef}>
                 {/* Daily Iframe injected here */}
             </div>
        </div>
    );
};

export default LiveClassRoom;
