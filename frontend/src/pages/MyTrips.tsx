import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { tripsApi } from '../api';
import toast from 'react-hot-toast';
import { Plus, Calendar, MapPin, Trash2, Edit2, Eye } from 'lucide-react';
import { TRIP_CARD_ROTATION_GRADIENTS } from '../constants/cityBannerGradients';

interface TripListItem {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: string;
  isPublic?: boolean;
  stops?: unknown[];
}

const TRIP_IMAGE_POOL = [
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
];

export default function MyTrips() {
  const [trips, setTrips] = useState<TripListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const navigate = useNavigate();

  const load = () => {
    tripsApi.list({ page: 1, limit: 50 }).then(r => setTrips(r.data.data as TripListItem[])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this trip?')) return;
    setDeleting(id);
    try {
      await tripsApi.delete(id);
      toast.success('Trip deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  const statusColor = (status: string) => ({
    draft: 'badge-orange', active: 'badge-green', completed: 'badge-sky'
  }[status] || 'badge-sky');

  if (loading) return <Layout title="My Trips"><div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading trips... ✈️</div></Layout>;

  return (
    <Layout title="My Trips">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>My Trips</h2>
          <p className="text-muted text-sm">{trips.length} trip{trips.length !== 1 ? 's' : ''} planned</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/trips/new')}>
          <Plus size={16} /> New Trip
        </button>
      </div>

      {trips.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 80, marginBottom: 16 }}>🗺️</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>No trips yet</h3>
          <p className="text-muted mb-4">Start planning your first Indian adventure!</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/trips/new')}>
            <Plus size={18} /> Plan Your First Trip
          </button>
        </motion.div>
      ) : (
        <div className="grid-auto">
          {trips.map((trip, i) => (
            <motion.div key={trip.id} className="trip-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              onClick={() => navigate(`/trips/${trip.id}`)}>
              <div className="trip-card-banner" style={{ 
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6)), url(${TRIP_IMAGE_POOL[i % TRIP_IMAGE_POOL.length]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}>
                <div style={{ position: 'absolute', top: 12, right: 12 }}>
                  <span className={`badge ${statusColor(trip.status)}`}>{trip.status}</span>
                </div>
                {trip.isPublic && (
                  <div style={{ position: 'absolute', top: 12, left: 12 }}>
                    <span className="badge badge-green">🌐 Public</span>
                  </div>
                )}
              </div>
              <div className="trip-card-body">
                <div className="trip-card-title">{trip.name}</div>
                {trip.description && <p className="text-sm text-muted truncate" style={{ marginBottom: 8 }}>{trip.description}</p>}
                <div className="flex gap-2 flex-col" style={{ marginBottom: 12 }}>
                  <div className="flex items-center gap-1 text-sm text-muted">
                    <Calendar size={13} />
                    {trip.startDate} → {trip.endDate}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted">
                    <MapPin size={13} />
                    {trip.stops?.length || 0} stop{trip.stops?.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}
                    onClick={e => { e.stopPropagation(); navigate(`/trips/${trip.id}`); }}>
                    <Eye size={14} /> View
                  </button>
                  <button className="btn btn-outline btn-sm"
                    onClick={e => { e.stopPropagation(); navigate(`/trips/${trip.id}/edit`); }}>
                    <Edit2 size={14} />
                  </button>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}
                    onClick={e => handleDelete(trip.id, e)} disabled={deleting === trip.id}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Layout>
  );
}
