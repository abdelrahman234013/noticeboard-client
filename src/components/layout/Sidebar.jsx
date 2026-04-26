import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/notices', label: 'Notices' },
  { to: '/admin/notices/create', label: 'Create Notice' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/analytics', label: 'Analytics' },
];

const Sidebar = () => {
  return (
    <aside className="card">
      <div className="card-body" style={{ display: 'grid', gap: '0.75rem' }}>
        <h3 style={{ margin: 0 }}>Admin Menu</h3>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-outline'}`}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
