import { useState, useCallback, useEffect } from 'react';
import { activitiesApi } from '../api';

export function useActivities(filters?: any) {
  const [activities, setActivities] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const serializedFilters = JSON.stringify(filters);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const parsedFilters = serializedFilters ? JSON.parse(serializedFilters) : undefined;
      const res = await activitiesApi.list(parsedFilters);
      setActivities(res.data.data);
      setTotal(res.data.total);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [serializedFilters]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { activities, total, loading, error, refetch: fetchActivities };
}
