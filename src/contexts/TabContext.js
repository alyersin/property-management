"use client";

import { createContext, useContext, useState } from "react";

export const TabContext = createContext();

export const useTab = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("useTab must be used within TabProvider");
  }
  return context;
};

export const TabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  const switchTab = (index) => {
    setActiveTab(index);
  };

  const getTabTitle = (index) => {
    const titles = ["Dashboard", "Property Management", "Tenant Management"];
    return titles[index] || "Dashboard";
  };

  return (
    <TabContext.Provider value={{ activeTab, switchTab, getTabTitle }}>
      {children}
    </TabContext.Provider>
  );
};

