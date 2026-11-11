'use client';

import React, { createContext, useContext, useState } from 'react';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';

interface DashboardLayoutContextType {
  openMobileSidebar: () => void;
}

const DashboardLayoutContext = createContext<DashboardLayoutContextType>({
  openMobileSidebar: () => {},
});

export const useDashboardLayout = () => useContext(DashboardLayoutContext);

export function DashboardLayoutProvider({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <DashboardLayoutContext.Provider
      value={{ openMobileSidebar: () => setMobileSidebarOpen(true) }}
    >
      <div className="min-h-screen flex bg-slate-100/70 font-sans text-slate-800">
        <DashboardSidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col min-w-0">
          {children}
        </div>
      </div>
    </DashboardLayoutContext.Provider>
  );
}
