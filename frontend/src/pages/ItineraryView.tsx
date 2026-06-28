import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { tripsApi } from '../api';
import { MapPin, Calendar, Clock, Share2, Edit2, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

interface StopActivityRow {
  id: string;
  name: string;
  duration?: number;
  cost?: number;
}

interface TripStopActivityRow {
  id: string;
  activity: StopActivityRow;
}

interface TripStopRow {
  id: string;
  orderIndex: number;
  cityName: string;
  state?: string;
  region?: string;
  arrivalDate: string;
  departureDate: string;
  stopActivities?: TripStopActivityRow[];
  updatedAt: string;
}

interface TripDetailView {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isPublic?: boolean;
  shareToken?: string;
  stops?: TripStopRow[];
}

type TripWithSharePayload = TripDetailView & { shareToken?: string };

export default function ItineraryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<TripDetailView | null>(null);
  const [view, setView] = useState<'timeline' | 'list'>('timeline');
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (!id) return;
    tripsApi.get(id).then(r => setTrip(r.data as TripDetailView)).finally(() => setLoading(false));
  }, [id]);

  const handleShare = async () => {
    setSharing(true);
    try {
      const res = await tripsApi.share(id!, true);
      const data = res.data as TripWithSharePayload;
      setTrip(data);
      const url = `${window.location.origin}/shared/${data.shareToken}`;
      await navigator.clipboard.writeText(url);
      toast.success('Share link copied! 🔗');
    } catch {
      toast.error('Failed to share');
    } finally {
      setSharing(false);
    }
  };

  const stops = [...(trip?.stops || [])].sort((a, b) => a.orderIndex - b.orderIndex);

  const totalDays = trip ? Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / 86400000) : 0;

  if (loading) return <Layout title="Itinerary"><div style={{ textAlign: 'center', padding: 60 }}>Loading... 🗺️</div></Layout>;
  if (!trip) return <Layout title="Itinerary"><div>Trip not found</div></Layout>;

  return (
    <Layout title="Itinerary View">
      {/* Header card */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ overflow: 'hidden', marginBottom: 24 }}>
        <div style={{
          height: 180,
          background: 'linear-gradient(115deg,var(--sky-700) 0%, var(--accent) 45%, color-mix(in srgb, var(--accent-brass) 38%, var(--sky-600)) 100%), radial-gradient(ellipse 70% 80% at 90% -10%, rgba(255,251,244,0.12), transparent 55%)',
          display: 'flex',
          alignItems: 'flex-end',
          padding: 28,
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, opacity: 0.2 }}>✈️</div>
          <div style={{ position: 'relative', color: 'white' }}>
            <h2 style={{ fontSize: 28, fontWeight: 800 }}>{trip.name}</h2>
            <div className="flex gap-4 text-sm mt-1" style={{ opacity: 0.85 }}>
              <span><Calendar size={13} style={{ display: 'inline', marginRight: 4 }} />{trip.startDate} → {trip.endDate}</span>
              <span>{totalDays} days</span>
              <span><MapPin size={13} style={{ display: 'inline', marginRight: 4 }} />{stops.length} stops</span>
            </div>
          </div>
        </div>
        <div style={{ padding: '16px 24px', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn btn-outline btn-sm" onClick={() => navigate(`/itinerary`)}>
            <Edit2 size={14} /> Edit Itinerary
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => navigate(`/budget`)}>
            <DollarSign size={14} /> Budget
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleShare} disabled={sharing}>
            <Share2 size={14} /> {trip.isPublic ? 'Copy Link' : 'Share Trip'}
          </button>
          {trip.isPublic && (
            <span className="badge badge-green" style={{ alignSelf: 'center' }}>🌐 Public</span>
          )}
        </div>
      </motion.div>

      {/* View toggle */}
      <div className="tabs" style={{ maxWidth: 280 }}>
        <button className={`tab${view === 'timeline' ? ' active' : ''}`} onClick={() => setView('timeline')}>📅 Timeline</button>
        <button className={`tab${view === 'list' ? ' active' : ''}`} onClick={() => setView('list')}>📋 List View</button>
      </div>

      {stops.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🗺️</div>
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No stops planned yet</h3>
          <p className="text-muted mb-4">Head to the itinerary builder to add cities</p>
          <button className="btn btn-primary" onClick={() => navigate('/itinerary')}>Build Itinerary</button>
        </div>
      ) : view === 'timeline' ? (
        <div className="timeline mt-4">
          {stops.map((stop, i) => {
            const days = Math.ceil((new Date(stop.departureDate).getTime() - new Date(stop.arrivalDate).getTime()) / 86400000) + 1;
            return (
              <motion.div key={stop.id} className="timeline-item" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <div className="timeline-dot" />
                <div className="card card-p" style={{ marginLeft: 8 }}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: 18 }}>📍 {stop.cityName}</h3>
                      {stop.state && <div className="text-sm text-muted">{stop.state} · {stop.region}</div>}
                    </div>
                    <span className="badge badge-sky">{days} day{days !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted mb-3">
                    <Calendar size={13} /> {stop.arrivalDate} → {stop.departureDate}
                  </div>
                  {stop.stopActivities && stop.stopActivities.length > 0 && (
                    <div>
                      <div className="text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>Activities</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {(stop.stopActivities ?? []).map(sa => {
                          const act = sa.activity;
                          return (
                          <div key={sa.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--sky-50)', borderRadius: 8 }}>
                            <span style={{ fontSize: 14, fontWeight: 500 }}>{act.name}</span>
                            <div className="flex gap-2 text-xs text-muted">
                              <span><Clock size={11} style={{ display: 'inline' }} /> {act.duration}h</span>
                              {act.cost !== undefined && act.cost > 0 && <span>₹{act.cost.toLocaleString()}</span>}
                            </div>
                          </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
          {stops.map((stop, i) => (
            <motion.div key={stop.id} className="card card-p flex items-center gap-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg,var(--sky-400),var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                📍
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{stop.cityName}</div>
                <div className="text-sm text-muted">{stop.arrivalDate} → {stop.departureDate}</div>
              </div>
              <span className="badge badge-sky">{stop.stopActivities?.length || 0} activities</span>
            </motion.div>
          ))}
        </div>
      )}
    </Layout>
  );
}
