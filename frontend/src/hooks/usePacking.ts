import { useState, useCallback, useEffect } from 'react';
import { tripsApi } from '../api';

export function usePacking(tripId: string) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPacking = useCallback(async () => {
    if (!tripId) return;
    setLoading(true);
    try {
      const res = await tripsApi.getPacking(tripId);
      setItems(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchPacking();
  }, [fetchPacking]);

  return { items, loading, error, refetch: fetchPacking };
}

export function useAddPackingItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = async (tripId: string, data: any) => {
    setLoading(true);
    try {
      const res = await tripsApi.addPackingItem(tripId, data);
      setError(null);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addItem, loading, error };
}

export function useUpdatePackingItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateItem = async (tripId: string, itemId: string, data: any) => {
    setLoading(true);
    try {
      const res = await tripsApi.updatePackingItem(tripId, itemId, data);
      setError(null);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateItem, loading, error };
}

export function useDeletePackingItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteItem = async (tripId: string, itemId: string) => {
    setLoading(true);
    try {
      const res = await tripsApi.deletePackingItem(tripId, itemId);
      setError(null);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteItem, loading, error };
}
