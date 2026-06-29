import { useState, useCallback, useEffect } from 'react';
import { tripsApi } from '../api';

export function useTrips(params?: any) {
  const [trips, setTrips] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(params?.page || 1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const serializedParams = JSON.stringify(params);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const parsedParams = serializedParams ? JSON.parse(serializedParams) : undefined;
      const res = await tripsApi.list(parsedParams);
      setTrips(res.data.data);
      setTotal(res.data.total);
      if (parsedParams?.page) setPage(parsedParams.page);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [serializedParams]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return { trips, total, page, loading, error, refetch: fetchTrips };
}

export function useTrip(id: string) {
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrip = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await tripsApi.get(id);
      setTrip(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  return { trip, loading, error, refetch: fetchTrip };
}

export function useCreateTrip() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTrip = async (data: any) => {
    setLoading(true);
    try {
      const res = await tripsApi.create(data);
      setError(null);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createTrip, loading, error };
}

export function useUpdateTrip() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTrip = async (id: string, data: any) => {
    setLoading(true);
    try {
      const res = await tripsApi.update(id, data);
      setError(null);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateTrip, loading, error };
}

export function useDeleteTrip() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTrip = async (id: string) => {
    setLoading(true);
    try {
      const res = await tripsApi.delete(id);
      setError(null);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteTrip, loading, error };
}

export function useShareTrip() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shareTrip = async (id: string, isPublic: boolean) => {
    setLoading(true);
    try {
      const res = await tripsApi.share(id, isPublic);
      setError(null);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { shareTrip, loading, error };
}
