import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { sharedApi } from '../api';
import { Calendar, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

interface SharedTripStop {
  id: string;
  orderIndex: number;
  cityName: string;
  state?: string;
  arrivalDate: string;
  departureDate: string;
  updatedAt: string;
}

interface SharedBudgetSnap {
  amount: number | string;
}

interface SharedTripPayload {
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
  stops?: SharedTripStop[];
  budgetItems?: SharedBudgetSnap[];
}

export default function SharedItinerary() {
  const { token } = useParams();
  const [trip, setTrip] = useState<SharedTripPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!token) return;
    sharedApi.get(token).then(r => setTrip(r.data as SharedTripPayload)).catch(() => setNotFound(true)).finally(() => setLoading(false));
  }, [token]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied! 🔗');
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: 24 }}>🌏 Loading...</div>;
  if (notFound || !trip) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>🔒</div>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Trip not found or not public</h2>
    </div>
  );

  const stops = [...(trip.stops || [])].sort((a, b) => a.orderIndex - b.orderIndex);
  const totalDays = Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / 86400000);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', fontFamily: 'var(--font-body)', maxWidth: 760, margin: '0 auto', padding: '24px 20px' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ overflow: 'hidden', marginBottom: 24 }}>
        <div style={{
          height: 200,
          background: 'radial-gradient(circle at 20% 30%, rgba(255,251,244,0.14), transparent 45%), linear-gradient(135deg, var(--sky-700), var(--accent), color-mix(in srgb, var(--accent-brass) 45%, var(--sky-600)))',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--white)',
          padding: 24,
        }}>
          <div style={{ fontSize: 60, marginBottom: 8 }}>⚓</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, letterSpacing: '0.04em', textAlign: 'center' }}>{trip.name}</h1>
          <div style={{ opacity: 0.85, marginTop: 8, display: 'flex', gap: 16, fontSize: 14 }}>
            <span><Calendar size={13} style={{ display: 'inline', marginRight: 4 }} />{trip.startDate} → {trip.endDate}</span>
            <span>{totalDays} days · {stops.length} stops</span>
          </div>
        </div>
        <div style={{ padding: '14px 20px', display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline btn-sm" onClick={copyLink}><Copy size={14} /> Copy Link</button>
          <button className="btn btn-primary btn-sm" onClick={() => window.open('/', '_blank')}><span>Create Your Own Trip 🚀</span></button>
        </div>
      </motion.div>

      {trip.description && (
        <div className="card card-p mb-6">
          <p style={{ lineHeight: 1.7 }}>{trip.description}</p>
        </div>
      )}

      {/* Itinerary */}
      <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Itinerary</h2>
      <div className="timeline">
        {stops.map((stop, i) => {
          const days = Math.ceil((new Date(stop.departureDate).getTime() - new Date(stop.arrivalDate).getTime()) / 86400000) + 1;
          return (
            <motion.div key={stop.id} className="timeline-item" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="timeline-dot" />
              <div className="card card-p" style={{ marginLeft: 8, marginBottom: 12 }}>
                <div className="flex items-center justify-between mb-2">
                  <h3 style={{ fontWeight: 700, fontSize: 17 }}>📍 {stop.cityName}</h3>
                  <span className="badge badge-sky">{days} day{days !== 1 ? 's' : ''}</span>
                </div>
                {stop.state && <div className="text-sm text-muted mb-1">{stop.state}</div>}
                <div className="text-sm text-muted">{stop.arrivalDate} → {stop.departureDate}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Budget summary */}
      {trip.budgetItems?.length > 0 && (
        <div className="card card-p mt-6">
          <h3 style={{ fontWeight: 700, marginBottom: 12 }}>💰 Budget Overview</h3>
          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--accent)', marginBottom: 8 }}>
            ₹{trip.budgetItems.reduce((s, row) => s + Number(row.amount), 0).toLocaleString()}
          </div>
          <p className="text-sm text-muted">Estimated total trip cost</p>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 40, color: 'var(--text-muted)', fontSize: 13 }}>
        Shared via <strong style={{ color: 'var(--accent-brass)' }}>DesiVagabond</strong> — From the voyager&apos;s chart · desivagabond.app
      </div>
    </div>
  );
}
