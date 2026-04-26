import { ArrowLeft, Clock, Download, Eye, Paperclip, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getNoticeDetails } from '../../api/noticeApi.js';
import { CategoryBadge, StatusBadge } from '../../components/common/Badges.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import Loader from '../../components/common/Loader.jsx';
import { formatBytes, timeAgo } from '../../utils/format.js';

const NoticeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await getNoticeDetails(id);
        setNotice(res?.data || null);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load notice');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loader text="Loading notice..." />;
  if (error) return <div style={{ padding: 32, maxWidth: 760, margin: '0 auto' }}><ErrorMessage message={error} /></div>;
  if (!notice) return null;

  const categoryName = notice.category?.name;
  const authorName = notice.author?.name || 'Admin';
  const attachmentUrl = notice.attachment?.url ? `http://localhost:5000${notice.attachment.url}` : null;

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '36px 32px' }}>
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#4B5563', fontSize: 13, marginBottom: 28, padding: 0 }}
        >
          <ArrowLeft size={15} /> Back to notices
        </button>

        <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
          {categoryName && <CategoryBadge name={categoryName} />}
          {notice.isPinned && <StatusBadge status="pinned" />}
        </div>

        <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(28px,4vw,42px)', color: '#F1F0F5', fontWeight: 400, lineHeight: 1.2, margin: '0 0 24px' }}>
          {notice.title}
        </h1>

        <div style={{ display: 'flex', gap: 24, marginBottom: 32, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#4B5563' }}>
            <User size={14} strokeWidth={1.5} /> {authorName}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#4B5563' }}>
            <Clock size={14} strokeWidth={1.5} /> {timeAgo(notice.createdAt)}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#4B5563' }}>
            <Eye size={14} strokeWidth={1.5} /> {(notice.viewCount || 0).toLocaleString()} views
          </span>
        </div>

        <div style={{ borderTop: '1px solid #1A1A24', paddingTop: 32 }}>
          {(notice.description || '').split('\n\n').map((para, i) => {
            if (para.trim().startsWith('-')) {
              const items = para.split('\n').filter((l) => l.trim().startsWith('-'));
              return (
                <ul key={i} style={{ margin: '0 0 20px 20px', padding: 0 }}>
                  {items.map((item, j) => (
                    <li key={j} style={{ color: '#9CA3AF', fontSize: 15, lineHeight: 1.75, marginBottom: 6 }}>
                      {item.replace(/^-\s*/, '')}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} style={{ color: '#9CA3AF', fontSize: 15, lineHeight: 1.8, margin: '0 0 20px', whiteSpace: 'pre-wrap' }}>
                {para}
              </p>
            );
          })}
        </div>

        {notice.attachment?.fileName && attachmentUrl && (
          <div style={{ marginTop: 32, padding: '18px 20px', background: '#14141B', border: '1px solid #22222E', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Paperclip size={18} color="#06B6D4" strokeWidth={1.5} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: '#D1D5DB', fontWeight: 600 }}>
                {notice.attachment.originalName || notice.attachment.fileName}
              </div>
              <div style={{ fontSize: 12, color: '#4B5563', marginTop: 2 }}>
                {notice.attachment.mimeType || 'file'}{notice.attachment.size ? ` · ${formatBytes(notice.attachment.size)}` : ''}
              </div>
            </div>
            <a
              href={attachmentUrl}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#06B6D4', border: 'none', borderRadius: 8, color: '#000', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
            >
              <Download size={14} /> Download
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeDetailsPage;
