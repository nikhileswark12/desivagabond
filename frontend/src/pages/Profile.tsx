import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useStore } from '../store';
import { authApi } from '../api';
import toast from 'react-hot-toast';
import { User, Mail, Globe, Trash2, Save } from 'lucide-react';

export default function Profile() {
  const { user, setUser, logout } = useStore();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', language: 'en', avatar: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    authApi.me().then(r => {
      const u = r.data;
      setForm({ name: u.name || '', email: u.email || '', language: u.language || 'en', avatar: u.avatar || '' });
    });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await import('../api').then(m => m.default.put('/users/profile', form));
      setUser({ ...user!, name: res.data.name, email: res.data.email });
      toast.success('Profile updated ✅');
    } catch {
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title="Profile">
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Profile & Settings 👤</h2>

        {/* Avatar section */}
        <motion.div className="card card-p mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4">
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,var(--sky-400),var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: 'white', fontWeight: 700, flexShrink: 0 }}>
              {form.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20 }}>{form.name}</div>
              <div className="text-muted text-sm">{form.email}</div>
              <span className="badge badge-sky mt-2">{user?.role === 'admin' ? '👑 Admin' : '✈️ Traveler'}</span>
            </div>
          </div>
        </motion.div>

        {/* Edit form */}
        <motion.div className="card card-p-lg mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Account Information</h3>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input" style={{ paddingLeft: 38 }} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input" style={{ paddingLeft: 38 }} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Language Preference</label>
            <div style={{ position: 'relative' }}>
              <Globe size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <select className="select" style={{ paddingLeft: 38 }} value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}>
                <option value="en">🇬🇧 English</option>
                <option value="hi">🇮🇳 हिंदी (Hindi)</option>
                <option value="ta">🇮🇳 தமிழ் (Tamil)</option>
                <option value="te">🇮🇳 తెలుగు (Telugu)</option>
                <option value="kn">🇮🇳 ಕನ್ನಡ (Kannada)</option>
              </select>
            </div>
          </div>

          <button className="btn btn-primary" onClick={save} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </motion.div>

        {/* Danger zone */}
        <motion.div className="card card-p" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ borderColor: 'var(--danger)', borderWidth: 1 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--danger)' }}>⚠️ Danger Zone</h3>
          <p className="text-sm text-muted mb-4">Deleting your account is permanent. All trips, notes, and data will be lost.</p>
          <button className="btn btn-danger btn-sm" onClick={() => {
            if (confirm('Delete account permanently? This cannot be undone.')) {
              import('../api').then(m => m.default.delete('/users/account')).then(() => logout());
            }
          }}>
            <Trash2 size={14} /> Delete My Account
          </button>
        </motion.div>
      </div>
    </Layout>
  );
}
