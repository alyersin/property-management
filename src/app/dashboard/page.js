"use client";

import { useAuth } from "../../contexts/AuthContext";
import PageLayout from "../../components/shared/PageLayout";
import DashboardStats from "../../components/shared/DashboardStats";
import { useDashboardData } from "../../hooks/useAppData";
import ProtectedRoute from "../../components/auth/ProtectedRoute";

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, activities, loading, error } = useDashboardData();

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