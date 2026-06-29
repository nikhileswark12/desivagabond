import { useState, useCallback, useEffect } from 'react';
import { tripsApi } from '../api';

export function useBudget(tripId: string) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudget = useCallback(async () => {
    if (!tripId) return;
    setLoading(true);
    try {
      const res = await tripsApi.getBudget(tripId);
      setItems(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);

  return { items, loading, error, refetch: fetchBudget };
}

export function useAddBudgetItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = async (tripId: string, data: any) => {
    setLoading(true);
    try {
      const res = await tripsApi.addBudgetItem(tripId, data);
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

export function useDeleteBudgetItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteItem = async (tripId: string, itemId: string) => {
    setLoading(true);
    try {
      const res = await tripsApi.deleteBudgetItem(tripId, itemId);
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
