import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { useTrips, useTrip } from '../hooks/useTrips';
import { useCities } from '../hooks/useCities';
import { useAddStop, useDeleteStop, useReorderStops } from '../hooks/useStops';
import toast from 'react-hot-toast';
import { Plus, Trash2, GripVertical, Calendar, Search, X, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

function StopItem({ stop, onDelete }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: stop.id });
  const [expanded, setExpanded] = useState(false);
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="card card-p" {...attributes}>
      <div className="flex items-center gap-3">
        <span {...listeners} style={{ cursor: 'grab', color: 'var(--text-muted)', flexShrink: 0 }}>
          <GripVertical size={18} />
        </span>
        <div style={{ flex: 1 }}>
          <div className="flex items-center justify-between">
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>📍 {stop.cityName}</div>
              {stop.state && <div className="text-sm text-muted">{stop.state}</div>}
              <div className="text-sm text-muted flex items-center gap-1 mt-1">
                <Calendar size={12} /> {stop.arrivalDate} → {stop.departureDate}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-ghost btn-icon" onClick={() => setExpanded(!expanded)}>
                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <button className="btn btn-ghost btn-icon" style={{ color: 'var(--danger)' }} onClick={() => onDelete(stop.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          {stop.stopActivities && stop.stopActivities.length > 0 && (
            <div className="flex gap-2 mt-2" style={{ flexWrap: 'wrap' }}>
              {stop.stopActivities.slice(0, 3).map((sa: any) => (
                <span key={sa.id} className="badge badge-sky text-xs">{sa.activity.name}</span>
              ))}
              {stop.stopActivities.length > 3 && <span className="badge badge-sky text-xs">+{stop.stopActivities.length - 3}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ItineraryBuilder() {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const [selectedTripId, setSelectedTripId] = useState<string>(paramId || '');
  const [stops, setStops] = useState<any[]>([]);
  const [showAddStop, setShowAddStop] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [stopForm, setStopForm] = useState({ arrivalDate: '', departureDate: '' });

  const { trips: allTrips, loading: tripsLoading } = useTrips({ page: 1, limit: 50 });
  const { cities } = useCities({ page: 1, limit: 100 });
  const { trip, loading } = useTrip(selectedTripId);
  const { addStop } = useAddStop();
  const { deleteStop } = useDeleteStop();
  const { reorderStops } = useReorderStops();

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (!selectedTripId && allTrips && allTrips.length > 0) {
      setSelectedTripId(allTrips[0].id);
      if (allTrips.length === 1) {
        toast('Auto-selected your only trip', { icon: 'ℹ️' });
      }
    }
  }, [allTrips, selectedTripId]);

  useEffect(() => {
    if (trip) {
      setStops([...(trip.stops || [])].sort((a: any, b: any) => a.orderIndex - b.orderIndex));
    } else {
      setStops([]);
    }
  }, [trip]);

  const filteredCities = cities.filter(c =>
    !citySearch || c.name.toLowerCase().includes(citySearch.toLowerCase()) || c.state.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleAddStop = async () => {
    if (!selectedCity || !stopForm.arrivalDate || !stopForm.departureDate) {
      toast.error('Please select a city and dates');
      return;
    }
    try {
      const resData = await addStop(selectedTripId, {
        cityName: selectedCity.name,
        cityId: selectedCity.id,
        state: selectedCity.state,
        region: selectedCity.region,
        ...stopForm,
      });
      setStops(prev => [...prev, resData]);
      setShowAddStop(false);
      setSelectedCity(null);
      setStopForm({ arrivalDate: '', departureDate: '' });
      setCitySearch('');
      toast.success(`${selectedCity.name} added! 📍`);
    } catch {
      toast.error('Failed to add stop');
    }
  };

  const handleDelete = async (stopId: string) => {
    if (!confirm('Remove this stop?')) return;
    try {
      await deleteStop(selectedTripId, stopId);
      setStops(prev => prev.filter(s => s.id !== stopId));
      toast.success('Stop removed');
    } catch {}
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = stops.findIndex(s => s.id === active.id);
    const newIdx = stops.findIndex(s => s.id === over.id);
    const reordered = [...stops];
    const [moved] = reordered.splice(oldIdx, 1);
    reordered.splice(newIdx, 0, moved);
    setStops(reordered);
    try {
      await reorderStops(selectedTripId, reordered.map(s => s.id));
      toast.success('Order updated');
    } catch {}
  };

  if (tripsLoading) return <Layout title="Itinerary Builder"><div style={{ textAlign: 'center', padding: 60 }}>Loading trips... 🗺️</div></Layout>;

  if (allTrips.length === 0) {
    return (
      <Layout title="Itinerary Builder">
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>🗺️</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>No trips yet</h3>
          <p className="text-muted mb-6">Create a trip first before building the itinerary</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/trips/new')}>
            <Plus size={18} /> Create a Trip
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Itinerary Builder">
      {/* Trip selector bar */}
      <div className="card card-p mb-6 flex items-center gap-4" style={{ flexWrap: 'wrap' }}>
        <div style={{ fontWeight: 700, flexShrink: 0 }}>🗺️ Building itinerary for:</div>
        <select className="select" style={{ flex: 1, maxWidth: 320 }} value={selectedTripId}
          onChange={e => setSelectedTripId(e.target.value)}>
          {allTrips.map(t => <option key={t.id} value={t.id}>{t.name} ({t.startDate} → {t.endDate})</option>)}
        </select>
        {trip && (
          <button className="btn btn-outline btn-sm" onClick={() => navigate(`/trips/${selectedTripId}`)}>
            <ArrowRight size={14} /> View Itinerary
          </button>
        )}
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddStop(true)} disabled={!trip}>
          <Plus size={14} /> Add Stop
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>Loading... ✈️</div>
      ) : stops.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📍</div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No stops in {trip?.name}</h3>
          <p className="text-muted mb-4">Add cities to build your journey</p>
          <button className="btn btn-primary btn-lg" onClick={() => setShowAddStop(true)}>
            <Plus size={18} /> Add First Stop
          </button>
        </motion.div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={stops.map(s => s.id)} strategy={verticalListSortingStrategy}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stops.map((stop, i) => (
                <motion.div key={stop.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                  <StopItem stop={stop} onDelete={handleDelete} />
                </motion.div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Add Stop Modal */}
      <AnimatePresence>
        {showAddStop && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              className="card card-p-lg" style={{ width: '100%', maxWidth: 520, maxHeight: '85vh', overflowY: 'auto' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontWeight: 700, fontSize: 18 }}>Add a Stop</h3>
                <button className="btn btn-ghost btn-icon" onClick={() => setShowAddStop(false)}><X size={18} /></button>
              </div>

              <div className="form-group">
                <label className="form-label">Search City</label>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input className="input" style={{ paddingLeft: 38 }} placeholder="e.g. Manali, Goa, Jaipur..." value={citySearch}
                    onChange={e => { setCitySearch(e.target.value); setSelectedCity(null); }} />
                </div>
              </div>

              <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 16 }}>
                {(citySearch ? filteredCities : cities).slice(0, 14).map(city => (
                  <div key={city.id} onClick={() => setSelectedCity(city)}
                    style={{ padding: '10px 12px', borderRadius: 8, cursor: 'pointer', background: selectedCity?.id === city.id ? 'var(--sky-100)' : 'transparent', border: selectedCity?.id === city.id ? '1.5px solid var(--sky-400)' : '1.5px solid transparent', marginBottom: 4, transition: 'all 0.15s' }}>
                    <div style={{ fontWeight: 600 }}>{city.name} <span className="text-sm text-muted">· {city.state}</span></div>
                    <div className="text-xs text-muted">{city.region} · {city.type.replace('-', ' ')}</div>
                  </div>
                ))}
              </div>

              {selectedCity && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ background: 'var(--sky-50)', border: '1px solid var(--sky-200)', borderRadius: 8, padding: 12, marginBottom: 16 }}>
                    <div style={{ fontWeight: 700 }}>📍 {selectedCity.name}, {selectedCity.state}</div>
                    <div className="text-sm text-muted">{selectedCity.description}</div>
                  </div>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Arrival Date</label>
                      <input className="input" type="date" value={stopForm.arrivalDate}
                        onChange={e => setStopForm({ ...stopForm, arrivalDate: e.target.value })} min={trip?.startDate} max={trip?.endDate} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Departure Date</label>
                      <input className="input" type="date" value={stopForm.departureDate}
                        onChange={e => setStopForm({ ...stopForm, departureDate: e.target.value })} min={stopForm.arrivalDate} max={trip?.endDate} />
                    </div>
                  </div>
                </motion.div>
              )}

              <button className="btn btn-primary w-full" style={{ justifyContent: 'center' }} onClick={handleAddStop}>
                <Plus size={16} /> Add to Itinerary
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
