import React from 'react';
import { DashboardLayoutProvider } from '@/components/layout/DashboardLayoutContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutProvider>{children}</DashboardLayoutProvider>;
}
