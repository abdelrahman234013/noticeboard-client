import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';

import { getCategories } from '../api/categoryApi.js';
import {
  getMyNotificationHistory,
  getMyPreferences,
  markAllAsRead,
  markAsRead,
  updateMyPreferences,
} from '../api/userApi.js';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import Loader from '../components/common/Loader.jsx';
import { AuthNavbar } from '../components/layout/Navbar.jsx';
import { timeAgo } from '../utils/format.js';

const TYPE_COLORS = {
  new_notice: '#06B6D4',
  urgent: '#EF4444',
  expiry_alert: '#F59E0B',
  system: '#6B7280',
  welcome: '#8B5CF6',
};

const TYPE_LABELS = {
  new_notice: 'New Notice',
  urgent: 'Urgent',
  expiry_alert: 'Expiry Alert',
  system: 'System',
  welcome: 'Welcome',
};

const Toggle = ({ checked, onChange, label, sub }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #1A1A24' }}>
    <div>
      <div style={{ fontSize: 14, color: '#D1D5DB', fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: '#4B5563', marginTop: 3 }}>{sub}</div>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{ width: 44, height: 24, borderRadius: 12, background: checked ? '#06B6D4' : '#22222E', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
    >
      <span style={{ position: 'absolute', top: 3, left: checked ? 22 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', display: 'block' }} />
    </button>
  </div>
);

const NotificationPreferencesPage = () => {
  const [tab, setTab] = useState('preferences');
  const [prefs, setPrefs] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  const [savedNote, setSavedNote] = useState('');

  const [logs, setLogs] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('all');
  const [unreadOnly, setUnreadOnly] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [prefsRes, catsRes] = await Promise.all([getMyPreferences(), getCategories()]);
        setPrefs(prefsRes?.data || null);
        setCategories(catsRes?.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load preferences');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const params = {};
      if (historyFilter !== 'all') params.type = historyFilter;
      if (unreadOnly) params.unread = true;
      const res = await getMyNotificationHistory(params);
      setLogs(res?.data?.logs || []);
      setUnreadCount(res?.data?.unreadCount || 0);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load notifications');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'history') fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, historyFilter, unreadOnly]);

  const setPref = (k, v) => {
    setPrefs((p) => ({ ...p, [k]: v }));
    setDirty(true);
    setSavedNote('');
  };

  const subscribedCategoryIds = (prefs?.subscribedCategories || []).map((c) => c._id || c);
  const toggleCategorySub = (catId) => {
    const current = subscribedCategoryIds;
    const next = current.includes(catId) ? current.filter((id) => id !== catId) : [...current, catId];
    setPrefs((p) => ({ ...p, subscribedCategories: next }));
    setDirty(true);
    setSavedNote('');
  };

  const savePreferences = async () => {
    if (!prefs) return;
    setSavingPrefs(true);
    setError('');
    try {
      const payload = {
        emailNotifications: prefs.emailNotifications,
        notifyOnNewNotice: prefs.notifyOnNewNotice,
        notifyOnUrgent: prefs.notifyOnUrgent,
        notifyOnExpiry: prefs.notifyOnExpiry,
        subscribedCategories: subscribedCategoryIds,
        quietHoursEnabled: prefs.quietHoursEnabled,
        quietHoursStart: prefs.quietHoursStart,
        quietHoursEnd: prefs.quietHoursEnd,
      };
      const res = await updateMyPreferences(payload);
      setPrefs(res?.data || prefs);
      setDirty(false);
      setSavedNote('Preferences saved.');
      setTimeout(() => setSavedNote(''), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save preferences');
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setLogs((ls) => ls.map((l) => (l._id === id ? { ...l, isRead: true, readAt: new Date().toISOString() } : l)));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to mark as read');
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllAsRead();
      setLogs((ls) => ls.map((l) => ({ ...l, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to mark all as read');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F' }}>
      <AuthNavbar />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '36px 24px' }}>
        <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 30, color: '#F1F0F5', fontWeight: 400, margin: '0 0 6px' }}>Notifications</h1>
        <p style={{ color: '#4B5563', fontSize: 14, margin: '0 0 32px' }}>Manage how and when you receive updates from the noticeboard.</p>

        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #22222E', marginBottom: 32 }}>
          {[
            ['preferences', 'Preferences'],
            ['history', `History${unreadCount > 0 ? ` (${unreadCount})` : ''}`],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              style={{ padding: '10px 18px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: tab === id ? '#06B6D4' : '#4B5563', borderBottom: tab === id ? '2px solid #06B6D4' : '2px solid transparent', marginBottom: -1 }}
            >
              {label}
            </button>
          ))}
        </div>

        {error && <ErrorMessage message={error} />}

        {loading ? (
          <Loader text="Loading preferences..." />
        ) : tab === 'preferences' && prefs ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div style={{ background: '#14141B', border: '1px solid #22222E', borderRadius: 14, padding: '20px 24px' }}>
              <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4B5563', fontWeight: 600, marginBottom: 4 }}>Delivery</div>
              <Toggle checked={prefs.emailNotifications} onChange={(v) => setPref('emailNotifications', v)} label="Email Notifications" sub="Receive notice alerts at your registered email address" />
            </div>

            <div style={{ background: '#14141B', border: '1px solid #22222E', borderRadius: 14, padding: '20px 24px' }}>
              <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4B5563', fontWeight: 600, marginBottom: 4 }}>Alert Types</div>
              <Toggle checked={prefs.notifyOnNewNotice} onChange={(v) => setPref('notifyOnNewNotice', v)} label="New Notices" sub="Get notified when a new notice is posted in a subscribed category" />
              <Toggle checked={prefs.notifyOnUrgent} onChange={(v) => setPref('notifyOnUrgent', v)} label="Urgent & Pinned Alerts" sub="Always notify for pinned or high-priority notices" />
              <Toggle checked={prefs.notifyOnExpiry} onChange={(v) => setPref('notifyOnExpiry', v)} label="Expiry Reminders" sub="Alert before notices expire" />
            </div>

            <div style={{ background: '#14141B', border: '1px solid #22222E', borderRadius: 14, padding: '20px 24px' }}>
              <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4B5563', fontWeight: 600, marginBottom: 14 }}>
                Category Subscriptions
              </div>
              <div style={{ fontSize: 12, color: '#4B5563', marginBottom: 14 }}>
                Leave empty to receive notifications from all categories.
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {categories.length === 0 ? (
                  <span style={{ fontSize: 13, color: '#4B5563' }}>No categories yet.</span>
                ) : (
                  categories.map((cat) => {
                    const on = subscribedCategoryIds.includes(cat._id);
                    return (
                      <button
                        key={cat._id}
                        type="button"
                        onClick={() => toggleCategorySub(cat._id)}
                        style={{ padding: '6px 14px', borderRadius: 99, border: `1px solid ${on ? '#06B6D4' : '#22222E'}`, background: on ? 'rgba(6,182,212,0.12)' : 'transparent', color: on ? '#06B6D4' : '#6B7280', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s' }}
                      >
                        {cat.name}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div style={{ background: '#14141B', border: '1px solid #22222E', borderRadius: 14, padding: '20px 24px' }}>
              <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4B5563', fontWeight: 600, marginBottom: 4 }}>Quiet Hours</div>
              <Toggle checked={prefs.quietHoursEnabled} onChange={(v) => setPref('quietHoursEnabled', v)} label="Enable Quiet Hours" sub="Pause email notifications during specified hours" />
              {prefs.quietHoursEnabled && (
                <div style={{ display: 'flex', gap: 20, marginTop: 18 }}>
                  {[['quietHoursStart', 'Start time'], ['quietHoursEnd', 'End time']].map(([k, label]) => (
                    <div key={k} style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: 7 }}>{label.toUpperCase()}</label>
                      <input
                        type="time"
                        value={prefs[k] || ''}
                        onChange={(e) => setPref(k, e.target.value)}
                        style={{ width: '100%', background: '#0A0A0F', border: '1px solid #22222E', borderRadius: 8, padding: '9px 12px', color: '#D1D5DB', fontSize: 13, outline: 'none', boxSizing: 'border-box', colorScheme: 'dark' }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button
                type="button"
                disabled={!dirty || savingPrefs}
                onClick={savePreferences}
                style={{ padding: '10px 24px', background: dirty ? '#06B6D4' : '#1A1A24', border: 'none', borderRadius: 9, color: dirty ? '#000' : '#4B5563', fontSize: 14, fontWeight: 700, cursor: dirty && !savingPrefs ? 'pointer' : 'not-allowed', opacity: savingPrefs ? 0.7 : 1 }}
              >
                {savingPrefs ? 'Saving…' : 'Save Changes'}
              </button>
              {savedNote && <span style={{ fontSize: 13, color: '#10B981' }}>{savedNote}</span>}
            </div>
          </div>
        ) : tab === 'history' ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
              <select
                value={historyFilter}
                onChange={(e) => setHistoryFilter(e.target.value)}
                style={{ background: '#14141B', border: '1px solid #22222E', color: '#9CA3AF', borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none' }}
              >
                <option value="all">All Types</option>
                <option value="new_notice">New Notice</option>
                <option value="urgent">Urgent</option>
                <option value="expiry_alert">Expiry Alert</option>
                <option value="system">System</option>
                <option value="welcome">Welcome</option>
              </select>
              <button
                type="button"
                onClick={() => setUnreadOnly(!unreadOnly)}
                style={{ padding: '8px 14px', borderRadius: 8, border: `1px solid ${unreadOnly ? '#06B6D4' : '#22222E'}`, background: unreadOnly ? 'rgba(6,182,212,0.1)' : 'transparent', color: unreadOnly ? '#06B6D4' : '#6B7280', fontSize: 13, cursor: 'pointer' }}
              >
                Unread only
              </button>
              <button
                type="button"
                onClick={handleMarkAll}
                disabled={unreadCount === 0}
                style={{ marginLeft: 'auto', padding: '8px 14px', borderRadius: 8, border: '1px solid #22222E', background: 'transparent', color: unreadCount === 0 ? '#374151' : '#9CA3AF', fontSize: 13, cursor: unreadCount === 0 ? 'not-allowed' : 'pointer' }}
              >
                Mark all as read
              </button>
            </div>

            {historyLoading ? (
              <Loader text="Loading notifications..." />
            ) : logs.length === 0 ? (
              <EmptyState icon={Bell} heading="No notifications" message="You're all caught up." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {logs.map((n) => (
                  <div key={n._id} style={{ background: '#14141B', border: `1px solid ${n.isRead ? '#22222E' : '#2A2A3E'}`, borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.isRead ? 'transparent' : (TYPE_COLORS[n.type] || '#06B6D4'), flexShrink: 0, marginTop: 6, border: n.isRead ? '1px solid #22222E' : 'none' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                        <span style={{ padding: '2px 8px', borderRadius: 99, background: `${TYPE_COLORS[n.type] || '#06B6D4'}18`, color: TYPE_COLORS[n.type] || '#06B6D4', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em' }}>
                          {TYPE_LABELS[n.type] || n.type}
                        </span>
                        <span style={{ fontSize: 12, color: '#4B5563' }}>{timeAgo(n.createdAt)}</span>
                      </div>
                      <div style={{ fontSize: 14, color: '#D1D5DB', fontWeight: 600, marginBottom: 3 }}>{n.subject}</div>
                      <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{n.message}</div>
                    </div>
                    {!n.isRead && (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(n._id)}
                        style={{ flexShrink: 0, padding: '5px 12px', borderRadius: 7, border: '1px solid #22222E', background: 'transparent', color: '#6B7280', fontSize: 12, cursor: 'pointer' }}
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default NotificationPreferencesPage;
