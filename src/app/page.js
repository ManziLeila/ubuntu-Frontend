'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Globe2, ShieldCheck, Zap, Users, Sun, Moon, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LanguageContext';
import Footer from '../components/layout/Footer';

const ROLE_DASHBOARDS = {
  client: '/client/dashboard',
  agent:  '/agent/dashboard',
  admin:  '/admin/dashboard',
};

const LIGHT = {
  bg:        '#FFFFFF',
  bgHero:    'linear-gradient(160deg, #EEF3FF 0%, #FFFFFF 55%, #FDF8EE 100%)',
  nav:       'rgba(255,255,255,.95)',
  navBdr:    'rgba(22,33,64,.1)',
  navShadow: '0 1px 12px rgba(22,33,64,.06)',
  text:      '#162140',
  textSub:   '#4A5A80',
  gold:      '#B89040',
  goldViv:   '#C9A020',
  goldPale:  '#F0E4BC',
  goldBdr:   'rgba(184,144,64,.3)',
  cardBg:    '#FFFFFF',
  cardBdr:   'rgba(22,33,64,.1)',
  cardShadow:'0 8px 32px rgba(22,33,64,.08)',
  statsBg:   '#F4F7FF',
  statsBdr:  'rgba(22,33,64,.1)',
  pill:      '#F0E4BC',
  pillBdr:   'rgba(184,144,64,.3)',
  pillText:  '#162140',
  ctaBg:     'linear-gradient(135deg,#162140 0%,#1E3A6E 100%)',
  ctaText:   '#FFFFFF',
  ctaSub:    'rgba(255,255,255,.65)',
  linkColor: '#162140',
  mobileMenu:'#ffffff',
};

const DARK = {
  bg:        '#07111f',
  bgHero:    '#07111f',
  nav:       'rgba(7,17,31,.95)',
  navBdr:    'rgba(255,255,255,.07)',
  navShadow: 'none',
  text:      '#f0e2c4',
  textSub:   'rgba(245,240,232,.55)',
  gold:      '#c9a870',
  goldViv:   '#d4af7a',
  goldPale:  'rgba(201,168,112,.12)',
  goldBdr:   'rgba(201,168,112,.3)',
  cardBg:    'rgba(10,22,40,.85)',
  cardBdr:   'rgba(201,168,112,.2)',
  cardShadow:'0 8px 32px rgba(0,0,0,.3)',
  statsBg:   'rgba(255,255,255,.02)',
  statsBdr:  'rgba(255,255,255,.06)',
  pill:      '#0a1628',
  pillBdr:   'rgba(201,168,112,.3)',
  pillText:  '#c9a870',
  ctaBg:     'linear-gradient(135deg,rgba(201,168,112,.12) 0%,rgba(201,168,112,.04) 100%)',
  ctaText:   '#f0e2c4',
  ctaSub:    'rgba(245,240,232,.5)',
  linkColor: 'rgba(245,240,232,.6)',
  mobileMenu:'#0a1628',
};

function LogoBadge({ size = 44, gold }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `2px solid ${gold}`, boxShadow: `0 0 0 3px ${gold}33`, background: '#07111f' }}>
      <img src="/logo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </div>
  );
}

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, t, toggleLang } = useLang();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const C = theme === 'dark' ? DARK : LIGHT;
  const isDark = theme === 'dark';

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!mounted || isLoading || !user) return;
    router.replace(ROLE_DASHBOARDS[user.role] ?? '/login');
  }, [user, isLoading, mounted, router]);

  if (!mounted || isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: `3px solid ${C.gold}`, borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }
  if (user) return null;

  return (
    <>
      <style>{`
        @keyframes spin   { to { transform: rotate(360deg) } }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes fadein { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:.7} 50%{opacity:1} }
        .hero-title  { animation: fadein .8s ease both }
        .hero-sub    { animation: fadein .8s .18s ease both }
        .hero-cta    { animation: fadein .8s .32s ease both }
        .card-float  { animation: float 5s ease-in-out infinite }
        .card-float2 { animation: float 6s 1.2s ease-in-out infinite }
        .feat-card   { transition: border-color .2s ease, transform .2s ease }

        /* Nav links — hide on mobile */
        .nav-links { display: flex; }
        .nav-auth  { display: flex; }
        .hamburger { display: none; }

        /* Floating cards — hide on mobile */
        .float-card { display: block; }

        /* Stats grid — 4 col on desktop */
        .stats-grid { grid-template-columns: repeat(4,1fr); }

        @media (max-width: 900px) {
          .nav-links { display: none !important; }
          .nav-auth  { display: none !important; }
          .hamburger { display: flex !important; }
          .float-card { display: none !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; gap: 0 !important; }
        }

        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .hero-cta-wrap { flex-direction: column !important; align-items: stretch !important; }
          .hero-cta-wrap a { justify-content: center !important; }
          .pills-wrap { flex-wrap: wrap !important; }
          .cta-section { margin: 0 16px 64px !important; padding: 48px 24px !important; }
          .feat-section { padding: 64px 20px !important; }
          .nav-pad { padding: 0 16px !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden', transition: 'background .3s, color .3s' }}>

        {/* ── NAV ── */}
        <nav className="nav-pad" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '0 40px', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.nav, backdropFilter: 'blur(14px)', borderBottom: `1px solid ${C.navBdr}`, boxShadow: C.navShadow, transition: 'background .3s, border-color .3s' }}>

          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LogoBadge size={40} gold={C.gold} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.text, lineHeight: 1.2 }}>Ubuntu International</div>
              <div style={{ fontSize: 10, color: C.gold, fontWeight: 600, letterSpacing: '.05em' }}>Exchange Ltd</div>
            </div>
          </div>

          {/* Desktop nav links */}
          <div className="nav-links" style={{ alignItems: 'center', gap: 32 }}>
            {[t.land_about, t.land_corridors, t.land_rates, t.land_contact].map(l => (
              <a key={l} href="#" style={{ fontSize: 14, color: C.linkColor, textDecoration: 'none', fontWeight: 500, transition: 'color .15s' }}
                onMouseOver={e => e.currentTarget.style.color = C.gold}
                onMouseOut={e => e.currentTarget.style.color = C.linkColor}
              >{l}</a>
            ))}
          </div>

          {/* Desktop right controls */}
          <div className="nav-auth" style={{ alignItems: 'center', gap: 8 }}>
            <button onClick={toggleLang}
              style={{ padding: '5px 12px', borderRadius: 8, border: `1.5px solid ${C.goldBdr}`, background: C.goldPale, cursor: 'pointer', fontSize: 12, fontWeight: 800, color: C.gold }}>
              {lang === 'en' ? 'FR' : 'EN'}
            </button>
            <button onClick={toggleTheme}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', border: `1.5px solid ${C.goldBdr}`, background: C.goldPale, cursor: 'pointer', color: C.gold }}>
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <Link href="/login" style={{ fontSize: 14, fontWeight: 700, color: C.gold, textDecoration: 'none', padding: '8px 14px' }}>{t.land_login}</Link>
            <Link href="/register" style={{ fontSize: 13, fontWeight: 700, padding: '9px 20px', borderRadius: 100, background: `linear-gradient(135deg,${C.gold},${C.goldViv})`, color: '#fff', textDecoration: 'none' }}>{t.land_signup}</Link>
          </div>

          {/* Mobile: toggles + hamburger */}
          <div className="hamburger" style={{ alignItems: 'center', gap: 8 }}>
            <button onClick={toggleLang}
              style={{ padding: '4px 10px', borderRadius: 7, border: `1.5px solid ${C.goldBdr}`, background: C.goldPale, cursor: 'pointer', fontSize: 11, fontWeight: 800, color: C.gold }}>
              {lang === 'en' ? 'FR' : 'EN'}
            </button>
            <button onClick={toggleTheme}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: '50%', border: `1.5px solid ${C.goldBdr}`, background: C.goldPale, cursor: 'pointer', color: C.gold }}>
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button onClick={() => setMenuOpen(o => !o)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.goldBdr}`, background: 'none', cursor: 'pointer', color: C.text }}>
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div style={{ position: 'fixed', top: 70, left: 0, right: 0, zIndex: 49, background: C.mobileMenu, borderBottom: `1px solid ${C.navBdr}`, padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 4, boxShadow: '0 8px 24px rgba(0,0,0,.12)' }}>
            {[t.land_about, t.land_corridors, t.land_rates, t.land_contact].map(l => (
              <a key={l} href="#" onClick={() => setMenuOpen(false)}
                style={{ fontSize: 15, color: C.linkColor, textDecoration: 'none', fontWeight: 500, padding: '10px 0', borderBottom: `1px solid ${C.navBdr}` }}>{l}</a>
            ))}
            <Link href="/login" onClick={() => setMenuOpen(false)}
              style={{ fontSize: 15, fontWeight: 700, color: C.gold, textDecoration: 'none', padding: '10px 0', borderBottom: `1px solid ${C.navBdr}` }}>{t.land_login}</Link>
            <Link href="/register" onClick={() => setMenuOpen(false)}
              style={{ display: 'block', marginTop: 8, textAlign: 'center', padding: '12px', borderRadius: 100, background: `linear-gradient(135deg,${C.gold},${C.goldViv})`, color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>{t.land_signup}</Link>
          </div>
        )}

        {/* ── HERO ── */}
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', paddingTop: 70, overflow: 'hidden', background: C.bgHero, transition: 'background .3s' }}>

          {isDark && <>
            <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,rgba(201,168,112,.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(ellipse at 35% 35%,rgba(201,168,112,.18) 0%,rgba(100,80,20,.15) 55%,transparent 80%)', boxShadow: '0 0 100px 30px rgba(201,168,112,.07)', pointerEvents: 'none' }} />
          </>}

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 780, padding: '0 20px', width: '100%' }}>
            <div className="hero-title" style={{ marginBottom: 8 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 16px', borderRadius: 100, border: `1.5px solid ${C.goldBdr}`, background: C.goldPale, fontSize: 11, fontWeight: 700, color: C.gold, marginBottom: 24 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.gold, animation: 'pulse 2s infinite', flexShrink: 0 }} />
                {t.land_tagline}
              </div>
              <h1 style={{ fontSize: 'clamp(32px,6vw,76px)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-.03em', color: C.text, margin: 0 }}>
                {t.land_hero_title}<br />
                <span style={{ background: `linear-gradient(135deg,${C.gold} 20%,${C.goldViv} 60%,${C.gold} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {t.land_hero_sub_title}
                </span>
              </h1>
            </div>

            <p className="hero-sub" style={{ fontSize: 'clamp(14px,2vw,18px)', color: C.textSub, maxWidth: 520, margin: '20px auto 36px', lineHeight: 1.7 }}>
              {t.land_hero_desc}
            </p>

            <div className="hero-cta hero-cta-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 36 }}>
              <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 50, padding: '0 28px', borderRadius: 100, background: `linear-gradient(135deg,${C.gold},${C.goldViv})`, color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: `0 6px 24px ${C.gold}55`, whiteSpace: 'nowrap' }}>
                {t.land_send_now} <ArrowRight size={17} />
              </Link>
              <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 50, padding: '0 26px', borderRadius: 100, border: `2px solid ${C.goldBdr}`, color: C.text, fontWeight: 600, fontSize: 15, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                {t.land_sign_in}
              </Link>
            </div>

            {/* Corridor pills */}
            <div className="pills-wrap" style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[['RWF','AED'],['RWF','GHS'],['RWF','KES'],['RWF','UGX']].map(([f, to]) => (
                <div key={to} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 100, border: `1.5px solid ${C.pillBdr}`, background: C.pill, fontSize: 12, fontWeight: 600, color: C.pillText, whiteSpace: 'nowrap' }}>
                  {f} <ArrowRight size={10} style={{ opacity: .5 }} /> {to}
                </div>
              ))}
            </div>
          </div>

          {/* Floating stat cards — hidden on mobile via CSS */}
          <div className="float-card card-float" style={{ position: 'absolute', left: '3%', top: '36%', background: C.cardBg, border: `1px solid ${C.cardBdr}`, borderRadius: 20, padding: '20px 24px', minWidth: 185, boxShadow: C.cardShadow, backdropFilter: isDark ? 'blur(16px)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: C.textSub, fontWeight: 600 }}>{t.land_transfer_vol}</span>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: C.goldPale, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowUpRight size={13} style={{ color: C.gold }} />
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: C.text, letterSpacing: '-.02em' }}>₣2.4B+</div>
            <div style={{ fontSize: 11, color: C.gold, marginTop: 4, fontWeight: 600 }}>{t.land_processed}</div>
            <div style={{ marginTop: 10, height: 4, borderRadius: 2, background: C.cardBdr }}>
              <div style={{ width: '72%', height: '100%', borderRadius: 2, background: `linear-gradient(90deg,${C.gold},${C.goldViv})` }} />
            </div>
          </div>

          <div className="float-card card-float2" style={{ position: 'absolute', right: '3%', top: '44%', background: C.cardBg, border: `1px solid ${C.cardBdr}`, borderRadius: 20, padding: '20px 24px', minWidth: 170, boxShadow: C.cardShadow, backdropFilter: isDark ? 'blur(16px)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: C.textSub, fontWeight: 600 }}>{t.land_success_rate}</span>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: C.goldPale, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowUpRight size={13} style={{ color: C.gold }} />
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: C.text, letterSpacing: '-.02em' }}>99.2%</div>
            <div style={{ fontSize: 11, color: C.gold, marginTop: 4, fontWeight: 600 }}>{t.land_tx_success}</div>
            <div style={{ marginTop: 10, height: 4, borderRadius: 2, background: C.cardBdr }}>
              <div style={{ width: '99%', height: '100%', borderRadius: 2, background: `linear-gradient(90deg,${C.gold},${C.goldViv})` }} />
            </div>
          </div>
        </section>

        {/* ── STATS ROW ── */}
        <section style={{ borderTop: `1px solid ${C.statsBdr}`, borderBottom: `1px solid ${C.statsBdr}`, padding: '40px 20px', display: 'flex', justifyContent: 'center', background: C.statsBg }}>
          <div className="stats-grid" style={{ maxWidth: 900, width: '100%', display: 'grid', gap: 0 }}>
            {[
              { val: '50K+',    label: t.land_stat_customers },
              { val: '12',      label: t.land_stat_countries },
              { val: '< 2min',  label: t.land_stat_delivery },
              { val: 'KYC/AML', label: t.land_stat_compliant },
            ].map(({ val, label }, i) => (
              <div key={label} style={{ textAlign: 'center', padding: '12px 16px', borderRight: i % 2 === 0 ? `1px solid ${C.statsBdr}` : 'none', borderBottom: i < 2 ? `1px solid ${C.statsBdr}` : 'none' }}>
                <div style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 900, color: C.text, letterSpacing: '-.02em' }}>{val}</div>
                <div style={{ fontSize: 12, color: C.gold, marginTop: 6, fontWeight: 700 }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="feat-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 14 }}>{t.land_why}</div>
            <h2 style={{ fontSize: 'clamp(24px,4vw,44px)', fontWeight: 900, color: C.text, margin: 0, lineHeight: 1.15 }}>{t.land_features_title}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 18 }}>
            {[
              { icon: Zap,        title: t.land_feat1_title, desc: t.land_feat1_desc },
              { icon: ShieldCheck,title: t.land_feat2_title, desc: t.land_feat2_desc },
              { icon: Globe2,     title: t.land_feat3_title, desc: t.land_feat3_desc },
              { icon: Users,      title: t.land_feat4_title, desc: t.land_feat4_desc },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="feat-card" style={{ padding: '28px 22px', borderRadius: 20, border: `1.5px solid ${C.cardBdr}`, background: C.cardBg, boxShadow: C.cardShadow }}
                onMouseOver={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = C.cardBdr; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: 46, height: 46, borderRadius: 13, background: C.goldPale, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={20} style={{ color: C.gold }} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: C.text, margin: '0 0 10px' }}>{title}</h3>
                <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="cta-section" style={{ margin: '0 24px 80px', borderRadius: 24, padding: '56px 32px', textAlign: 'center', background: C.ctaBg, border: isDark ? `1px solid ${C.goldBdr}` : 'none', boxShadow: isDark ? 'none' : '0 16px 64px rgba(22,33,64,.2)' }}>
          <h2 style={{ fontSize: 'clamp(22px,4vw,42px)', fontWeight: 900, color: C.ctaText, margin: '0 0 14px', lineHeight: 1.15 }}>
            {t.land_cta_title}
          </h2>
          <p style={{ fontSize: 'clamp(14px,2vw,16px)', color: C.ctaSub, marginBottom: 32, maxWidth: 440, marginLeft: 'auto', marginRight: 'auto' }}>
            {t.land_cta_desc}
          </p>
          <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 50, padding: '0 28px', borderRadius: 100, background: `linear-gradient(135deg,${C.gold},${C.goldViv})`, color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: `0 6px 24px ${C.gold}55` }}>
            {t.land_cta_btn} <ArrowRight size={17} />
          </Link>
        </section>

        <Footer />
      </div>
    </>
  );
}
