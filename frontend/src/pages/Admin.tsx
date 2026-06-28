import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { adminApi } from '../api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { Users, Map, Globe, TrendingUp, Activity, ChevronLeft, ChevronRight } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

interface TopCityStat {
  city: string;
  count: number | string;
}

interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminStats {
  totalTrips?: number;
  sharedTrips?: number;
  totalUsers?: number;
  topCities?: TopCityStat[];
  users?: AdminUserRow[];
}

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  createdAt: string;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'audit'>('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [auditPage, setAuditPage] = useState(1);
  const [auditTotalPages, setAuditTotalPages] = useState(1);
  const [auditLoading, setAuditLoading] = useState(false);

  useEffect(() => {
    adminApi.stats().then(r => setStats(r.data as AdminStats)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'audit') {
      setAuditLoading(true);
      adminApi.auditLogs({ page: auditPage, limit: 15 })
        .then(r => {
          setAuditLogs(r.data.data);
          setAuditTotalPages(r.data.totalPages);
        })
        .finally(() => setAuditLoading(false));
    }
  }, [activeTab, auditPage]);

  if (loading) return <Layout title="Admin"><div style={{ textAlign: 'center', padding: 60 }}>Loading analytics... 📊</div></Layout>;

  const topCitiesData = {
    labels: (stats?.topCities ?? []).map(c => c.city),
    datasets: [{
      label: 'Trips',
      data: (stats?.topCities ?? []).map(c => Number(c.count)),
      backgroundColor: ['#684b35cc', '#8e6f57cc', '#4d3626cc', '#b88628cc', '#7d6246cc', '#8b6914cc', '#5f5248cc', '#a3453acc', '#332319cc', '#d5c7b8cc'],
      borderRadius: 8,
    }],
  };

  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Users',
      data: [5, 12, 18, 25, 32, stats?.totalUsers || 0],
      borderColor: 'var(--accent)',
      backgroundColor: 'color-mix(in srgb, var(--accent) 14%, transparent)',
      fill: true,
      tension: 0.4,
    }],
  };

  return (
    <Layout title="Admin Analytics">
      <div className="flex items-center justify-between mb-6">
        <h2 style={{ fontSize: 24, fontWeight: 800 }}>⚙️ Admin Area</h2>
        <div className="flex gap-2 p-1" style={{ background: 'var(--bg-secondary)', borderRadius: 99 }}>
          <button 
            onClick={() => setActiveTab('dashboard')} 
            style={{ padding: '6px 16px', borderRadius: 99, border: 'none', background: activeTab === 'dashboard' ? 'white' : 'transparent', fontWeight: 600, boxShadow: activeTab === 'dashboard' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer' }}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('audit')} 
            style={{ padding: '6px 16px', borderRadius: 99, border: 'none', background: activeTab === 'audit' ? 'white' : 'transparent', fontWeight: 600, boxShadow: activeTab === 'audit' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer' }}
          >
            Audit Logs
          </button>
        </div>
      </div>

      {activeTab === 'dashboard' ? (
        <>
          {/* Stats */}
      <div className="grid-4 mb-6">
        {[
          { icon: <Map size={22} />, label: 'Total Trips', value: stats?.totalTrips || 0, cls: 'sky' },
          { icon: <Globe size={22} />, label: 'Shared Trips', value: stats?.sharedTrips || 0, cls: 'green' },
          { icon: <Users size={22} />, label: 'Total Users', value: stats?.totalUsers || 0, cls: 'purple' },
          { icon: <TrendingUp size={22} />, label: 'Top City', value: stats?.topCities?.[0]?.city || '—', cls: 'orange' },
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

      <div className="grid-2 mb-6">
        <motion.div className="card card-p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>🌏 Top Cities by Trips</div>
          <Bar data={topCitiesData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }} />
        </motion.div>
        <motion.div className="card card-p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>👥 User Growth</div>
          <Line data={userGrowthData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </motion.div>
      </div>

      {/* Users table */}
      <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 700 }}>
          👤 Registered Users ({stats?.totalUsers || 0})
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--sky-50)' }}>
                {['Name', 'Email', 'Role', 'Joined'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(stats?.users ?? []).map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{u.name}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge badge-${u.role === 'admin' ? 'purple' : 'sky'}`}>
                      {u.role === 'admin' ? '👑 Admin' : '✈️ User'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: 13 }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
        </>
      ) : (
        <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span><Activity size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} /> System Audit Logs</span>
          </div>
          
          {auditLoading ? (
            <div style={{ padding: 40, textAlign: 'center' }}>Loading logs...</div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--sky-50)' }}>
                      {['Time', 'Action', 'Entity Type', 'Entity ID', 'User ID'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map(log => (
                      <tr key={log.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: 13 }}>
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                          <span className="badge badge-orange">{log.action}</span>
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{log.entityType}</td>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 12 }}>{log.entityId || '—'}</td>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 12 }}>{log.userId}</td>
                      </tr>
                    ))}
                    {auditLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>No audit logs found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {auditTotalPages > 1 && (
                <div className="flex items-center justify-between" style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
                  <div className="text-sm text-muted">Page {auditPage} of {auditTotalPages}</div>
                  <div className="flex gap-2">
                    <button 
                      className="btn btn-outline btn-sm" 
                      onClick={() => setAuditPage(p => Math.max(1, p - 1))}
                      disabled={auditPage === 1}
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>
                    <button 
                      className="btn btn-outline btn-sm" 
                      onClick={() => setAuditPage(p => Math.min(auditTotalPages, p + 1))}
                      disabled={auditPage === auditTotalPages}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      )}
    </Layout>
  );
}
