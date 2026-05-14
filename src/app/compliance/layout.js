'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function ComplianceLayout({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (user.role !== 'admin') router.replace('/login');
  }, [user, isLoading, router]);
  if (isLoading || !user || user.role !== 'admin') return null;
  return <DashboardLayout>{children}</DashboardLayout>;
}
