"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import PageLayout from "../../components/shared/PageLayout";
import { TabProvider, useTab } from "../../contexts/TabContext";
import { useAuth } from "../../contexts/AuthContext";
import DashboardStats from "../../components/shared/DashboardStats";
import UniversalPage from "../../components/shared/UniversalPage";
import { useDashboardData } from "../../hooks/useAppData";
import { getColumnsByType } from "../../config/tableColumns";
import { STORAGE_KEYS } from "../../constants/app";
import usePersistentState from "../../hooks/usePersistentState";

function TabContent({ onTitleChange }) {
  const { activeTab, getTabTitle } = useTab();
  const { user } = useAuth();

  // Update title when tab changes
  useEffect(() => {
    if (onTitleChange) {
      onTitleChange(getTabTitle(activeTab));
    }
  }, [activeTab, getTabTitle, onTitleChange]);

  // Dashboard tab content
  const { stats, activities, loading, error } = useDashboardData(user?.id);
  const [dashboardPreferences, setDashboardPreferences, preferencesHydrated] =
    usePersistentState(`${STORAGE_KEYS.preferences}_dashboard`, {
      showWelcomeMessage: true,
      defaultView: "stats",
      lastVisited: null,
    });

  useEffect(() => {
    if (!preferencesHydrated) return;
    setDashboardPreferences((prev) => ({
      ...prev,
      lastVisited: new Date().toISOString(),
    }));
  }, [preferencesHydrated, setDashboardPreferences]);

  // Render content based on active tab
  switch (activeTab) {
    case 0: // Dashboard
      if (loading) {
        return <div>Loading dashboard data...</div>;
      }
      if (error) {
        return <div>Error loading dashboard: {error}</div>;
      }
      return <DashboardStats stats={stats} recentActivities={activities} />;

    case 1: // Properties
      return (
        <UniversalPage
          dataType="properties"
          title="Property Management"
          columns={getColumnsByType('properties')}
          emptyMessage="No properties found"
          hidePageLayout={true}
        />
      );

    case 2: // Tenants
      return (
        <UniversalPage
          dataType="tenants"
          title="Tenant Management"
          columns={getColumnsByType('tenants')}
          emptyMessage="No tenants found"
          hidePageLayout={true}
        />
      );

    default:
      return <DashboardStats stats={stats} recentActivities={activities} />;
  }
}

export default function Dashboard() {
  const { user } = useAuth();
  const [pageTitle, setPageTitle] = useState("Dashboard");

  return (
    <ProtectedRoute>
      <TabProvider>
        <PageLayout title={pageTitle}>
          <TabContent onTitleChange={setPageTitle} />
        </PageLayout>
      </TabProvider>
    </ProtectedRoute>
  );
}