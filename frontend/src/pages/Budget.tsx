import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useTrips } from '../hooks/useTrips';
import { useBudget, useAddBudgetItem, useDeleteBudgetItem } from '../hooks/useBudget';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import toast from 'react-hot-toast';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const CATEGORIES = [
  { id: 'transport', label: 'Transport', emoji: '🚗', color: '#684b35' },
  { id: 'stay', label: 'Stay', emoji: '🏨', color: '#5f5248' },
  { id: 'activities', label: 'Activities', emoji: '🎯', color: '#7d6246' },
  { id: 'meals', label: 'Meals', emoji: '🍽️', color: '#b88628' },
  { id: 'other', label: 'Other', emoji: '📦', color: '#a8917c' },
];


export default function Budget() {
  const [selectedTrip, setSelectedTrip] = useState('');
  const [form, setForm] = useState({ category: 'transport', label: '', amount: '' });
  const [budgetLimit, setBudgetLimit] = useState('');

  const { trips } = useTrips({ page: 1, limit: 50 });
  const { items, refetch: refetchBudget } = useBudget(selectedTrip);
  const { addItem } = useAddBudgetItem();
  const { deleteItem } = useDeleteBudgetItem();

  useEffect(() => {
    if (!selectedTrip && trips && trips.length > 0) {
      setSelectedTrip(trips[0].id);
      if (trips.length === 1) {
        toast('Auto-selected your only trip', { icon: 'ℹ️' });
      }
    }
  }, [trips, selectedTrip]);

  const total = items.reduce((s, i) => s + Number(i.amount), 0);
  const limit = Number(budgetLimit) || 0;
  const overBudget = limit > 0 && total > limit;

  const byCategory = CATEGORIES.map(c => ({
    ...c,
    amount: items.filter(i => i.category === c.id).reduce((s, i) => s + Number(i.amount), 0),
  }));

  const pieData = {
    labels: byCategory.filter(c => c.amount > 0).map(c => c.label),
    datasets: [{
      data: byCategory.filter(c => c.amount > 0).map(c => c.amount),
      backgroundColor: byCategory.filter(c => c.amount > 0).map(c => c.color),
      borderWidth: 0,
    }],
  };

  const barData = {
    labels: byCategory.map(c => c.label),
    datasets: [{
      label: 'Amount (₹)',
      data: byCategory.map(c => c.amount),
      backgroundColor: byCategory.map(c => c.color + 'cc'),
      borderRadius: 8,
    }],
  };

  const handleAddItem = async () => {
    if (!form.label || !form.amount || !selectedTrip) { toast.error('Fill all fields'); return; }
    try {
      await addItem(selectedTrip, { ...form, amount: Number(form.amount) });
      setForm({ category: 'transport', label: '', amount: '' });
      toast.success('Budget item added ✅');
      refetchBudget();
    } catch { toast.error('Failed to add item'); }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteItem(selectedTrip, itemId);
      toast.success('Removed');
      refetchBudget();
    } catch {}
  };

  return (
    <Layout title="Budget & Costs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>Budget Breakdown 💰</h2>
          <p className="text-muted text-sm">Track your estimated travel costs</p>
        </div>
        <select className="select" style={{ width: 200 }} value={selectedTrip} onChange={e => setSelectedTrip(e.target.value)}>
          {trips.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {/* Total + limit */}
      <div className="grid-2 mb-6">
        <motion.div className="card card-p" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-sm text-muted mb-1">Total Estimated Cost</div>
          <div style={{ fontSize: 36, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '0.03em', color: overBudget ? 'var(--danger)' : 'var(--accent)' }}>
            ₹{total.toLocaleString()}
          </div>
          {overBudget && (
            <div className="flex items-center gap-1 mt-1 text-sm" style={{ color: 'var(--danger)' }}>
              <AlertCircle size={14} /> ₹{(total - limit).toLocaleString()} over budget
            </div>
          )}
          {limit > 0 && (
            <div className="progress-bar mt-3">
              <div className="progress-fill" style={{ width: `${Math.min(100, (total / limit) * 100)}%`, background: overBudget ? 'var(--danger)' : undefined }} />
            </div>
          )}
        </motion.div>

        <motion.div className="card card-p" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="text-sm text-muted mb-1">Budget Limit (Optional)</div>
          <input className="input" type="number" placeholder="Set your limit in ₹" value={budgetLimit}
            onChange={e => setBudgetLimit(e.target.value)} style={{ fontSize: 18, fontWeight: 700 }} />
          {items.length > 0 && (
            <div className="text-sm text-muted mt-2">Avg. per day: ₹{Math.round(total / Math.max(1, items.length)).toLocaleString()}</div>
          )}
        </motion.div>
      </div>

      {/* Charts */}
      {items.length > 0 && (
        <div className="grid-2 mb-6">
          <motion.div className="card card-p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div style={{ fontWeight: 700, marginBottom: 16 }}>By Category</div>
            <div style={{ maxWidth: 260, margin: '0 auto' }}>
              <Pie data={pieData} options={{ plugins: { legend: { position: 'bottom', labels: { font: { size: 12 } } } } }} />
            </div>
          </motion.div>
          <motion.div className="card card-p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div style={{ fontWeight: 700, marginBottom: 16 }}>Cost Breakdown</div>
            <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
          </motion.div>
        </div>
      )}

      {/* Add item */}
      <div className="card card-p mb-6">
        <div style={{ fontWeight: 700, marginBottom: 16 }}>Add Expense</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr auto', gap: 12, alignItems: 'end' }}>
          <div>
            <div className="form-label">Category</div>
            <select className="select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
            </select>
          </div>
          <div>
            <div className="form-label">Description</div>
            <input className="input" placeholder="e.g. Train Manali-Delhi" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} />
          </div>
          <div>
            <div className="form-label">Amount (₹)</div>
            <input className="input" type="number" placeholder="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
          </div>
          <button className="btn btn-primary" onClick={handleAddItem}><Plus size={16} /></button>
        </div>
      </div>

      {/* Items list */}
      {items.length > 0 && (
        <div className="card">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 700 }}>All Expenses</div>
          {items.map((item, i) => {
            const cat = CATEGORIES.find(c => c.id === item.category);
            return (
              <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>{cat?.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{item.label}</div>
                  <div className="text-xs text-muted">{cat?.label}</div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--accent)' }}>₹{Number(item.amount).toLocaleString()}</div>
                <button className="btn btn-ghost btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleDeleteItem(item.id)}>
                  <Trash2 size={15} />
                </button>
              </motion.div>
            );
          })}
          <div style={{ padding: '14px 20px', fontWeight: 800, fontSize: 17, display: 'flex', justifyContent: 'space-between' }}>
            <span>Total</span>
            <span style={{ color: overBudget ? 'var(--danger)' : 'var(--accent)' }}>₹{total.toLocaleString()}</span>
          </div>
        </div>
      )}
    </Layout>
  );
}
