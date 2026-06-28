import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../store';
import { useParticleCanvas } from '../hooks/useThree';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { theme } = useStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  useParticleCanvas(canvasRef, { count: 100, dark: theme === 'dark' });

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/auth/reset-password', { token, newPassword: password });
      toast.success(res.data.message || 'Password reset successfully! ✨');
      navigate('/login');
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
        <div className="flex items-center justify-center gap-3 mb-6" style={{ flexDirection: 'column' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(145deg,var(--sky-700), color-mix(in srgb,var(--accent-brass) 40%, var(--accent)))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, boxShadow: '0 8px 28px color-mix(in srgb, var(--accent) 36%, transparent)' }}>
            🔐
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, textAlign: 'center' }}>
              Reset Password
            </h1>
            <p className="text-muted text-sm" style={{ textAlign: 'center' }}>Choose a strong new password</p>
          </div>
        </div>

        {!token ? (
          <div style={{ textAlign: 'center', color: 'var(--error)' }}>
            No reset token found in URL. Please use the link from your email.
          </div>
        ) : (
          <form onSubmit={handle}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="input" style={{ paddingLeft: 38, paddingRight: 40 }} type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                <button type="button" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: 8 }} disabled={loading}>
              {loading ? '⏳ Please wait...' : '✨ Reset Password'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
