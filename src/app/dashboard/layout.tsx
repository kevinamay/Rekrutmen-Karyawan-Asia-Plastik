'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { X } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Bypass legacy layout for dashboard, profile, screening, competency-test, and status pages
  if (
    pathname === '/dashboard' ||
    pathname === '/dashboard/profile' ||
    pathname === '/dashboard/screening' ||
    pathname === '/dashboard/competency-test' ||
    pathname === '/dashboard/status'
  ) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfe]">
      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setMobileSidebarOpen(true)} />

      {/* Main Workspace */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sticky Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Slide-over Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-corporate-950/40 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-80 max-w-full bg-white shadow-2xl z-50 flex flex-col">
              <div className="p-4 border-b border-corporate-200 flex items-center justify-between">
                <span className="font-bold text-sm text-corporate-900">Application Stages</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-corporate-500 hover:bg-corporate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Sidebar onClose={() => setMobileSidebarOpen(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

