import { Bell, CheckCircle, Eye, FileText, Pin, Plus, Shield, Tag, TrendingUp, Users, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getAnalyticsOverview } from '../../api/analyticsApi.js';
import { getAdminNotices } from '../../api/noticeApi.js';
import { getUserStats } from '../../api/userApi.js';
import { CategoryBadge } from '../../components/common/Badges.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import Loader from '../../components/common/Loader.jsx';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { timeAgo } from '../../utils/format.js';

const StatCard = ({ label, value, sub, color, icon: Icon }) => (
  <div style={{ background: '#14141B', border: '1px solid #22222E', borderRadius: 14, padding: '20px 22px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
      <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4B5563', fontWeight: 600 }}>{label}</div>
      {Icon && (
        <div style={{ width: 32, height: 32, borderRadius: 9, background: `${color || '#06B6D4'}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={15} color={color || '#06B6D4'} strokeWidth={1.5} />
        </div>
      )}
    </div>
    <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 34, color: '#F1F0F5', lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: '#4B5563', marginTop: 6 }}>{sub}</div>}
  </div>
);

const ActionBtn = ({ label, onClick, variant = 'primary', icon: Icon }) => {
  const styles = {
    primary: { background: '#06B6D4', color: '#000', border: 'none' },
    secondary: { background: 'transparent', color: '#9CA3AF', border: '1px solid #22222E' },
  };
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ ...styles[variant], display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
    >
      {Icon && <Icon size={14} strokeWidth={2} />}
      {label}
    </button>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [ovRes, usRes, recRes] = await Promise.all([
          getAnalyticsOverview(),
          getUserStats(),
          getAdminNotices({ page: 1, limit: 5 }),
        ]);
        setOverview(ovRes?.data || null);
        setUserStats(usRes?.data || null);
        setRecent(recRes?.data?.items || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 28, color: '#F1F0F5', margin: '0 0 5px', fontWeight: 400 }}>
            {greeting}, {user?.name?.split(' ')[0] || 'Admin'}.
          </h1>
          <p style={{ color: '#4B5563', fontSize: 14, margin: 0 }}>Here&apos;s what&apos;s happening on your noticeboard today.</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <Loader text="Loading dashboard..." />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16, marginBottom: 32 }}>
            <StatCard label="Total Notices" value={overview?.totalNotices ?? 0} icon={FileText} color="#06B6D4" />
            <StatCard label="Active" value={overview?.activeNotices ?? 0} icon={CheckCircle} color="#10B981" />
            <StatCard label="Expired" value={overview?.expiredNotices ?? 0} icon={XCircle} color="#EF4444" />
            <StatCard label="Pinned" value={overview?.pinnedNotices ?? 0} icon={Pin} color="#8B5CF6" />
            <StatCard label="Categories" value={overview?.totalCategories ?? 0} icon={Tag} color="#F59E0B" />
            <StatCard label="Total Views" value={(overview?.totalViews ?? 0).toLocaleString()} icon={Eye} color="#06B6D4" />
          </div>

          <div style={{ marginBottom: 12, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4B5563', fontWeight: 600 }}>User Insights</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16, marginBottom: 36 }}>
            <StatCard label="Total Users" value={userStats?.totalUsers ?? 0} icon={Users} color="#8B5CF6" />
            <StatCard label="Admins" value={userStats?.admins ?? 0} icon={Shield} color="#06B6D4" />
            <StatCard label="Subscribed" value={userStats?.subscribedUsers ?? 0} icon={Bell} color="#10B981" />
            <StatCard label="New This Week" value={userStats?.newUsersThisWeek ?? 0} icon={TrendingUp} color="#F59E0B" />
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
            <ActionBtn label="Create Notice" icon={Plus} onClick={() => navigate('/admin/notices/create')} />
            <ActionBtn label="Manage Categories" icon={Tag} onClick={() => navigate('/admin/categories')} variant="secondary" />
            <ActionBtn label="Manage Users" icon={Users} onClick={() => navigate('/admin/users')} variant="secondary" />
          </div>

          <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4B5563', fontWeight: 600, marginBottom: 16 }}>Recent Activity</div>
          {recent.length === 0 ? (
            <div style={{ background: '#14141B', border: '1px solid #22222E', borderRadius: 14, padding: 24, color: '#4B5563', fontSize: 14, textAlign: 'center' }}>
              No notices yet. <Link to="/admin/notices/create" style={{ color: '#06B6D4' }}>Create your first notice</Link>.
            </div>
          ) : (
            <div style={{ background: '#14141B', border: '1px solid #22222E', borderRadius: 14, overflow: 'hidden' }}>
              {recent.map((n, i) => (
                <Link
                  key={n._id}
                  to={`/admin/notices/${n._id}/edit`}
                  style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: i < recent.length - 1 ? '1px solid #1A1A24' : 'none', textDecoration: 'none' }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(6,182,212,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={15} color="#06B6D4" strokeWidth={1.5} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, color: '#D1D5DB', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: '#4B5563', marginTop: 2 }}>by {n.author?.name || 'Admin'} · {timeAgo(n.createdAt)}</div>
                  </div>
                  {n.category?.name && <CategoryBadge name={n.category.name} />}
                  <span style={{ fontSize: 12, color: '#4B5563', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Eye size={12} />{n.viewCount || 0}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default DashboardPage;
