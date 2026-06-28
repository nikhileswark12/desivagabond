import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { tripsApi } from '../api';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, Save, X, StickyNote, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function Notes() {
  const [trips, setTrips] = useState<any[]>([]);
  const [selectedTrip, setSelectedTrip] = useState('');
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    tripsApi.list({ page: 1, limit: 50 }).then(r => {
      setTrips(r.data.data);
      if (r.data.data.length > 0) setSelectedTrip(r.data.data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedTrip) return;
    tripsApi.getNotes(selectedTrip).then(r => setNotes(r.data));
  }, [selectedTrip]);

  const addNote = async () => {
    if (!newNote.trim()) return;
    const res = await tripsApi.addNote(selectedTrip, { content: newNote });
    setNotes(prev => [res.data, ...prev]);
    setNewNote('');
    toast.success('Note saved 📝');
  };

  const saveEdit = async (id: string) => {
    const res = await tripsApi.updateNote(selectedTrip, id, { content: editContent });
    setNotes(prev => prev.map(n => n.id === id ? res.data : n));
    setEditing(null);
    toast.success('Note updated');
  };

  const deleteNote = async (id: string) => {
    await tripsApi.deleteNote(selectedTrip, id);
    setNotes(prev => prev.filter(n => n.id !== id));
    toast.success('Note deleted');
  };

  return (
    <Layout title="Trip Notes">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>Trip Journal 📓</h2>
          <p className="text-muted text-sm">{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
        </div>
        <select className="select" style={{ width: 200 }} value={selectedTrip} onChange={e => setSelectedTrip(e.target.value)}>
          {trips.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {/* Add note */}
      <motion.div className="card card-p mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>✏️ New Note</div>
        <textarea className="textarea" placeholder="Jot down hotel check-in info, reminders, local contacts..." rows={4}
          value={newNote} onChange={e => setNewNote(e.target.value)}
          style={{ marginBottom: 12 }} />
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted">{newNote.length} characters</span>
          <button className="btn btn-primary" onClick={addNote} disabled={!newNote.trim()}>
            <Plus size={16} /> Save Note
          </button>
        </div>
      </motion.div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📓</div>
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No notes yet</h3>
          <p className="text-muted">Start writing your travel journal above</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <AnimatePresence>
            {notes.map((note, i) => (
              <motion.div key={note.id} className="card card-p"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{ borderLeft: '4px solid var(--sky-400)' }}>
                {editing === note.id ? (
                  <div>
                    <textarea className="textarea" rows={4} value={editContent} onChange={e => setEditContent(e.target.value)} style={{ marginBottom: 10 }} />
                    <div className="flex gap-2">
                      <button className="btn btn-primary btn-sm" onClick={() => saveEdit(note.id)}><Save size={14} /> Save</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}><X size={14} /> Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 12, whiteSpace: 'pre-wrap' }}>{note.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted">
                        <Clock size={11} />
                        {note.updatedAt ? new Date(note.updatedAt).toLocaleString() : ''}
                      </div>
                      <div className="flex gap-2">
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => { setEditing(note.id); setEditContent(note.content); }}>
                          <Edit2 size={14} />
                        </button>
                        <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--danger)' }} onClick={() => deleteNote(note.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </Layout>
  );
}
