import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext.jsx';

const RegisterPage = () => {
  const { register, getErrorMessage } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s += 1;
    if (/[A-Z]/.test(p)) s += 1;
    if (/[0-9]/.test(p)) s += 1;
    if (/[^A-Za-z0-9]/.test(p)) s += 1;
    return s;
  })();
  const strengthColor = ['#EF4444', '#EF4444', '#F59E0B', '#10B981', '#10B981'][strength];
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const user = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate(user?.role === 'admin' ? '/admin' : '/', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% 0%,rgba(139,92,246,0.06),transparent)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,#8B5CF6,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <UserPlus size={22} color="#fff" strokeWidth={2} />
          </div>
          <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 30, color: '#F1F0F5', margin: '0 0 6px', fontWeight: 400 }}>Create account</h1>
          <p style={{ color: '#4B5563', fontSize: 14, margin: 0 }}>Join the Digital Noticeboard</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: 'rgba(20,20,27,0.8)', backdropFilter: 'blur(20px)', border: '1px solid #22222E', borderRadius: 16, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#EF4444', fontSize: 13 }}>
              {error}
            </div>
          )}
          {[
            ['name', 'Name', 'Jordan Mercer', 'text'],
            ['email', 'Email', 'you@university.edu', 'email'],
          ].map(([k, label, ph, type]) => (
            <div key={k}>
              <label style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, letterSpacing: '0.05em', display: 'block', marginBottom: 7 }}>{label.toUpperCase()}</label>
              <input
                value={form[k]}
                onChange={set(k)}
                type={type}
                placeholder={ph}
                style={{ width: '100%', background: '#0A0A0F', border: '1px solid #22222E', borderRadius: 9, padding: '11px 14px', color: '#D1D5DB', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, letterSpacing: '0.05em', display: 'block', marginBottom: 7 }}>PASSWORD</label>
            <input
              value={form.password}
              onChange={set('password')}
              type="password"
              placeholder="Min. 6 characters"
              style={{ width: '100%', background: '#0A0A0F', border: '1px solid #22222E', borderRadius: 9, padding: '11px 14px', color: '#D1D5DB', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
            {form.password && (
              <div style={{ marginTop: 10 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? strengthColor : '#22222E', transition: 'background 0.2s' }} />
                  ))}
                </div>
                <span style={{ fontSize: 11, color: strengthColor, fontWeight: 600 }}>{strengthLabel}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: 12, background: '#06B6D4', border: 'none', borderRadius: 9, color: '#000', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 4 }}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
          <p style={{ textAlign: 'center', fontSize: 13, color: '#4B5563', margin: 0 }}>
            Already have an account?{' '}
            <button type="button" onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#06B6D4', cursor: 'pointer', fontSize: 13, padding: 0 }}>
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
