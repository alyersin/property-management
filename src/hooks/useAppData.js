"use client";

import { useState, useEffect, useCallback } from 'react';
import dataService from '../services/dataService';

// Universal hook for all application data operations
export const useAppData = (dataType) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = dataService[`get${dataType.charAt(0).toUpperCase() + dataType.slice(1)}`]();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [dataType]);

  const create = useCallback(async (item) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = dataService[`add${dataType.charAt(0).toUpperCase() + dataType.slice(1)}`](item);
      await fetchData();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dataType, fetchData]);

  const update = useCallback(async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = dataService[`update${dataType.charAt(0).toUpperCase() + dataType.slice(1)}`](id, updates);
      if (!result) throw new Error('Item not found');
      
      await fetchData();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dataType, fetchData]);

  const remove = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = dataService[`delete${dataType.charAt(0).toUpperCase() + dataType.slice(1)}`](id);
      if (!result) throw new Error('Item not found');
      
      await fetchData();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dataType, fetchData]);

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
export const useDashboardData = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const dashboardStats = dataService.getDashboardStats();
      const recentActivities = dataService.getRecentActivities();
      
      setStats(dashboardStats);
      setActivities(recentActivities);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

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
