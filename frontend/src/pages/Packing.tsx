import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { tripsApi } from '../api';
import toast from 'react-hot-toast';
import { Plus, Trash2, RefreshCw, CheckSquare } from 'lucide-react';

const PACK_CATS = [
  { id: 'clothing', label: 'Clothing', emoji: '👕' },
  { id: 'documents', label: 'Documents', emoji: '📄' },
  { id: 'electronics', label: 'Electronics', emoji: '🔋' },
  { id: 'toiletries', label: 'Toiletries', emoji: '🧴' },
  { id: 'general', label: 'General', emoji: '🎒' },
];

const SUGGESTIONS: Record<string, string[]> = {
  clothing: ['T-shirts', 'Jeans', 'Jacket', 'Socks', 'Underwear', 'Swimsuit', 'Raincoat'],
  documents: ['Passport', 'ID Card', 'Tickets', 'Hotel bookings', 'Travel insurance', 'Visa'],
  electronics: ['Phone charger', 'Power bank', 'Earphones', 'Camera', 'Laptop', 'Adapter'],
  toiletries: ['Toothbrush', 'Toothpaste', 'Shampoo', 'Sunscreen', 'Moisturizer', 'Medicines'],
  general: ['Water bottle', 'Snacks', 'Books', 'Umbrella', 'First aid kit', 'Cash'],
};

export default function Packing() {
  const [trips, setTrips] = useState<any[]>([]);
  const [selectedTrip, setSelectedTrip] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [activeCat, setActiveCat] = useState('all');
  const [newItem, setNewItem] = useState('');
  const [newCat, setNewCat] = useState('general');

  useEffect(() => {
    tripsApi.list({ page: 1, limit: 50 }).then(r => {
      setTrips(r.data.data);
      if (r.data.data.length > 0) setSelectedTrip(r.data.data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedTrip) return;
    tripsApi.getPacking(selectedTrip).then(r => setItems(r.data));
  }, [selectedTrip]);

  const filtered = activeCat === 'all' ? items : items.filter(i => i.category === activeCat);
  const packed = items.filter(i => i.isPacked).length;
  const pct = items.length > 0 ? Math.round((packed / items.length) * 100) : 0;

  const addItem = async () => {
    if (!newItem.trim()) return;
    const res = await tripsApi.addPackingItem(selectedTrip, { name: newItem, category: newCat });
    setItems(prev => [...prev, res.data]);
    setNewItem('');
    toast.success('Added to checklist');
  };

  const toggleItem = async (item: any) => {
    const res = await tripsApi.updatePackingItem(selectedTrip, item.id, { isPacked: !item.isPacked });
    setItems(prev => prev.map(i => i.id === item.id ? res.data : i));
  };

  const deleteItem = async (id: string) => {
    await tripsApi.deletePackingItem(selectedTrip, id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const resetAll = async () => {
    for (const item of items.filter(i => i.isPacked)) {
      await tripsApi.updatePackingItem(selectedTrip, item.id, { isPacked: false });
    }
    setItems(prev => prev.map(i => ({ ...i, isPacked: false })));
    toast.success('Checklist reset');
  };

  const addSuggestion = async (name: string, cat: string) => {
    if (items.find(i => i.name === name)) { toast.error('Already in list'); return; }
    const res = await tripsApi.addPackingItem(selectedTrip, { name, category: cat });
    setItems(prev => [...prev, res.data]);
  };

  return (
    <Layout title="Packing Checklist">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>Packing Checklist 🎒</h2>
          <p className="text-muted text-sm">{packed} of {items.length} items packed</p>
        </div>
        <div className="flex gap-2">
          <select className="select" style={{ width: 180 }} value={selectedTrip} onChange={e => setSelectedTrip(e.target.value)}>
            {trips.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <button className="btn btn-outline btn-sm" onClick={resetAll}><RefreshCw size={14} /> Reset</button>
        </div>
      </div>

      {/* Progress */}
      <div className="card card-p mb-6">
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontWeight: 600 }}>Packing Progress</span>
          <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--accent)', fontSize: 18 }}>{pct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        {pct === 100 && <div style={{ textAlign: 'center', marginTop: 12, fontSize: 24 }}>🎉 All packed! Ready to go!</div>}
      </div>

      {/* Category filter */}
      <div className="tabs mb-4" style={{ flexWrap: 'wrap', height: 'auto' }}>
        <button className={`tab${activeCat === 'all' ? ' active' : ''}`} onClick={() => setActiveCat('all')}>All ({items.length})</button>
        {PACK_CATS.map(c => (
          <button key={c.id} className={`tab${activeCat === c.id ? ' active' : ''}`} onClick={() => setActiveCat(c.id)}>
            {c.emoji} {c.label} ({items.filter(i => i.category === c.id).length})
          </button>
        ))}
      </div>

      {/* Add item */}
      <div className="flex gap-2 mb-6">
        <select className="select" style={{ width: 160 }} value={newCat} onChange={e => setNewCat(e.target.value)}>
          {PACK_CATS.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
        </select>
        <input className="input" placeholder="Add item..." value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addItem()} />
        <button className="btn btn-primary" onClick={addItem}><Plus size={16} /></button>
      </div>

      <div className="grid-2">
        {/* Items */}
        <div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <CheckSquare size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p>No items in this category</p>
            </div>
          ) : (
            filtered.map((item, i) => {
              const cat = PACK_CATS.find(c => c.id === item.category);
              return (
                <motion.div key={item.id} className={`check-item${item.isPacked ? ' packed' : ''}`}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <div className={`check-box${item.isPacked ? ' checked' : ''}`} onClick={() => toggleItem(item)}>
                    {item.isPacked && '✓'}
                  </div>
                  <span style={{ fontSize: 16 }}>{cat?.emoji}</span>
                  <span className="check-name" style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.name}</span>
                  <span className="badge badge-sky text-xs">{cat?.label}</span>
                  <button className="btn btn-ghost btn-icon" style={{ color: 'var(--danger)' }} onClick={() => deleteItem(item.id)}>
                    <Trash2 size={13} />
                  </button>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Suggestions */}
        <div className="card card-p">
          <div style={{ fontWeight: 700, marginBottom: 12 }}>💡 Suggestions</div>
          {PACK_CATS.map(cat => (
            <div key={cat.id} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>{cat.emoji} {cat.label}</div>
              <div className="flex" style={{ flexWrap: 'wrap', gap: 6 }}>
                {SUGGESTIONS[cat.id].map(s => (
                  <button key={s} onClick={() => addSuggestion(s, cat.id)}
                    style={{ padding: '4px 10px', borderRadius: 99, border: '1px solid var(--border)', background: 'var(--sky-50)', fontSize: 12, cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--sky-100)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--sky-50)')}>
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
