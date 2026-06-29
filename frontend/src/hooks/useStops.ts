import { useState } from 'react';
import { tripsApi } from '../api';

export function useAddStop() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addStop = async (tripId: string, data: any) => {
    setLoading(true);
    try {
      const res = await tripsApi.addStop(tripId, data);
      setError(null);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addStop, loading, error };
}

export function useDeleteStop() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteStop = async (tripId: string, stopId: string) => {
    setLoading(true);
    try {
      const res = await tripsApi.deleteStop(tripId, stopId);
      setError(null);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteStop, loading, error };
}

export function useReorderStops() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reorderStops = async (tripId: string, stopIds: string[]) => {
    setLoading(true);
    try {
      const res = await tripsApi.reorderStops(tripId, stopIds);
      setError(null);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { reorderStops, loading, error };
}
