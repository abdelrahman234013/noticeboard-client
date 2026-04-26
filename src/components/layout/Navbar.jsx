import { Bell, ChevronDown, FileText, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getUnreadCount } from '../../api/userApi.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { initials } from '../../utils/format.js';

const PublicNavbar = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #22222E',
        padding: '0 32px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
      }}
    >
      <button
        type="button"
        onClick={() => navigate('/')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: 'linear-gradient(135deg,#06B6D4,#8B5CF6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FileText size={15} color="#fff" strokeWidth={2} />
        </div>
        <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: 18, color: '#F1F0F5', letterSpacing: '-0.01em' }}>
          Noticeboard
        </span>
      </button>

      <form
        onSubmit={onSubmit}
        style={{
          flex: 1,
          maxWidth: 440,
          display: 'flex',
          alignItems: 'center',
          background: '#14141B',
          border: '1px solid #22222E',
          borderRadius: 8,
          padding: '0 14px',
          gap: 10,
        }}
      >
        <Search size={15} color="#4B5563" strokeWidth={1.5} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notices..."
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#D1D5DB', fontSize: 13.5, padding: '8px 0' }}
        />
      </form>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
        <button
          type="button"
          onClick={() => navigate('/login')}
          style={{
            padding: '7px 18px',
            borderRadius: 8,
            background: 'transparent',
            border: '1px solid #22222E',
            color: '#9CA3AF',
            fontSize: 13,
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => navigate('/register')}
          style={{
            padding: '7px 18px',
            borderRadius: 8,
            background: '#06B6D4',
            border: 'none',
            color: '#000',
            fontSize: 13,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Register
        </button>
      </div>
    </nav>
  );
};

export const AuthNavbar = ({ user }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [dropOpen, setDropOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let mounted = true;
    const fetchUnread = async () => {
      try {
        const res = await getUnreadCount();
        if (mounted) setUnread(res?.data?.unreadCount ?? 0);
      } catch {
        // silent
      }
    };
    fetchUnread();
    const id = setInterval(fetchUnread, 30000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore
    }
    navigate('/login');
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #22222E',
        padding: '0 32px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
      }}
    >
      <button
        type="button"
        onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: 'linear-gradient(135deg,#06B6D4,#8B5CF6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FileText size={15} color="#fff" strokeWidth={2} />
        </div>
        <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: 18, color: '#F1F0F5' }}>Noticeboard</span>
      </button>

      <div style={{ flex: 1 }} />

      <button
        type="button"
        onClick={() => navigate('/settings/notifications')}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          width: 38,
          height: 38,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6B7280',
        }}
      >
        <Bell size={18} strokeWidth={1.5} />
        {unread > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: '#EF4444',
              fontSize: 9,
              fontWeight: 700,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      <div ref={ref} style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setDropOpen(!dropOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'none',
            cursor: 'pointer',
            padding: '6px 10px',
            borderRadius: 8,
            border: '1px solid transparent',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg,#06B6D4,#8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: '#fff',
            }}
          >
            {initials(user?.name)}
          </div>
          <span style={{ fontSize: 13, color: '#D1D5DB', fontWeight: 500 }}>{user?.name?.split(' ')[0]}</span>
          <ChevronDown size={14} color="#6B7280" />
        </button>
        {dropOpen && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 8px)',
              background: '#14141B',
              border: '1px solid #22222E',
              borderRadius: 10,
              padding: 6,
              minWidth: 190,
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              zIndex: 100,
            }}
          >
            {[
              ['Notification Settings', () => navigate('/settings/notifications')],
              ['Logout', handleLogout],
            ].map(([label, fn]) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  fn();
                  setDropOpen(false);
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 14px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9CA3AF',
                  fontSize: 13,
                  borderRadius: 6,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1E1E2A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

const Navbar = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Admin layout already renders its own AuthNavbar; don't double up there.
  if (location.pathname.startsWith('/admin')) return null;
  // Same for the notification preferences page (which renders AuthNavbar itself).
  if (location.pathname.startsWith('/settings/notifications')) return null;
  // Login & register pages have their own chrome.
  if (location.pathname === '/login' || location.pathname === '/register') return null;

  if (loading) return null;
  if (!isAuthenticated) return <PublicNavbar />;
  return <AuthNavbar user={user} />;
};

export default Navbar;
