"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import PageLayout from "../../components/shared/PageLayout";
import DashboardStats from "../../components/shared/DashboardStats";
import { useDashboardData } from "../../hooks/useAppData";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { STORAGE_KEYS } from "../../constants/app";

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, activities, loading, error } = useDashboardData();
  const [dashboardPreferences, setDashboardPreferences] = useState({
    showWelcomeMessage: true,
    defaultView: 'stats',
    lastVisited: null
  });

  // Load dashboard preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem(STORAGE_KEYS.preferences);
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        if (parsed.dashboard) {
          setDashboardPreferences(parsed.dashboard);
        }
      } catch (error) {
        console.warn('Failed to load dashboard preferences:', error);
      }
    }
  }, []);

  // Save dashboard preferences to localStorage
  useEffect(() => {
    const currentPreferences = {
      ...dashboardPreferences,
      lastVisited: new Date().toISOString()
    };
    
    try {
      const existing = localStorage.getItem(STORAGE_KEYS.preferences);
      const parsed = existing ? JSON.parse(existing) : {};
      parsed.dashboard = currentPreferences;
      localStorage.setItem(STORAGE_KEYS.preferences, JSON.stringify(parsed));
    } catch (error) {
      console.warn('Failed to save dashboard preferences:', error);
    }
  }, [dashboardPreferences]);

  if (loading) {
    return (
      <ProtectedRoute>
        <PageLayout title="Loading..." currentPage="/dashboard">
          <div>Loading dashboard data...</div>
        </PageLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <PageLayout title="Error" currentPage="/dashboard">
          <div>Error loading dashboard: {error}</div>
        </PageLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <PageLayout 
        title={`Welcome back, ${user?.name || 'Admin'}!`} 
        currentPage="/dashboard"
      >
        <DashboardStats stats={stats} recentActivities={activities} />
      </PageLayout>
    </ProtectedRoute>
  );
}