import { Paperclip, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getCategories } from '../../api/categoryApi.js';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import { formatBytes } from '../../utils/format.js';

const inputStyle = {
  width: '100%',
  background: '#0A0A0F',
  border: '1px solid #22222E',
  borderRadius: 9,
  padding: '11px 14px',
  color: '#D1D5DB',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle = {
  fontSize: 12,
  color: '#6B7280',
  fontWeight: 600,
  letterSpacing: '0.05em',
  display: 'block',
  marginBottom: 8,
};

const sectionLabelStyle = {
  fontSize: 11,
  color: '#9CA3AF',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
};

const toDateInput = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};

const NoticeEditor = ({ mode = 'create', initial = null, onSubmit }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    category: initial?.category?._id || initial?.category || '',
    expiryDate: toDateInput(initial?.expiryDate),
    isPinned: Boolean(initial?.isPinned),
  });
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await getCategories();
        setCategories(res?.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load categories');
      }
    })();
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const togglePinned = () => setForm((f) => ({ ...f, isPinned: !f.isPinned }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.description.trim() || !form.category) {
      setError('Title, description, and category are required.');
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title.trim());
      fd.append('description', form.description.trim());
      fd.append('category', form.category);
      if (form.expiryDate) fd.append('expiryDate', form.expiryDate);
      fd.append('isPinned', String(form.isPinned));
      if (file) fd.append('attachment', file);
      await onSubmit(fd);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save notice');
    } finally {
      setSubmitting(false);
    }
  };

  const isEdit = mode === 'edit';
  const existingAttachment = initial?.attachment;

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 28, color: '#F1F0F5', margin: '0 0 5px', fontWeight: 400 }}>
            {isEdit ? 'Edit Notice' : 'Create Notice'}
          </h1>
          <p style={{ color: '#4B5563', fontSize: 14, margin: 0 }}>
            {isEdit ? 'Update this announcement.' : 'Publish a new announcement to the noticeboard.'}
          </p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 360px', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#14141B', border: '1px solid #22222E', borderRadius: 14, padding: 24 }}>
            <div style={{ ...sectionLabelStyle, marginBottom: 20 }}>Basic Information</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>TITLE</label>
                <input value={form.title} onChange={set('title')} placeholder="e.g. Final Examination Schedule" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>DESCRIPTION</label>
                <textarea
                  value={form.description}
                  onChange={set('description')}
                  placeholder="Write the full notice content here. Supports multiple paragraphs."
                  rows={8}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7, fontFamily: 'inherit' }}
                />
              </div>
            </div>
          </div>

          <div style={{ background: '#14141B', border: '1px solid #22222E', borderRadius: 14, padding: 24 }}>
            <div style={{ ...sectionLabelStyle, marginBottom: 16 }}>Attachment</div>
            {file ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 10 }}>
                <Paperclip size={18} color="#06B6D4" strokeWidth={1.5} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: '#D1D5DB', fontWeight: 600 }}>{file.name}</div>
                  <div style={{ fontSize: 12, color: '#4B5563' }}>{formatBytes(file.size)}</div>
                </div>
                <button type="button" onClick={() => setFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4B5563' }}>
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
                  }}
                  style={{ border: `2px dashed ${dragging ? '#06B6D4' : '#22222E'}`, borderRadius: 10, padding: '36px 24px', textAlign: 'center', transition: 'border-color 0.2s', background: dragging ? 'rgba(6,182,212,0.04)' : 'transparent' }}
                >
                  <Upload size={24} color="#4B5563" strokeWidth={1.5} style={{ margin: '0 auto 10px' }} />
                  <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 6 }}>Drag & drop a file here, or</div>
                  <label style={{ fontSize: 13, color: '#06B6D4', cursor: 'pointer', fontWeight: 600 }}>
                    browse to upload
                    <input type="file" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  </label>
                  <div style={{ fontSize: 12, color: '#374151', marginTop: 8 }}>PDF, DOCX, JPG, PNG up to 5 MB</div>
                </div>
                {isEdit && existingAttachment?.fileName && (
                  <div style={{ marginTop: 12, fontSize: 12, color: '#6B7280' }}>
                    Current attachment: <span style={{ color: '#9CA3AF' }}>{existingAttachment.originalName || existingAttachment.fileName}</span>
                    <span style={{ color: '#4B5563' }}> — uploading a new file will replace it</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#14141B', border: '1px solid #22222E', borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={sectionLabelStyle}>Classification</div>
            <div>
              <label style={labelStyle}>CATEGORY</label>
              <select value={form.category} onChange={set('category')} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Select a category…</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ background: '#14141B', border: '1px solid #22222E', borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={sectionLabelStyle}>Scheduling</div>
            <div>
              <label style={labelStyle}>EXPIRY DATE</label>
              <input type="date" value={form.expiryDate} onChange={set('expiryDate')} style={{ ...inputStyle, colorScheme: 'dark' }} />
            </div>
          </div>

          <div style={{ background: '#14141B', border: '1px solid #22222E', borderRadius: 14, padding: 24 }}>
            <div style={{ ...sectionLabelStyle, marginBottom: 16 }}>Visibility</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 14, color: '#D1D5DB', fontWeight: 500 }}>Pin this notice</div>
                <div style={{ fontSize: 12, color: '#4B5563', marginTop: 2 }}>Appears at the top of all listings</div>
              </div>
              <button
                type="button"
                onClick={togglePinned}
                style={{ width: 44, height: 24, borderRadius: 12, background: form.isPinned ? '#06B6D4' : '#22222E', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}
              >
                <span style={{ position: 'absolute', top: 3, left: form.isPinned ? 22 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', display: 'block' }} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={() => navigate('/admin/notices')}
              style={{ flex: 1, padding: 11, borderRadius: 9, border: '1px solid #22222E', background: 'transparent', color: '#9CA3AF', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{ flex: 2, padding: 11, borderRadius: 9, border: 'none', background: '#06B6D4', color: '#000', fontSize: 14, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Publish Notice'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default NoticeEditor;
