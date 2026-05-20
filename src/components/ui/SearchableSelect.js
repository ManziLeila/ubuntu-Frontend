'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function SearchableSelect({
  options = [],
  value,
  onChange,
  placeholder = 'Select…',
  error = false,
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const searchRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 60);
  }, [open]);

  useEffect(() => {
    function away(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', away);
    return () => document.removeEventListener('mousedown', away);
  }, []);

  const pick = (opt) => { onChange(opt.value); setOpen(false); setSearch(''); };

  // Theme tokens
  const bg      = isDark ? '#0f1e38' : '#ffffff';
  const txt     = isDark ? '#f0e2c4' : '#162140';
  const sub     = isDark ? 'rgba(245,240,232,.45)' : 'rgba(22,33,64,.5)';
  const bdr     = isDark ? 'rgba(255,255,255,.12)' : 'rgba(22,33,64,.15)';
  const hover   = isDark ? 'rgba(255,255,255,.06)' : 'rgba(22,33,64,.04)';
  const active  = isDark ? 'rgba(201,168,112,.12)' : 'rgba(184,144,64,.1)';
  const errBdr  = '#ef4444';

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }} className={className}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px', borderRadius: 10,
          border: `1.5px solid ${error ? errBdr : open ? (isDark ? 'rgba(201,168,112,.5)' : 'rgba(184,144,64,.5)') : bdr}`,
          background: isDark ? 'rgba(255,255,255,.05)' : 'rgba(22,33,64,.04)',
          color: selected ? txt : sub,
          cursor: 'pointer', textAlign: 'left', fontSize: 14,
          transition: 'border-color .15s',
        }}
      >
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={15}
          style={{ flexShrink: 0, color: sub, transition: 'transform .15s', transform: open ? 'rotate(180deg)' : 'none', marginLeft: 6 }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 999,
          background: bg, border: `1px solid ${bdr}`, borderRadius: 10,
          boxShadow: isDark ? '0 12px 32px rgba(0,0,0,.45)' : '0 8px 24px rgba(22,33,64,.12)',
          overflow: 'hidden',
        }}>
          {/* Search */}
          <div style={{ padding: '8px 10px', borderBottom: `1px solid ${bdr}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 7, background: isDark ? 'rgba(255,255,255,.05)' : 'rgba(22,33,64,.04)', border: `1px solid ${bdr}` }}>
              <Search size={13} color={sub} />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search country…"
                style={{ flex: 1, border: 'none', background: 'none', outline: 'none', fontSize: 13, color: txt }}
              />
            </div>
          </div>

          {/* Options list */}
          <div style={{ maxHeight: 220, overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <p style={{ padding: '12px', fontSize: 13, color: sub, textAlign: 'center' }}>No results</p>
            ) : filtered.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => pick(opt)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', background: opt.value === value ? active : 'transparent',
                  border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 14, color: txt,
                  transition: 'background .1s',
                }}
                onMouseEnter={e => { if (opt.value !== value) e.currentTarget.style.background = hover; }}
                onMouseLeave={e => { e.currentTarget.style.background = opt.value === value ? active : 'transparent'; }}
              >
                <span>{opt.label}</span>
                {opt.value === value && <Check size={14} color="#c9a870" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
