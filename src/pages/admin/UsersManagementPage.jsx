import { MoreHorizontal, Search, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { activateUser, deactivateUser, getAllUsers, getUserStats, updateUserRole } from '../../api/userApi.js';
import { StatusBadge } from '../../components/common/Badges.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import Loader from '../../components/common/Loader.jsx';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { initials, timeAgo } from '../../utils/format.js';

const PER_PAGE = 10;

const UsersManagementPage = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [openMenu, setOpenMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: PER_PAGE, sort };
      if (roleFilter !== 'all') params.role = roleFilter;
      if (search.trim()) params.search = search.trim();
      const [listRes, statsRes] = await Promise.all([getAllUsers(params), getUserStats()]);
      setUsers(listRes?.data?.users || []);
      setPagination(listRes?.data?.pagination || { page: 1, pages: 1, total: 0 });
      setStats(statsRes?.data || null);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, roleFilter, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const handleRoleToggle = async (u) => {
    setActionLoading(true);
    setOpenMenu(null);
    try {
      await updateUserRole(u._id, u.role === 'admin' ? 'user' : 'admin');
      await fetchData();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update role');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!confirm) return;
    setActionLoading(true);
    try {
      if (confirm.user.isActive) await deactivateUser(confirm.user._id);
      else await activateUser(confirm.user._id);
      setConfirm(null);
      await fetchData();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update user');
    } finally {
      setActionLoading(false);
    }
  };

  const statBoxes = [
    ['Total', stats?.totalUsers ?? 0, '#06B6D4'],
    ['Admins', stats?.admins ?? 0, '#8B5CF6'],
    ['Regular', stats?.regularUsers ?? 0, '#6B7280'],
    ['Subscribed', stats?.subscribedUsers ?? 0, '#10B981'],
    ['Active', stats?.activeUsers ?? 0, '#10B981'],
    ['New This Week', stats?.newUsersThisWeek ?? 0, '#F59E0B'],
  ];

  return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 28, color: '#F1F0F5', margin: '0 0 5px', fontWeight: 400 }}>Users</h1>
          <p style={{ color: '#4B5563', fontSize: 14, margin: 0 }}>Manage accounts, roles, and access.</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 12, marginBottom: 28 }}>
        {statBoxes.map(([label, value, color]) => (
          <div key={label} style={{ background: '#14141B', border: '1px solid #22222E', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: '#4B5563', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
            <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 26, color }}>{value}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#14141B', border: '1px solid #22222E', borderRadius: 8, padding: '0 12px', gap: 8, flex: 1, maxWidth: 320 }}>
          <Search size={14} color="#4B5563" strokeWidth={1.5} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users…"
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#D1D5DB', fontSize: 13, padding: '8px 0' }}
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          style={{ background: '#14141B', border: '1px solid #22222E', color: '#9CA3AF', borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none' }}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          style={{ background: '#14141B', border: '1px solid #22222E', color: '#9CA3AF', borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none' }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">By Name</option>
        </select>
      </form>

      <div style={{ background: '#14141B', border: '1px solid #22222E', borderRadius: 14, overflow: 'hidden' }}>
        {loading ? (
          <Loader text="Loading users..." />
        ) : users.length === 0 ? (
          <EmptyState icon={Users} heading="No users found" message="Try adjusting your filters or search." />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #22222E' }}>
                {['User', 'Email', 'Role', 'Status', 'Last Login', ''].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4B5563', fontWeight: 600 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = currentUser?._id === u._id;
                return (
                  <tr key={u._id} style={{ borderBottom: '1px solid #1A1A24' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/users/${u._id}`)}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#06B6D4,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                          {initials(u.name)}
                        </div>
                        <span style={{ fontSize: 13.5, color: '#D1D5DB', fontWeight: 500 }}>{u.name}</span>
                      </button>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#6B7280' }}>{u.email}</td>
                    <td style={{ padding: '14px 16px' }}><StatusBadge status={u.role} /></td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: u.isActive ? '#10B981' : '#6B7280' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: u.isActive ? '#10B981' : '#6B7280' }} />
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#6B7280' }}>{u.lastLoginAt ? timeAgo(u.lastLoginAt) : '—'}</td>
                    <td style={{ padding: '14px 16px', position: 'relative' }}>
                      <button
                        type="button"
                        onClick={() => setOpenMenu(openMenu === u._id ? null : u._id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4B5563', padding: 4, display: 'flex' }}
                      >
                        <MoreHorizontal size={16} strokeWidth={1.5} />
                      </button>
                      {openMenu === u._id && (
                        <div style={{ position: 'absolute', right: 16, top: 'calc(100% - 4px)', background: '#1E1E2A', border: '1px solid #22222E', borderRadius: 9, padding: 5, zIndex: 50, minWidth: 200, boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}>
                          <button
                            type="button"
                            onClick={() => { setOpenMenu(null); navigate(`/admin/users/${u._id}`); }}
                            style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#9CA3AF', borderRadius: 6 }}
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            disabled={actionLoading || isSelf}
                            onClick={() => handleRoleToggle(u)}
                            style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', cursor: isSelf ? 'not-allowed' : 'pointer', fontSize: 13, color: isSelf ? '#374151' : '#9CA3AF', borderRadius: 6 }}
                          >
                            {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                          </button>
                          <button
                            type="button"
                            disabled={actionLoading || isSelf}
                            onClick={() => { setOpenMenu(null); setConfirm({ user: u }); }}
                            style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', cursor: isSelf ? 'not-allowed' : 'pointer', fontSize: 13, color: isSelf ? '#374151' : u.isActive ? '#EF4444' : '#10B981', borderRadius: 6 }}
                          >
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {pagination.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          {[...Array(pagination.pages)].map((_, i) => (
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
        open={Boolean(confirm)}
        title={confirm?.user?.isActive ? 'Deactivate User' : 'Activate User'}
        message={confirm?.user?.isActive
          ? `Deactivate "${confirm?.user?.name}"? They will lose access until reactivated.`
          : `Activate "${confirm?.user?.name}" so they can sign in again?`}
        confirmText={confirm?.user?.isActive ? 'Deactivate' : 'Activate'}
        danger={confirm?.user?.isActive}
        onConfirm={handleStatusToggle}
        onCancel={() => setConfirm(null)}
        loading={actionLoading}
      />
    </AdminLayout>
  );
};

export default UsersManagementPage;
