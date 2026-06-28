import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { citiesApi } from '../api';
import { Search, Star } from 'lucide-react';
import { cityBannerGradient } from '../constants/cityBannerGradients';
import { getCityImage } from '../utils/cityImages';
import { CityImage } from '../components/CityImage';

interface CityHit {
  id: string;
  name: string;
  state: string;
  type: string;
  region: string;
  description: string;
  popularity?: number;
  costIndex?: string;
  image?: string;
}

interface CityTypeOption {
  id: string;
  label: string;
  emoji?: string;
}

export default function CitySearch() {
  const [cities, setCities] = useState<CityHit[]>([]);
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [region, setRegion] = useState('');
  const [types, setTypes] = useState<CityTypeOption[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    citiesApi.types().then(r => setTypes(r.data as CityTypeOption[]));
    citiesApi.regions().then(r => setRegions(r.data as string[]));
  }, []);

  useEffect(() => {
    setLoading(true);
    citiesApi.list({ q: q || undefined, type: type || undefined, region: region || undefined, page: 1, limit: 50 })
      .then(r => setCities(r.data.data))
      .finally(() => setLoading(false));
  }, [q, type, region]);

  const emojiMap: Record<string, string> = {
    'hill-station': '⛰️', beach: '🏖️', heritage: '🏛️',
    tropical: '🌴', desert: '🏜️', wildlife: '🐯', metro: '🏙️',
  };

  return (
    <Layout title="Explore Cities">
      <div className="mb-6">
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Explore India 🇮🇳</h2>
        <p className="text-muted text-sm">Discover amazing destinations across the subcontinent</p>
      </div>

      {/* Search + filters */}
      <div className="card card-p mb-6">
        <div className="grid-2" style={{ alignItems: 'end', gap: 12 }}>
          <div>
            <div className="form-label">Search</div>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input" style={{ paddingLeft: 38 }} placeholder="City, state, or keyword..." value={q} onChange={e => setQ(e.target.value)} />
            </div>
          </div>
          <div className="grid-2" style={{ gap: 10 }}>
            <div>
              <div className="form-label">Type</div>
              <select className="select" value={type} onChange={e => setType(e.target.value)}>
                <option value="">All Types</option>
                {types.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>)}
              </select>
            </div>
            <div>
              <div className="form-label">Region</div>
              <select className="select" value={region} onChange={e => setRegion(e.target.value)}>
                <option value="">All Regions</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Type pills */}
      <div className="dest-types mb-4">
        <button className={`dest-pill${type === '' ? ' active' : ''}`} onClick={() => setType('')}>🌏 All</button>
        {types.map(t => (
          <button key={t.id} className={`dest-pill${type === t.id ? ' active' : ''}`} onClick={() => setType(type === t.id ? '' : t.id)}>
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 12, color: 'var(--text-muted)', fontSize: 13 }}>
        Showing {cities.length} destination{cities.length !== 1 ? 's' : ''}
      </div>

      <div className="grid-auto">
        {cities.map((city, i) => (
          <motion.div key={city.id} className="trip-card"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 8) * 0.05 }}>
            <div className="trip-card-banner" style={{ position: 'relative', overflow: 'hidden' }}>
              <CityImage 
                src={getCityImage(city.image || city.id)} 
                alt={city.name}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.65))' }} />
              <div style={{ position: 'absolute', top: 12, right: 12 }}>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(8px)' }}>
                  {city.type.replace('-', ' ')}
                </span>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px 16px 16px', background: 'linear-gradient(transparent, rgba(0,0,0,0.5))', color: 'white' }}>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{city.name}</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>{city.state}</div>
              </div>
            </div>
            <div className="trip-card-body">
              <p className="text-sm text-muted" style={{ marginBottom: 10, lineHeight: 1.5 }}>{city.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-muted">
                  <Star size={12} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                  {city.popularity ?? 0}% popular
                </div>
                <div className="flex gap-2 items-center">
                  <span className={`badge badge-${city.costIndex === 'high' ? 'red' : city.costIndex === 'medium' ? 'orange' : 'green'}`}>
                    {city.costIndex === 'high' ? '₹₹₹' : city.costIndex === 'medium' ? '₹₹' : '₹'}
                  </span>
                  <span className="badge badge-sky">{city.region.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Layout>
  );
}
