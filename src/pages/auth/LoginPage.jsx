import { FileText } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext.jsx';

const LoginPage = () => {
  const { login, getErrorMessage } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const user = await login({ email: email.trim(), password });
      const redirectPath = location.state?.from?.pathname || (user?.role === 'admin' ? '/admin' : '/');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% 0%,rgba(6,182,212,0.06),transparent)' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,#06B6D4,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <FileText size={22} color="#fff" strokeWidth={2} />
          </div>
          <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 30, color: '#F1F0F5', margin: '0 0 6px', fontWeight: 400 }}>Welcome back</h1>
          <p style={{ color: '#4B5563', fontSize: 14, margin: 0 }}>Sign in to your noticeboard account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: 'rgba(20,20,27,0.8)', backdropFilter: 'blur(20px)', border: '1px solid #22222E', borderRadius: 16, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#EF4444', fontSize: 13 }}>
              {error}
            </div>
          )}
          <div>
            <label style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, letterSpacing: '0.05em', display: 'block', marginBottom: 7 }}>EMAIL</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@university.edu"
              style={{ width: '100%', background: '#0A0A0F', border: '1px solid #22222E', borderRadius: 9, padding: '11px 14px', color: '#D1D5DB', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, letterSpacing: '0.05em', display: 'block', marginBottom: 7 }}>PASSWORD</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              style={{ width: '100%', background: '#0A0A0F', border: '1px solid #22222E', borderRadius: 9, padding: '11px 14px', color: '#D1D5DB', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: 12, background: '#06B6D4', border: 'none', borderRadius: 9, color: '#000', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'opacity 0.15s', marginTop: 4 }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
          <p style={{ textAlign: 'center', fontSize: 13, color: '#4B5563', margin: 0 }}>
            Don&apos;t have an account?{' '}
            <button type="button" onClick={() => navigate('/register')} style={{ background: 'none', border: 'none', color: '#06B6D4', cursor: 'pointer', fontSize: 13, padding: 0 }}>
              Register
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
