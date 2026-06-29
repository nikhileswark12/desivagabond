import { useState, useCallback, useEffect } from 'react';
import { tripsApi } from '../api';

export function useNotes(tripId: string) {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    if (!tripId) return;
    setLoading(true);
    try {
      const res = await tripsApi.getNotes(tripId);
      setNotes(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return { notes, loading, error, refetch: fetchNotes };
}

export function useAddNote() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addNote = async (tripId: string, data: any) => {
    setLoading(true);
    try {
      const res = await tripsApi.addNote(tripId, data);
      setError(null);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addNote, loading, error };
}

export function useUpdateNote() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateNote = async (tripId: string, noteId: string, data: any) => {
    setLoading(true);
    try {
      const res = await tripsApi.updateNote(tripId, noteId, data);
      setError(null);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateNote, loading, error };
}

export function useDeleteNote() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteNote = async (tripId: string, noteId: string) => {
    setLoading(true);
    try {
      const res = await tripsApi.deleteNote(tripId, noteId);
      setError(null);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteNote, loading, error };
}
