import { useEffect, useState } from "react";
import {
  BookOpen, Video, FileText, Mic, ChevronDown, ChevronRight,
  GripVertical, Edit2, Trash2, Plus, Eye, EyeOff, CheckCircle,
} from "lucide-react";
import { axiosInstance as api } from '@elearning/shared';
import toast from "react-hot-toast";
import "@elearning/shared/styles/TeacherDashboard/TeacherContentManagement.css";

interface Topic { 
  id: string; 
  title: string; 
  content_type: string; 
  sequence_number: number; 
  video_url?: string; 
  audio_intro_url?: string; 
  notes_url?: string; 
  notes?: string; 
}
interface Unit { id: string; title: string; short_code: string; }

const TOPIC_ICON: Record<string, React.ReactNode> = {
  video: <Video size={14} />,
  text: <FileText size={14} />,
  audio: <Mic size={14} />,
};

const TeacherContentManagement = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: "", content_type: "text" });

  const fetchUnits = async () => {
    try {
      const res = await api.get("/lecturer/units");
      setUnits(res.data);
      if (res.data?.length) setSelectedUnit(res.data[0]);
    } catch {
      setUnits([{ id: "1", title: "Crop Production", short_code: "AGR-101" }]);
    } finally { setLoading(false); }
  };

  const fetchTopics = async (unitId: string) => {
    try {
      const res = await api.get(`/lecturer/topics/${unitId}`);
      setTopics(res.data);
    } catch {
      setTopics([]);
    }
  };

  useEffect(() => { fetchUnits(); }, []);
  useEffect(() => { if (selectedUnit) fetchTopics(selectedUnit.id); }, [selectedUnit]);

  const handleTopicUpload = async (type: 'video' | 'audio' | 'notes_file', file: File) => {
    if (!selectedUnit) return;
    setUploading(true);
    try {
      // In a real scenario, we'd upload to GCS first and get a URL.
      // Here we simulate adding a topic with placeholders for URLs.
      await api.post(`/lecturer/topics`, {
        unit_id: selectedUnit.id,
        title: file.name.split('.')[0],
        content_type: type === 'notes_file' ? 'text' : type,
        notes: `File uploaded: ${file.name}`,
        sequence_number: topics.length + 1
      });
      toast.success(`${type} added successfully!`);
      fetchTopics(selectedUnit.id);
    } catch (err) {
      toast.error('Failed to add topic');
    } finally {
      setUploading(false);
    }
  };

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit) return;
    try {
      await api.post(`/lecturer/topics`, {
        ...newTopic,
        unit_id: selectedUnit.id,
        sequence_number: topics.length + 1
      });
      toast.success("Topic added");
      fetchTopics(selectedUnit.id);
      setShowAddTopic(false);
      setNewTopic({ title: "", content_type: "text" });
    } catch {
      toast.error("Failed to add topic");
    }
  };

  const handleDeleteTopic = async (id: string) => {
    if (!confirm("Delete this topic?")) return;
    try {
      await api.delete(`/lecturer/topics/${id}`);
      setTopics(prev => prev.filter(t => t.id !== id));
      toast.success("Topic deleted");
    } catch { toast.error("Failed to delete topic"); }
  };

  return (
    <div className="tcm-layout">
      {/* Unit Selector Sidebar */}
      <div className="td-card">
        <div className="td-card-header"><span className="td-card-title">📚 My Units</span></div>
        <div className="tcm-course-list">
          {loading ? (
            <div className="td-loading"><div className="td-spinner" /></div>
          ) : units.map(u => (
            <button
              key={u.id}
              className={`tcm-course-item ${selectedUnit?.id === u.id ? "active" : ""}`}
              onClick={() => setSelectedUnit(u)}
            >
              <div className="tcm-course-icon"><BookOpen size={14} /></div>
              <div>
                <div className="tcm-course-name">{u.title}</div>
                <div className="tcm-course-meta">{u.short_code}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Topics Panel */}
      <div>
        <div className="td-card">
          <div className="td-card-header">
            <span className="td-card-title">📖 Content — {selectedUnit?.title}</span>
            <button className="td-btn td-btn-primary td-btn-sm" onClick={() => setShowAddTopic(true)}>
              <Plus size={14} /> Add Topic
            </button>
          </div>
          <div className="td-card-body" style={{ padding: "1rem" }}>
            <div className="tcm-lesson-list">
              {topics.map((topic, index) => (
                <div key={topic.id} className="tcm-lesson-card">
                  <div className="tcm-lesson-row">
                    <GripVertical size={16} className="tcm-drag-handle" />
                    <div className="tcm-lesson-order">{topic.sequence_number || index + 1}</div>
                    <div className="tcm-topic-icon" style={{ marginLeft: '0.5rem' }}>{TOPIC_ICON[topic.content_type]}</div>
                    <div className="tcm-lesson-info">
                      <div className="tcm-lesson-title">{topic.title}</div>
                      <div className="tcm-lesson-subinfo">
                        <span className={`td-badge td-badge-gray`} style={{ fontSize: "0.65rem" }}>{topic.content_type}</span>
                      </div>
                    </div>
                    <div className="tcm-lesson-actions">
                      <button className="tcm-icon-btn"><Edit2 size={15} /></button>
                      <button className="tcm-icon-btn danger" onClick={() => handleDeleteTopic(topic.id)}><Trash2 size={15} /></button>
                    </div>
                  </div>
                </div>
              ))}
              {topics.length === 0 && !loading && <p className="td-empty-text">No topics found for this unit.</p>}
            </div>

            {/* Quick Uploads */}
            <div className="tcm-uploads-grid" style={{ marginTop: '2rem' }}>
              <label className="tcm-upload-zone" style={{ cursor: 'pointer' }}>
                <input type="file" hidden accept="video/*" onChange={e => e.target.files?.[0] && handleTopicUpload('video', e.target.files[0])} />
                <Video size={24} />
                <div className="tcm-upload-label">Quick Video</div>
              </label>
              <label className="tcm-upload-zone" style={{ cursor: 'pointer' }}>
                <input type="file" hidden accept=".pdf,.doc,.docx" onChange={e => e.target.files?.[0] && handleTopicUpload('notes_file', e.target.files[0])} />
                <FileText size={24} />
                <div className="tcm-upload-label">Quick Notes</div>
              </label>
              <label className="tcm-upload-zone" style={{ cursor: 'pointer' }}>
                <input type="file" hidden accept="audio/*" onChange={e => e.target.files?.[0] && handleTopicUpload('audio', e.target.files[0])} />
                <Mic size={24} />
                <div className="tcm-upload-label">Quick Audio</div>
              </label>
            </div>
            {uploading && <p style={{ fontSize: '0.8rem', color: 'var(--teacher-primary)', marginTop: '0.5rem' }}>⌛ Processing...</p>}
          </div>
        </div>
      </div>

      {/* Add Topic Modal */}
      {showAddTopic && (
        <div className="td-modal-overlay" onClick={() => setShowAddTopic(false)}>
          <div className="td-modal" onClick={e => e.stopPropagation()}>
            <div className="td-modal-header">
              <div className="td-modal-title">New Topic</div>
              <button className="td-modal-close" onClick={() => setShowAddTopic(false)}>✕</button>
            </div>
            <form onSubmit={handleAddTopic}>
              <div className="td-modal-body">
                <div className="td-form-group">
                  <label className="td-label">Topic Title *</label>
                  <input className="td-input" required value={newTopic.title} onChange={e => setNewTopic({ ...newTopic, title: e.target.value })} />
                </div>
                <div className="td-form-group">
                  <label className="td-label">Content Type</label>
                  <select className="td-input" value={newTopic.content_type} onChange={e => setNewTopic({ ...newTopic, content_type: e.target.value })}>
                    <option value="text">Text / Notes</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                  </select>
                </div>
              </div>
              <div className="td-modal-footer">
                <button type="button" className="td-btn td-btn-outline" onClick={() => setShowAddTopic(false)}>Cancel</button>
                <button type="submit" className="td-btn td-btn-primary">Create Topic</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherContentManagement;
