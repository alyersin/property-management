"use client";

import { useState, useEffect, useCallback } from 'react';

const getEndpoint = (dataType) => `/api/${dataType}`;

const parseResponse = async (response, fallbackMessage) => {
  let payload = null;
  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }
  if (!response.ok) {
    const message = payload?.error || fallbackMessage;
    throw new Error(message);
  }
  return payload;
};

// Universal hook for all application data operations
export const useAppData = (dataType, userId) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!userId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${getEndpoint(dataType)}?userId=${userId}`, {
        cache: 'no-store',
      });
      const result = await parseResponse(response, 'Failed to load data');
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [dataType, userId]);

  const create = useCallback(async (item) => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getEndpoint(dataType), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...item }),
      });
      const result = await parseResponse(response, `Failed to create ${dataType.slice(0, -1)}`);
      await fetchData();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dataType, userId, fetchData]);

  const update = useCallback(async (id, updates) => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${getEndpoint(dataType)}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...updates }),
      });
      const result = await parseResponse(response, `Failed to update ${dataType.slice(0, -1)}`);
      await fetchData();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dataType, userId, fetchData]);

  const remove = useCallback(async (id) => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${getEndpoint(dataType)}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      await parseResponse(response, `Failed to delete ${dataType.slice(0, -1)}`);
      await fetchData();
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dataType, userId, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    create,
    update,
    remove,
    refetch: fetchData
  };
};

// Specialized hook for dashboard data
export const useDashboardData = (userId) => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    if (!userId) {
      setStats(null);
      setActivities([]);
      setLoading(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/dashboard?userId=${userId}`, {
        cache: 'no-store',
      });
      const payload = await parseResponse(response, 'Failed to load dashboard data');
      setStats(payload?.stats ?? null);
      setActivities(Array.isArray(payload?.activities) ? payload.activities : []);
    } catch (err) {
      setError(err.message);
      setStats(null);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    activities,
    loading,
    error,
    refetch: fetchDashboardData
  };
};
