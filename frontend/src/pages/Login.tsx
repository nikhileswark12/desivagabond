import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { authApi } from '../api';
import { useStore } from '../store';
import { useParticleCanvas } from '../hooks/useThree';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

export default function Login() {
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser, setToken, theme } = useStore();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useParticleCanvas(canvasRef, { count: 100, dark: theme === 'dark' });

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === 'forgot') {
        const res = await axios.post('/api/auth/forgot-password', { email: form.email });
        toast.success(res.data.message || 'Check your email for a reset link! 📧');
        setTab('login');
      } else {
        const res = tab === 'login'
          ? await authApi.login(form.email, form.password)
          : await authApi.register(form.name, form.email, form.password);
        setToken(res.data.token);
        setUser(res.data.user);
        toast.success(`Welcome${tab === 'register' ? ' to DesiVagabond' : ' back'}, ${res.data.user.name}! 🌏`);
        navigate('/');
      }
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) && typeof err.response?.data === 'object' && err.response.data && 'message' in err.response.data
        ? String((err.response.data as { message: unknown }).message)
        : 'Something went wrong';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <canvas ref={canvasRef} className="auth-canvas" style={{ width: '100%', height: '100%' }} />

      {/* Background gradient */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: theme === 'dark'
          ? 'radial-gradient(ellipse at 35% 32%, rgba(130,196,207,0.14) 0%, transparent 58%), radial-gradient(ellipse at 78% 68%, rgba(184,134,40,0.1) 0%, transparent 55%), var(--bg-base)'
          : 'radial-gradient(ellipse at 38% 30%, rgba(41,90,97,0.16) 0%, transparent 55%), radial-gradient(ellipse at 72% 72%, rgba(184,134,40,0.09) 0%, transparent 50%), repeating-linear-gradient(0deg, transparent, transparent 19px, var(--chart-grid) 19px, var(--chart-grid) 20px), var(--bg-base)',
      }} />

      <motion.div
        className="auth-panel"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6" style={{ flexDirection: 'column' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(145deg,var(--sky-700), color-mix(in srgb,var(--accent-brass) 40%, var(--accent)))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, boxShadow: '0 8px 28px color-mix(in srgb, var(--accent) 36%, transparent)' }}>
            🌏
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, letterSpacing: '0.03em', background: 'linear-gradient(135deg,var(--accent-brass), var(--sky-700))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center' }}>
              DesiVagabond
            </h1>
            <p className="text-muted text-sm" style={{ textAlign: 'center' }}>Discover India, one voyage at a time</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs mb-6">
          <button className={`tab${tab === 'login' ? ' active' : ''}`} onClick={() => setTab('login')}>Sign In</button>
          <button className={`tab${tab === 'register' ? ' active' : ''}`} onClick={() => setTab('register')}>Create Account</button>
        </div>

        <form onSubmit={handle}>
          {tab === 'register' && (
            <motion.div className="form-group" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="input" style={{ paddingLeft: 38 }} placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
            </motion.div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input" style={{ paddingLeft: 38 }} type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>

          {tab !== 'forgot' && (
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="input" style={{ paddingLeft: 38, paddingRight: 40 }} type={showPw ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
                <button type="button" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {tab === 'login' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                  <button type="button" style={{ background: 'none', border: 'none', color: 'var(--sky-500)', fontSize: 13, cursor: 'pointer' }} onClick={() => setTab('forgot')}>
                    Forgot password?
                  </button>
                </div>
              )}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? '⏳ Please wait...' : tab === 'login' ? '🚀 Sign In' : tab === 'register' ? '✨ Create Account' : '📧 Send Reset Link'}
          </button>
        </form>

        <p className="text-sm text-muted" style={{ textAlign: 'center', marginTop: 20 }}>
          {tab === 'login' ? "Don't have an account? " : tab === 'forgot' ? "Remembered your password? " : "Already have an account? "}
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sky-500)', fontWeight: 600 }} onClick={() => setTab(tab === 'login' || tab === 'forgot' ? 'register' : 'login')}>
            {tab === 'login' || tab === 'forgot' ? 'Sign up free' : 'Sign in'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
