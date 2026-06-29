import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useStore } from '../store';
import { useTrips } from '../hooks/useTrips';
import { useCities } from '../hooks/useCities';
import { Plus, MapPin, Calendar, Star } from 'lucide-react';
import { getCityImage } from '../utils/cityImages';
import { CityImage } from '../components/CityImage';

const DEST_TYPES = [
  { id: '', label: 'All Destinations', emoji: '🌏' },
  { id: 'hill-station', label: 'Hill Stations', emoji: '⛰️' },
  { id: 'beach', label: 'Beaches', emoji: '🏖️' },
  { id: 'heritage', label: 'Heritage', emoji: '🏛️' },
  { id: 'tropical', label: 'Tropical', emoji: '🌴' },
  { id: 'desert', label: 'Desert', emoji: '🏜️' },
  { id: 'wildlife', label: 'Wildlife', emoji: '🐯' },
  { id: 'metro', label: 'Metro', emoji: '🏙️' },
];

const REGIONS = ['All Regions', 'North India', 'South India', 'East India', 'West India', 'Northeast India', 'Islands'];


export default function Dashboard() {
  const { user } = useStore();
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState('');
  const [activeRegion, setActiveRegion] = useState('All Regions');

  const { trips } = useTrips({ page: 1, limit: 5 });
  const { cities } = useCities({ page: 1, limit: 10 });

  const filteredCities = cities
    .filter(c => !activeType || c.type === activeType)
    .filter(c => activeRegion === 'All Regions' || c.region === activeRegion)
    .slice(0, 8);

  const upcoming = trips.filter(t => new Date(t.startDate) >= new Date()).length;

  return (
    <Layout title="Dashboard">
      {/* Hero with globe */}
      <div className="hero" style={{
        background:
          'linear-gradient(to right, rgba(28,22,18,0.8), rgba(28,22,18,0.15)), url("/antique-map-hero.png") center/cover no-repeat',
      }}>

        <div className="hero-content">
          <motion.h2 className="hero-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Namaste, <span style={{ fontFamily: 'var(--font-accent)', fontSize: '1.3em', color: '#e9c48c', verticalAlign: 'middle' }}>{user?.name?.split(' ')[0]}</span> 👋
          </motion.h2>
          <motion.p className="hero-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            Plan your next Indian adventure — from Himalayas to backwaters
          </motion.p>
          <motion.div className="flex gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/trips/new')}>
              <Plus size={18} /> Plan a Trip
            </button>
            <button className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }} onClick={() => navigate('/cities')}>
              <MapPin size={18} /> Explore Cities
            </button>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-6">
        {[
          { icon: '🗺️', label: 'Total Trips', value: trips.length, cls: 'sky' },
          { icon: '✈️', label: 'Upcoming', value: upcoming, cls: 'purple' },
          { icon: '📍', label: 'Cities in India', value: '30+', cls: 'green' },
          { icon: '⭐', label: 'Activities', value: '20+', cls: 'orange' },
        ].map((s, i) => (
          <motion.div key={s.label} className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Destination Types */}
      <div className="mb-2">
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Explore by Type</h2>
        <div className="dest-types">
          {DEST_TYPES.map(d => (
            <button key={d.id} className={`dest-pill${activeType === d.id ? ' active' : ''}`} onClick={() => setActiveType(d.id)}>
              {d.emoji} {d.label}
            </button>
          ))}
        </div>

        {/* Region filter */}
        <div className="flex gap-2 mb-4" style={{ overflowX: 'auto', paddingBottom: 4 }}>
          {REGIONS.map(r => (
            <button key={r} onClick={() => setActiveRegion(r)}
              style={{ padding: '6px 14px', borderRadius: 99, border: '1.5px solid', borderColor: activeRegion === r ? 'var(--sky-500)' : 'var(--border)', background: activeRegion === r ? 'var(--sky-100)' : 'transparent', color: activeRegion === r ? 'var(--sky-700)' : 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
              {r}
            </button>
          ))}
        </div>

        {/* City cards */}
        <div className="grid-auto">
          {filteredCities.map((city, i) => (
            <motion.div key={city.id} className="trip-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/cities?highlight=${city.id}`)}>
              <div className="trip-card-banner" style={{ position: 'relative', overflow: 'hidden' }}>
                <CityImage 
                  src={getCityImage(city.image || city.id)} 
                  alt={city.name}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.65))' }} />
                <div style={{ position: 'absolute', top: 12, right: 12 }}>
                  <span className="badge badge-sky">{city.type.replace('-', ' ')}</span>
                </div>
                <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, color: 'white' }}>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>{city.name}</div>
                  <div style={{ fontSize: 13, opacity: 0.85 }}>{city.state}</div>
                </div>
              </div>
              <div className="trip-card-body">
                <p className="text-sm text-muted" style={{ marginBottom: 10, lineHeight: 1.5 }}>{city.description}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-sm text-muted"><Star size={13} /> {city.popularity}% popular</span>
                  <span className={`badge badge-${city.costIndex === 'high' ? 'red' : city.costIndex === 'medium' ? 'orange' : 'green'}`}>
                    {city.costIndex === 'high' ? '₹₹₹' : city.costIndex === 'medium' ? '₹₹' : '₹'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent trips */}
      {trips.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>Recent Trips</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/trips')}>View all →</button>
          </div>
          <div className="grid-3">
            {trips.map((trip, i) => (
              <motion.div key={trip.id} className="trip-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                onClick={() => navigate(`/trips/${trip.id}`)}>
                <div className="trip-card-banner">
                  <span style={{ fontSize: 48 }}>✈️</span>
                </div>
                <div className="trip-card-body">
                  <div className="trip-card-title">{trip.name}</div>
                  <div className="trip-card-sub flex items-center gap-1"><Calendar size={13} /> {trip.startDate} → {trip.endDate}</div>
                  <div className="trip-card-sub flex items-center gap-1 mt-2"><MapPin size={13} /> {trip.stops?.length || 0} stops</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}

