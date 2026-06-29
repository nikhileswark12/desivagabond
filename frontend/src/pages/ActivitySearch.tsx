import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { activitiesApi } from '../api';
import { useActivities } from '../hooks/useActivities';
import { Search, Clock } from 'lucide-react';

interface ActivityCategory {
  id: string;
  label: string;
  emoji?: string;
}


export default function ActivitySearch() {
  const [categories, setCategories] = useState<ActivityCategory[]>([]);
  const [q, setQ] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [maxCost, setMaxCost] = useState('');

  const { activities } = useActivities({ q: q || undefined, city: city || undefined, category: category || undefined, maxCost: maxCost || undefined, page: 1, limit: 50 });

  useEffect(() => {
    activitiesApi.categories().then(r => setCategories(r.data as ActivityCategory[]));
  }, []);

  const catColors: Record<string, string> = {
    adventure: '#a3453a',
    cultural: '#6b5262',
    sightseeing: '#684b35',
    food: '#b88628',
    leisure: '#7d6246',
    wellness: '#8b6914',
  };

  return (
    <Layout title="Activity Search">
      <div className="mb-6">
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Discover Activities 🎯</h2>
        <p className="text-muted text-sm">Browse things to do across India</p>
      </div>

      {/* Filters */}
      <div className="card card-p mb-6">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, alignItems: 'end' }}>
          <div>
            <div className="form-label">Search</div>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input" style={{ paddingLeft: 38 }} placeholder="Activity name..." value={q} onChange={e => setQ(e.target.value)} />
            </div>
          </div>
          <div>
            <div className="form-label">City</div>
            <input className="input" placeholder="e.g. Goa" value={city} onChange={e => setCity(e.target.value)} />
          </div>
          <div>
            <div className="form-label">Category</div>
            <select className="select" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">All</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
            </select>
          </div>
          <div>
            <div className="form-label">Max Cost (₹)</div>
            <input className="input" type="number" placeholder="Any" value={maxCost} onChange={e => setMaxCost(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Category pills */}
      <div className="dest-types mb-4">
        <button className={`dest-pill${category === '' ? ' active' : ''}`} onClick={() => setCategory('')}>🎯 All</button>
        {categories.map(c => (
          <button key={c.id} className={`dest-pill${category === c.id ? ' active' : ''}`} onClick={() => setCategory(category === c.id ? '' : c.id)}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 12, color: 'var(--text-muted)', fontSize: 13 }}>
        {activities.length} activit{activities.length !== 1 ? 'ies' : 'y'} found
      </div>

      <div className="grid-auto">
        {activities.map((act, i) => {
          const color = catColors[act.category] || '#684b35';
          return (
            <motion.div key={act.id} className="card"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 8) * 0.05 }}
              style={{ overflow: 'hidden' }}>
              <div style={{ height: 8, background: color }} />
              <div style={{ padding: 18 }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge" style={{ background: color + '20', color }}>
                    {categories.find(c => c.id === act.category)?.emoji} {act.category}
                  </span>
                  <span className="badge badge-sky">📍 {act.city}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{act.name}</h3>
                <p className="text-sm text-muted" style={{ marginBottom: 12, lineHeight: 1.5 }}>{act.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 text-sm text-muted">
                    <span className="flex items-center gap-1"><Clock size={13} /> {act.duration}h</span>
                  </div>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 17, color: act.cost === 0 ? 'var(--success)' : 'var(--accent)' }}>
                    {act.cost === 0 ? 'FREE' : `₹${act.cost.toLocaleString()}`}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Layout>
  );
}
