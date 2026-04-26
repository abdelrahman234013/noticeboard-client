import { ArrowLeft, Calendar, Shield, UserX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { activateUser, deactivateUser, getUserById, updateUserRole } from '../../api/userApi.js';
import { StatusBadge } from '../../components/common/Badges.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import Loader from '../../components/common/Loader.jsx';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { initials, timeAgo } from '../../utils/format.js';

const PreferenceRow = ({ label, on }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid #1A1A24' }}>
    <span style={{ fontSize: 13.5, color: '#9CA3AF' }}>{label}</span>
    <div style={{ width: 40, height: 22, borderRadius: 11, background: on ? 'rgba(6,182,212,0.3)' : '#1E1E2A', border: `1px solid ${on ? '#06B6D4' : '#22222E'}`, position: 'relative', opacity: 0.7 }}>
      <span style={{ position: 'absolute', top: 2, left: on ? 19 : 2, width: 16, height: 16, borderRadius: '50%', background: on ? '#06B6D4' : '#4B5563', display: 'block' }} />
    </div>
  </div>
);

const UserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusConfirm, setStatusConfirm] = useState(false);
  const [roleConfirm, setRoleConfirm] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getUserById(id);
      setUser(res?.data?.user || null);
      setPreferences(res?.data?.preferences || null);
      setRecentLogs(res?.data?.recentLogs || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleRoleToggle = async () => {
    if (!user) return;
    setActionLoading(true);
    try {
      await updateUserRole(user._id, user.role === 'admin' ? 'user' : 'admin');
      setRoleConfirm(false);
      await fetchUser();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update role');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!user) return;
    setActionLoading(true);
    try {
      if (user.isActive) await deactivateUser(user._id);
      else await activateUser(user._id);
      setStatusConfirm(false);
      await fetchUser();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update user');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Loader text="Loading user..." />
      </AdminLayout>
    );
  }

  if (error || !user) {
    return (
      <AdminLayout>
        <ErrorMessage message={error || 'User not found'} />
      </AdminLayout>
    );
  }

  const isSelf = currentUser?._id === user._id;
  const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—';

  return (
    <AdminLayout>
      <button
        type="button"
        onClick={() => navigate('/admin/users')}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#4B5563', fontSize: 13, marginBottom: 28, padding: 0 }}
      >
        <ArrowLeft size={15} /> Back to users
      </button>

      <div style={{ background: '#14141B', border: '1px solid #22222E', borderRadius: 16, padding: 28, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ width: 72, height: 72, borderRadius: 18, background: 'linear-gradient(135deg,#06B6D4,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
          {initials(user.name)}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 26, color: '#F1F0F5', margin: '0 0 6px', fontWeight: 400 }}>{user.name}</h1>
          <div style={{ fontSize: 14, color: '#4B5563', marginBottom: 10 }}>{user.email}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <StatusBadge status={user.role} />
            <StatusBadge status={user.isActive ? 'active' : 'inactive'} />
            <span style={{ fontSize: 12, color: '#4B5563', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Calendar size={12} strokeWidth={1.5} /> Member since {memberSince}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#14141B', border: '1px solid #22222E', borderRadius: 14, padding: '22px 24px' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4B5563', fontWeight: 600, marginBottom: 18 }}>
              Notification Preferences
            </div>
            {preferences ? (
              <>
                <PreferenceRow label="Email Notifications" on={preferences.emailNotifications} />
                <PreferenceRow label="New Notices" on={preferences.notifyOnNewNotice} />
                <PreferenceRow label="Urgent Alerts" on={preferences.notifyOnUrgent} />
                <PreferenceRow label="Expiry Reminders" on={preferences.notifyOnExpiry} />
                <PreferenceRow label="Quiet Hours" on={preferences.quietHoursEnabled} />
              </>
            ) : (
              <div style={{ fontSize: 13, color: '#4B5563' }}>This user hasn&apos;t configured preferences yet.</div>
            )}
          </div>

          <div style={{ background: '#14141B', border: '1px solid #22222E', borderRadius: 14, padding: '22px 24px' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4B5563', fontWeight: 600, marginBottom: 16 }}>
              Recent Notifications
            </div>
            {recentLogs.length === 0 ? (
              <div style={{ fontSize: 13, color: '#4B5563' }}>No notifications sent to this user.</div>
            ) : (
              recentLogs.map((n) => (
                <div key={n._id} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid #1A1A24' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: n.isRead ? '#22222E' : '#06B6D4', flexShrink: 0, marginTop: 5 }} />
                  <div>
                    <div style={{ fontSize: 13, color: '#D1D5DB', fontWeight: n.isRead ? 400 : 600, marginBottom: 2 }}>{n.subject}</div>
                    <div style={{ fontSize: 12, color: '#4B5563' }}>{timeAgo(n.createdAt)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ background: '#14141B', border: '1px solid #22222E', borderRadius: 14, padding: '22px 24px' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4B5563', fontWeight: 600, marginBottom: 18 }}>
            Admin Actions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              type="button"
              disabled={isSelf || actionLoading}
              onClick={() => setRoleConfirm(true)}
              style={{ width: '100%', padding: '10px 16px', borderRadius: 9, border: '1px solid #22222E', background: 'transparent', color: isSelf ? '#374151' : '#D1D5DB', fontSize: 13, fontWeight: 600, cursor: isSelf ? 'not-allowed' : 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Shield size={15} color="#06B6D4" strokeWidth={1.5} />
              {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
            </button>
            <button
              type="button"
              disabled={isSelf || actionLoading}
              onClick={() => setStatusConfirm(true)}
              style={{ width: '100%', padding: '10px 16px', borderRadius: 9, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', color: isSelf ? '#374151' : '#EF4444', fontSize: 13, fontWeight: 600, cursor: isSelf ? 'not-allowed' : 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <UserX size={15} strokeWidth={1.5} />
              {user.isActive ? 'Deactivate Account' : 'Activate Account'}
            </button>
            {isSelf && <div style={{ fontSize: 11, color: '#4B5563', marginTop: 4 }}>You can&apos;t modify your own role or status here.</div>}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={roleConfirm}
        title={user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
        message={user.role === 'admin'
          ? `Demote "${user.name}" to a regular user? They will lose admin privileges immediately.`
          : `Promote "${user.name}" to admin? They will gain full access to the admin area.`}
        confirmText={user.role === 'admin' ? 'Demote' : 'Promote'}
        danger={user.role === 'admin'}
        onConfirm={handleRoleToggle}
        onCancel={() => setRoleConfirm(false)}
        loading={actionLoading}
      />

      <ConfirmDialog
        open={statusConfirm}
        title={user.isActive ? 'Deactivate User' : 'Activate User'}
        message={user.isActive
          ? `Deactivate "${user.name}"? They will lose access until reactivated.`
          : `Activate "${user.name}" so they can sign in again?`}
        confirmText={user.isActive ? 'Deactivate' : 'Activate'}
        danger={user.isActive}
        onConfirm={handleStatusToggle}
        onCancel={() => setStatusConfirm(false)}
        loading={actionLoading}
      />
    </AdminLayout>
  );
};

export default UserDetailsPage;
