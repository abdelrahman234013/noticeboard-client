import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 96, color: '#06B6D4', lineHeight: 1, margin: 0 }}>404</div>
        <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 26, color: '#F1F0F5', margin: '14px 0 8px', fontWeight: 400 }}>Page not found</div>
        <p style={{ color: '#4B5563', fontSize: 14, margin: '0 0 24px' }}>The page you requested could not be found.</p>
        <Link
          to="/"
          style={{ display: 'inline-block', padding: '10px 20px', borderRadius: 9, background: '#06B6D4', color: '#000', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
