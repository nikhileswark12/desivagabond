import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { useTrips } from '../hooks/useTrips';
import { useNotes, useAddNote, useUpdateNote, useDeleteNote } from '../hooks/useNotes';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, Save, X, Clock } from 'lucide-react';

export default function Notes() {
  const [selectedTrip, setSelectedTrip] = useState('');
  const [newNote, setNewNote] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const { trips } = useTrips({ page: 1, limit: 50 });
  const { notes, refetch: refetchNotes } = useNotes(selectedTrip);
  const { addNote: createNote } = useAddNote();
  const { updateNote } = useUpdateNote();
  const { deleteNote: removeNote } = useDeleteNote();

  useEffect(() => {
    if (!selectedTrip && trips && trips.length > 0) {
      setSelectedTrip(trips[0].id);
    }
  }, [trips, selectedTrip]);

  const addNote = async () => {
    if (!newNote.trim()) return;
    try {
      await createNote(selectedTrip, { content: newNote });
      setNewNote('');
      toast.success('Note saved 📝');
      refetchNotes();
    } catch {}
  };

  const saveEdit = async (id: string) => {
    try {
      await updateNote(selectedTrip, id, { content: editContent });
      setEditing(null);
      toast.success('Note updated');
      refetchNotes();
    } catch {}
  };

  const deleteNote = async (id: string) => {
    try {
      await removeNote(selectedTrip, id);
      toast.success('Note deleted');
      refetchNotes();
    } catch {}
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
