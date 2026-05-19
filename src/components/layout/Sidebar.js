'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Send, ArrowLeftRight, ShieldCheck, Users, TrendingUp,
  UserCheck, Wallet, DollarSign, BarChart2, FileText, AlertTriangle,
  Settings, ClipboardList, Flag, BookOpen, SlidersHorizontal, Gauge,
  Activity, ChevronLeft, ChevronRight, Ban, User,
} from 'lucide-react';
import clsx from 'clsx';
import { useLang } from '../../contexts/LanguageContext';

export default function Sidebar({ role = 'client', collapsed = false, onToggle, onNavClick }) {
  const pathname = usePathname();
  const { t } = useLang();

  const NAV_ITEMS = {
    client: [
      { key: 'nav_dashboard',    href: '/client/dashboard',     icon: LayoutDashboard },
      { key: 'nav_send',         href: '/client/send',          icon: Send },
      { key: 'nav_transfers',    href: '/client/transfers',     icon: ArrowLeftRight },
      { key: 'nav_kyc',          href: '/client/kyc',           icon: ShieldCheck },
      { key: 'nav_beneficiaries',href: '/client/beneficiaries', icon: Users },
      { key: 'nav_rates',        href: '/client/rates',         icon: TrendingUp },
      { key: 'nav_profile',      href: '/client/profile',       icon: User },
    ],
    agent: [
      { key: 'nav_dashboard',   href: '/agent/dashboard',   icon: LayoutDashboard },
      { key: 'nav_clients',     href: '/agent/clients',     icon: UserCheck },
      { key: 'nav_transfers',   href: '/agent/transfers',   icon: ArrowLeftRight },
      { key: 'nav_commissions', href: '/agent/commissions', icon: DollarSign },
      { key: 'nav_float',       href: '/agent/float',       icon: Wallet },
      { key: 'nav_profile',     href: '/agent/profile',     icon: User },
    ],
    admin: [
      { key: 'nav_dashboard',  href: '/admin/dashboard',        icon: LayoutDashboard },
      { key: 'nav_users',      href: '/super/users',            icon: Users },
      { key: 'nav_transfers',  href: '/admin/transfers',        icon: ArrowLeftRight },
      { key: 'nav_kyc_review', href: '/compliance/kyc-review',  icon: ShieldCheck },
      { key: 'nav_fraud',      href: '/admin/fraud',            icon: AlertTriangle },
      { key: 'nav_aml',        href: '/compliance/aml',         icon: Activity },
      { key: 'nav_flagged',    href: '/compliance/flagged',     icon: Flag },
      { key: 'nav_analytics',  href: '/admin/analytics',        icon: BarChart2 },
      { key: 'nav_reports',    href: '/compliance/reports',     icon: FileText },
      { key: 'nav_audit',      href: '/super/audit',            icon: BookOpen },
      { key: 'nav_config',     href: '/super/config',           icon: Settings },
      { key: 'nav_limits',     href: '/super/limits',           icon: SlidersHorizontal },
      { key: 'nav_overview',   href: '/super/overview',         icon: Gauge },
    ],
  };

  const items = NAV_ITEMS[role] || NAV_ITEMS.client;

  return (
    <aside
      className={clsx('relative flex flex-col h-full transition-all duration-300 ease-in-out', collapsed ? 'w-16' : 'w-64')}
      style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0f1e38 100%)' }}
    >
      {/* Logo */}
      <div className={clsx('flex items-center border-b border-white/10', collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-4')}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid #B89040', boxShadow: '0 0 0 3px rgba(184,144,64,.2)', background: '#07111f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/logo.png" alt="Ubuntu International Exchange" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight truncate" style={{ color: '#f0e2c4' }}>Ubuntu International</p>
            <p className="text-[10px] truncate" style={{ color: '#c9a870' }}>Exchange Ltd</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-0.5 px-2">
        {items.map(({ key, href, icon: Icon }) => {
          const label = t[key] || key;
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href} title={collapsed ? label : undefined} onClick={onNavClick}
              className={clsx('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150', collapsed && 'justify-center px-0',
                isActive ? 'text-navy-900 shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/8')}
              style={isActive ? { background: 'linear-gradient(135deg, #c9a870, #d4af7a)', color: '#0a1628' } : {}}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Toggle */}
      <button onClick={onToggle} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-[72px] z-10 flex h-6 w-6 items-center justify-center rounded-full shadow transition-colors"
        style={{ background: '#c9a870', color: '#0a1628' }}>
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>
    </aside>
  );
}
