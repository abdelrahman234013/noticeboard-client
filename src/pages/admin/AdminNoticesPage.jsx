import { FileText, MoreHorizontal, Pin, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { deleteNotice, getAdminNotices, pinNotice, unpinNotice } from '../../api/noticeApi.js';
import { CategoryBadge, StatusBadge } from '../../components/common/Badges.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import Loader from '../../components/common/Loader.jsx';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import { timeAgo } from '../../utils/format.js';

const PER_PAGE = 8;

const computeStatus = (n) => {
  if (n.isExpired || (n.expiryDate && new Date(n.expiryDate) <= new Date())) return 'expired';
  if (!n.isActive) return 'inactive';
  return 'active';
};

const AdminNoticesPage = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });
  const [statusTab, setStatusTab] = useState('active');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [noticeToDelete, setNoticeToDelete] = useState(null);

  const fetchNotices = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAdminNotices({ page, limit: PER_PAGE, status: statusTab, search: search.trim() || undefined });
      setNotices(res?.data?.items || []);
      setPagination(res?.data?.pagination || { page: 1, totalPages: 1, totalItems: 0 });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusTab]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchNotices();
  };

  const handlePinToggle = async (notice) => {
    setActionLoading(true);
    setOpenMenu(null);
    try {
      if (notice.isPinned) await unpinNotice(notice._id);
      else await pinNotice(notice._id);
      await fetchNotices();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update notice');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!noticeToDelete) return;
    setActionLoading(true);
    try {
      await deleteNotice(noticeToDelete._id);
      setNoticeToDelete(null);
      await fetchNotices();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete notice');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 28, color: '#F1F0F5', margin: '0 0 5px', fontWeight: 400 }}>Notices</h1>
          <p style={{ color: '#4B5563', fontSize: 14, margin: 0 }}>Manage all published announcements.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/notices/create')}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 9, background: '#06B6D4', color: '#000', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={14} strokeWidth={2} /> Create Notice
        </button>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', background: '#14141B', border: '1px solid #22222E', borderRadius: 9, padding: 4, gap: 2 }}>
          {['active', 'expired', 'inactive'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => { setStatusTab(s); setPage(1); }}
              style={{ padding: '6px 16px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: statusTab === s ? '#22222E' : 'transparent', color: statusTab === s ? '#D1D5DB' : '#6B7280', textTransform: 'capitalize' }}
            >
              {s}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', background: '#14141B', border: '1px solid #22222E', borderRadius: 8, padding: '0 12px', gap: 8, flex: 1, maxWidth: 320 }}>
          <Search size={14} color="#4B5563" strokeWidth={1.5} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notices…"
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#D1D5DB', fontSize: 13, padding: '8px 0' }}
          />
        </div>
      </form>

      {error && <ErrorMessage message={error} />}

      <div style={{ background: '#14141B', border: '1px solid #22222E', borderRadius: 14, overflow: 'hidden' }}>
        {loading ? (
          <Loader text="Loading notices..." />
        ) : notices.length === 0 ? (
          <EmptyState icon={FileText} heading="No notices" message="No notices match your current filters." />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #22222E' }}>
                {['Title', 'Category', 'Author', 'Status', 'Views', 'Pinned', 'Created', ''].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4B5563', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {notices.map((n) => (
                <tr key={n._id} style={{ borderBottom: '1px solid #1A1A24' }}>
                  <td style={{ padding: '14px 16px', maxWidth: 260 }}>
                    <div style={{ fontSize: 13.5, color: '#D1D5DB', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>{n.category?.name && <CategoryBadge name={n.category.name} />}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#6B7280', whiteSpace: 'nowrap' }}>{n.author?.name || '—'}</td>
                  <td style={{ padding: '14px 16px' }}><StatusBadge status={computeStatus(n)} /></td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#6B7280' }}>{(n.viewCount || 0).toLocaleString()}</td>
                  <td style={{ padding: '14px 16px' }}>{n.isPinned ? <Pin size={14} color="#06B6D4" strokeWidth={1.5} /> : <span style={{ color: '#2A2A3A' }}>—</span>}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#6B7280', whiteSpace: 'nowrap' }}>{timeAgo(n.createdAt)}</td>
                  <td style={{ padding: '14px 16px', position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => setOpenMenu(openMenu === n._id ? null : n._id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4B5563', padding: 4, borderRadius: 6, display: 'flex' }}
                    >
                      <MoreHorizontal size={16} strokeWidth={1.5} />
                    </button>
                    {openMenu === n._id && (
                      <div style={{ position: 'absolute', right: 16, top: 'calc(100% - 4px)', background: '#1E1E2A', border: '1px solid #22222E', borderRadius: 9, padding: 5, zIndex: 50, minWidth: 150, boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}>
                        <button
                          type="button"
                          onClick={() => { setOpenMenu(null); navigate(`/admin/notices/${n._id}/edit`); }}
                          style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#9CA3AF', borderRadius: 6 }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handlePinToggle(n)}
                          style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#9CA3AF', borderRadius: 6 }}
                        >
                          {n.isPinned ? 'Unpin' : 'Pin'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setOpenMenu(null); setNoticeToDelete(n); }}
                          style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#EF4444', borderRadius: 6 }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          {[...Array(pagination.totalPages)].map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i + 1)}
              style={{ width: 34, height: 34, borderRadius: 8, border: page === i + 1 ? 'none' : '1px solid #22222E', background: page === i + 1 ? '#06B6D4' : 'transparent', color: page === i + 1 ? '#000' : '#6B7280', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(noticeToDelete)}
        title="Delete Notice"
        message={`Are you sure you want to delete "${noticeToDelete?.title}"?`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setNoticeToDelete(null)}
        loading={actionLoading}
      />
    </AdminLayout>
  );
};

export default AdminNoticesPage;
