import {
  BarChart2,
  Bell,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  Tag,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext.jsx';
import { initials } from '../../utils/format.js';
import { StatusBadge } from '../common/Badges.jsx';
import { AuthNavbar } from './Navbar.jsx';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', Icon: LayoutDashboard, exact: true },
  { path: '/admin/notices', label: 'Notices', Icon: FileText },
  { path: '/admin/categories', label: 'Categories', Icon: Tag },
  { path: '/admin/analytics', label: 'Analytics', Icon: BarChart2 },
  { path: '/admin/users', label: 'Users', Icon: Users },
  { path: '/settings/notifications', label: 'My Notifications', Icon: Bell },
];

const isActivePath = (currentPath, item) => {
  if (item.exact) return currentPath === item.path;
  return currentPath === item.path || currentPath.startsWith(`${item.path}/`);
};

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore
    }
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0A0A0F' }}>
      <aside
        style={{
          width: collapsed ? 68 : 240,
          flexShrink: 0,
          transition: 'width 0.25s ease',
          background: 'rgba(20,20,27,0.9)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid #22222E',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '18px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderBottom: '1px solid #1A1A24',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: 'linear-gradient(135deg,#06B6D4,#8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FileText size={17} color="#fff" strokeWidth={2} />
          </div>
          {!collapsed && (
            <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: 17, color: '#F1F0F5', whiteSpace: 'nowrap' }}>
              Noticeboard
            </span>
          )}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#4B5563',
              padding: 2,
              display: 'flex',
            }}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map(({ path, label, Icon, exact }) => {
            const active = isActivePath(location.pathname, { path, exact });
            return (
              <button
                key={path}
                type="button"
                onClick={() => navigate(path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 9,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  background: active ? 'rgba(6,182,212,0.12)' : 'transparent',
                  color: active ? '#06B6D4' : '#6B7280',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.color = '#D1D5DB';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#6B7280';
                  }
                }}
              >
                <Icon size={17} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                {!collapsed && <span style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap' }}>{label}</span>}
                {!collapsed && active && (
                  <span style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: '#06B6D4' }} />
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '12px 10px', borderTop: '1px solid #1A1A24' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 9,
              background: 'rgba(255,255,255,0.03)',
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
                fontSize: 11,
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
              }}
            >
              {initials(user?.name)}
            </div>
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12.5,
                    color: '#D1D5DB',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user?.name}
                </div>
                <StatusBadge status={user?.role || 'user'} />
              </div>
            )}
            {!collapsed && (
              <button
                type="button"
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4B5563', padding: 2 }}
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <AuthNavbar user={user} />
        <div style={{ flex: 1, padding: '32px 36px', maxWidth: 1280, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
