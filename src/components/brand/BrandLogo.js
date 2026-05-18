'use client';

const SRC = '/ubuntu-brand-logo.png';
const IMG_W = 461;
const IMG_H = 449;

/** Per layout: circular badge size, gap to wordmark, typography */
const VARIANT = {
  nav: {
    circle: 64,
    gap: 14,
    titleSize: 16,
    subtitleSize: 11,
    wordmark: true,
    column: false,
  },
  footer: {
    circle: 72,
    gap: 16,
    titleSize: 17,
    subtitleSize: 12,
    wordmark: true,
    column: false,
  },
  sidebar: {
    circle: 58,
    gap: 12,
    titleSize: 13,
    subtitleSize: 10,
    wordmark: true,
    column: true,
  },
  /** w-16 rail (64px) − horizontal padding → keep badge ≤ inner width */
  sidebarCollapsed: {
    circle: 52,
    gap: 0,
    titleSize: 0,
    subtitleSize: 0,
    wordmark: false,
    column: false,
  },
  auth: {
    circle: 104,
    gap: 22,
    titleSize: 20,
    subtitleSize: 14,
    wordmark: true,
    column: false,
  },
};

/**
 * Circular gold-rim badge (like legacy “UI” mark) + supplied artwork,
 * then “Ubuntu International” / “Exchange Ltd” wordmark after the logo.
 */
export default function BrandLogo({ variant = 'nav', className = '' }) {
  const v = VARIANT[variant] || VARIANT.nav;

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: v.column ? 'column' : 'row',
        alignItems: v.column ? 'center' : 'center',
        justifyContent: v.column ? 'center' : 'flex-start',
        gap: v.gap,
        flexShrink: 0,
        textAlign: v.column ? 'center' : 'left',
      }}
    >
      <div
        style={{
          width: v.circle,
          height: v.circle,
          maxWidth: '100%',
          maxHeight: '100%',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #c9a870, #f0e2c4)',
          padding: Math.max(2, Math.round(v.circle * 0.032)),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#07111f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            /* Small inset so the mark fills the disc without clipping corners */
            padding: 'clamp(1px, 2.5%, 4px)',
          }}
        >
          <img
            src={SRC}
            alt=""
            width={IMG_W}
            height={IMG_H}
            style={{
              width: '100%',
              height: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
              flexShrink: 0,
              objectFit: 'contain',
              objectPosition: 'center',
              display: 'block',
            }}
          />
        </div>
      </div>

      {v.wordmark && (
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: v.titleSize,
              fontWeight: 700,
              color: '#f0e2c4',
              lineHeight: 1.2,
              fontFamily: 'Inter, system-ui, sans-serif',
              letterSpacing: v.titleSize >= 15 ? '-0.01em' : undefined,
            }}
          >
            Ubuntu International
          </div>
          <div
            style={{
              fontSize: v.subtitleSize,
              fontWeight: 600,
              color: '#c9a870',
              letterSpacing: '0.04em',
              lineHeight: 1.25,
              fontFamily: 'Inter, system-ui, sans-serif',
              marginTop: 1,
            }}
          >
            Exchange Ltd
          </div>
        </div>
      )}
    </div>
  );
}
