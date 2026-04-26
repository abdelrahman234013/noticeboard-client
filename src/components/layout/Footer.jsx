import { useLocation } from 'react-router-dom';

const HIDDEN_PREFIXES = ['/admin', '/settings/notifications', '/login', '/register'];

const Footer = () => {
  const location = useLocation();
  if (HIDDEN_PREFIXES.some((p) => location.pathname.startsWith(p))) return null;

  return (
    <footer style={{ borderTop: '1px solid #1A1A24', background: '#0A0A0F', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', fontSize: 12, color: '#4B5563' }}>
        <span>© {new Date().getFullYear()} Digital Noticeboard</span>
        <span>Stay informed.</span>
      </div>
    </footer>
  );
};

export default Footer;
