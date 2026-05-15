'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, User, Settings, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import NotificationBell from '../notifications/NotificationBell';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLang } from '../../contexts/LanguageContext';

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
}

export default function TopBar({ user, onMenuToggle, title = '' }) {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, t, toggleLang } = useLang();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isLight = theme === 'light';

  const C = {
    bg:      isLight ? '#ffffff' : '#0a1628',
    border:  isLight ? 'rgba(22,33,64,.1)' : 'rgba(255,255,255,.07)',
    text:    isLight ? '#162140' : 'rgba(245,240,232,.8)',
    subtext: isLight ? 'rgba(22,33,64,.45)' : 'rgba(245,240,232,.4)',
    iconBtn: isLight ? 'rgba(22,33,64,.07)' : 'rgba(255,255,255,.06)',
    dropdown: isLight ? '#ffffff' : '#0f1e38',
    dropBorder: isLight ? 'rgba(22,33,64,.12)' : 'rgba(255,255,255,.1)',
    dropItem: isLight ? 'rgba(22,33,64,.6)' : 'rgba(245,240,232,.65)',
    dropHover: isLight ? 'rgba(22,33,64,.05)' : 'rgba(255,255,255,.05)',
    avatarColor: isLight ? '#07111f' : '#07111f',
  };

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const displayName = user?.name || user?.email || 'User';
  const profileHref = `/${user?.role ?? 'client'}/profile`;

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 60, padding: '0 20px',
      background: C.bg, borderBottom: `1px solid ${C.border}`,
      zIndex: 20, position: 'relative', flexShrink: 0,
      transition: 'background .3s, border-color .3s',
    }}>
      {/* Hamburger */}
      <button onClick={onMenuToggle} aria-label="Toggle menu"
        style={{ padding: 8, borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: C.subtext, display: 'flex', alignItems: 'center' }}>
        <Menu size={20} />
      </button>

      {title && (
        <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: 14, fontWeight: 600, color: C.text }}>
          {title}
        </span>
      )}

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

        {/* Language toggle */}
        <button onClick={toggleLang}
          style={{ padding: '4px 10px', borderRadius: 8, border: `1px solid ${C.dropBorder}`, background: C.iconBtn, cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#c9a870', transition: 'background .2s' }}
          title={lang === 'en' ? 'Switch to French' : 'Passer en anglais'}
        >
          {lang === 'en' ? 'FR' : 'EN'}
        </button>

        {/* Theme toggle */}
        <button onClick={toggleTheme}
          style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${C.dropBorder}`, background: C.iconBtn, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s' }}
          title={isLight ? 'Dark mode' : 'Light mode'}
        >
          {isLight ? <Moon size={15} color={C.text} /> : <Sun size={15} color="#c9a870" />}
        </button>

        <NotificationBell />

        {/* Avatar + dropdown */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button onClick={() => setDropdownOpen(p => !p)} aria-label="User menu"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 10, background: 'none', border: `1px solid ${C.dropBorder}`, cursor: 'pointer', transition: 'border-color .15s' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#c9a870,#f0e2c4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#07111f' }}>
              {getInitials(displayName)}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {displayName.split(' ')[0]}
            </span>
          </button>

          {dropdownOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)',
              width: 210, background: C.dropdown, border: `1px solid ${C.dropBorder}`,
              borderRadius: 14, boxShadow: '0 16px 48px rgba(0,0,0,.2)',
              zIndex: 50, overflow: 'hidden',
            }}>
              <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.dropBorder}` }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: 0, marginBottom: 2 }}>{displayName}</p>
                {user?.email && <p style={{ fontSize: 11, color: C.subtext, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>}
              </div>

              {[
                { href: profileHref, icon: User, label: t.tb_profile },
              ].map(({ href, icon: Icon, label }) => (
                <Link key={href} href={href} onClick={() => setDropdownOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', fontSize: 13, color: C.dropItem, textDecoration: 'none', transition: 'background .1s' }}
                  onMouseOver={e => e.currentTarget.style.background = C.dropHover}
                  onMouseOut={e => e.currentTarget.style.background = 'none'}
                >
                  <Icon size={14} color="rgba(201,168,112,.7)" />
                  {label}
                </Link>
              ))}

              <div style={{ borderTop: `1px solid ${C.dropBorder}`, marginTop: 2 }} />
              <button onClick={() => { setDropdownOpen(false); logout(); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', fontSize: 13, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,.06)'}
                onMouseOut={e => e.currentTarget.style.background = 'none'}
              >
                <LogOut size={14} />
                {t.tb_logout}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
