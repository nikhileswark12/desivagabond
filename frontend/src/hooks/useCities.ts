import { useState, useCallback, useEffect } from 'react';
import { citiesApi } from '../api';

export function useCities(filters?: any) {
  const [cities, setCities] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const serializedFilters = JSON.stringify(filters);

  const fetchCities = useCallback(async () => {
    setLoading(true);
    try {
      const parsedFilters = serializedFilters ? JSON.parse(serializedFilters) : undefined;
      const res = await citiesApi.list(parsedFilters);
      setCities(res.data.data);
      setTotal(res.data.total);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [serializedFilters]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  return { cities, total, loading, error, refetch: fetchCities };
}
