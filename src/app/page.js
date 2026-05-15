'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Globe2, ShieldCheck, Zap, Users, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Footer from '../components/layout/Footer';

const ROLE_DASHBOARDS = {
  client: '/client/dashboard',
  agent:  '/agent/dashboard',
  admin:  '/admin/dashboard',
};

/* ── Colour palettes ──────────────────────────────────────────────────────── */
const LIGHT = {
  bg:       '#FFFFFF',
  bgSoft:   '#F4F7FF',
  bgHero:   'linear-gradient(160deg, #EEF3FF 0%, #FFFFFF 55%, #FDF8EE 100%)',
  nav:      'rgba(255,255,255,.95)',
  navBdr:   'rgba(22,33,64,.1)',
  navShadow:'0 1px 12px rgba(22,33,64,.06)',
  text:     '#162140',
  textSub:  '#4A5A80',
  gold:     '#B89040',
  goldViv:  '#C9A020',
  goldPale: '#F0E4BC',
  goldBdr:  'rgba(184,144,64,.3)',
  cardBg:   '#FFFFFF',
  cardBdr:  'rgba(22,33,64,.1)',
  cardShadow:'0 8px 32px rgba(22,33,64,.08)',
  statsBg:  '#F4F7FF',
  statsBdr: 'rgba(22,33,64,.1)',
  pill:     '#F0E4BC',
  pillBdr:  'rgba(184,144,64,.3)',
  pillText: '#162140',
  btnOutline:'#162140',
  ctaBg:    'linear-gradient(135deg,#162140 0%,#1E3A6E 100%)',
  ctaText:  '#FFFFFF',
  ctaSub:   'rgba(255,255,255,.65)',
  linkColor:'#162140',
};

const DARK = {
  bg:       '#07111f',
  bgSoft:   '#0f1e38',
  bgHero:   '#07111f',
  nav:      'rgba(7,17,31,.88)',
  navBdr:   'rgba(255,255,255,.07)',
  navShadow:'none',
  text:     '#f0e2c4',
  textSub:  'rgba(245,240,232,.55)',
  gold:     '#c9a870',
  goldViv:  '#d4af7a',
  goldPale: 'rgba(201,168,112,.12)',
  goldBdr:  'rgba(201,168,112,.3)',
  cardBg:   'rgba(10,22,40,.85)',
  cardBdr:  'rgba(201,168,112,.2)',
  cardShadow:'0 8px 32px rgba(0,0,0,.3)',
  statsBg:  'rgba(255,255,255,.02)',
  statsBdr: 'rgba(255,255,255,.06)',
  pill:     '#0a1628',
  pillBdr:  'rgba(201,168,112,.3)',
  pillText: '#c9a870',
  btnOutline:'#f0e2c4',
  ctaBg:    'linear-gradient(135deg,rgba(201,168,112,.12) 0%,rgba(201,168,112,.04) 100%)',
  ctaText:  '#f0e2c4',
  ctaSub:   'rgba(245,240,232,.5)',
  linkColor:'rgba(245,240,232,.6)',
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
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

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
        .stat-card   { transition: all .25s ease }
      `}</style>

      <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden', transition: 'background .3s, color .3s' }}>

        {/* ── NAV ── */}
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '0 40px', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.nav, backdropFilter: 'blur(14px)', borderBottom: `1px solid ${C.navBdr}`, boxShadow: C.navShadow, transition: 'background .3s, border-color .3s' }}>

          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <LogoBadge size={44} gold={C.gold} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.text, lineHeight: 1.2 }}>Ubuntu International</div>
              <div style={{ fontSize: 10, color: C.gold, fontWeight: 600, letterSpacing: '.05em' }}>Exchange Ltd</div>
            </div>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
            {['About', 'Corridors', 'Rates', 'Contact'].map(l => (
              <a key={l} href="#" style={{ fontSize: 14, color: C.linkColor, textDecoration: 'none', fontWeight: 500, transition: 'color .15s' }}
                onMouseOver={e => e.currentTarget.style.color = C.gold}
                onMouseOut={e => e.currentTarget.style.color = C.linkColor}
              >{l}</a>
            ))}
          </div>

          {/* Right: theme toggle + auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: '50%', border: `1.5px solid ${C.goldBdr}`, background: C.goldPale, cursor: 'pointer', transition: 'all .2s', color: C.gold, flexShrink: 0 }}
              onMouseOver={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = isDark ? '#07111f' : '#fff'; }}
              onMouseOut={e => { e.currentTarget.style.background = C.goldPale; e.currentTarget.style.color = C.gold; }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <Link href="/apply-agent" style={{ fontSize: 13, fontWeight: 600, color: C.textSub, textDecoration: 'none', padding: '8px 14px', transition: 'color .15s' }}>Become an Agent</Link>
            <Link href="/login" style={{ fontSize: 14, fontWeight: 700, color: C.gold, textDecoration: 'none', padding: '8px 18px' }}>Login</Link>
            <Link href="/register" style={{ fontSize: 14, fontWeight: 700, padding: '9px 24px', borderRadius: 100, background: `linear-gradient(135deg,${C.gold},${C.goldViv})`, color: '#fff', textDecoration: 'none', boxShadow: `0 4px 16px ${C.gold}55` }}>Sign up</Link>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', paddingTop: 70, overflow: 'hidden', background: C.bgHero, transition: 'background .3s' }}>

          {isDark && <>
            <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,rgba(201,168,112,.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(ellipse at 35% 35%,rgba(201,168,112,.18) 0%,rgba(100,80,20,.15) 55%,transparent 80%)', boxShadow: '0 0 100px 30px rgba(201,168,112,.07)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 360, height: 360, borderRadius: '50%', border: '1px solid rgba(201,168,112,.14)', pointerEvents: 'none' }} />
          </>}

          {!isDark && <>
            <div style={{ position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle,rgba(184,144,64,.07) 0%,transparent 65%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '20%', right: '8%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(184,144,64,.06) 0%,transparent 70%)', pointerEvents: 'none' }} />
          </>}

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 780, padding: '0 24px' }}>
            <div className="hero-title" style={{ marginBottom: 8 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 18px', borderRadius: 100, border: `1.5px solid ${C.goldBdr}`, background: C.goldPale, fontSize: 12, fontWeight: 700, color: C.gold, marginBottom: 28, transition: 'background .3s' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.gold, animation: 'pulse 2s infinite' }} />
                Empowering Diaspora · Unity in Every Transfer
              </div>
              <h1 style={{ fontSize: 'clamp(40px,6.5vw,76px)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-.03em', color: C.text, margin: 0, transition: 'color .3s' }}>
                Send Money Home<br />
                <span style={{ background: `linear-gradient(135deg,${C.gold} 20%,${C.goldViv} 60%,${C.gold} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Fast &amp; Secure
                </span>
              </h1>
            </div>

            <p className="hero-sub" style={{ fontSize: 18, color: C.textSub, maxWidth: 520, margin: '24px auto 40px', lineHeight: 1.7, transition: 'color .3s' }}>
              Rwanda&rsquo;s trusted international remittance platform. Competitive rates, real-time tracking, fully regulated.
            </p>

            <div className="hero-cta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 40 }}>
              <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 52, padding: '0 32px', borderRadius: 100, background: `linear-gradient(135deg,${C.gold},${C.goldViv})`, color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: `0 6px 24px ${C.gold}55`, whiteSpace: 'nowrap' }}>
                Send Money Now <ArrowRight size={17} />
              </Link>
              <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 52, padding: '0 30px', borderRadius: 100, border: `2px solid ${C.goldBdr}`, color: C.text, fontWeight: 600, fontSize: 15, textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color .3s, border-color .3s' }}>
                Sign In
              </Link>
            </div>

            {/* Corridor pills */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'nowrap' }}>
              {[['RWF','AED'],['RWF','GHS'],['RWF','KES'],['RWF','UGX']].map(([f,t]) => (
                <div key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 18px', borderRadius: 100, border: `1.5px solid ${C.pillBdr}`, background: C.pill, fontSize: 12, fontWeight: 600, color: C.pillText, whiteSpace: 'nowrap', transition: 'background .3s, color .3s' }}>
                  {f} <ArrowRight size={11} style={{ opacity: .5 }} /> {t}
                </div>
              ))}
            </div>
          </div>

          {/* Floating stat card — LEFT */}
          <div className="card-float stat-card" style={{ position: 'absolute', left: '4%', top: '36%', background: C.cardBg, border: `1px solid ${C.cardBdr}`, borderRadius: 20, padding: '20px 24px', minWidth: 190, cursor: 'default', boxShadow: C.cardShadow, backdropFilter: isDark ? 'blur(16px)' : 'none', transition: 'background .3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: C.textSub, fontWeight: 600 }}>Transfer Volume</span>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.goldPale, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowUpRight size={14} style={{ color: C.gold }} />
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: C.text, letterSpacing: '-.02em' }}>₣2.4B+</div>
            <div style={{ fontSize: 11, color: C.gold, marginTop: 4, fontWeight: 600 }}>Processed annually</div>
            <div style={{ marginTop: 12, height: 4, borderRadius: 2, background: C.cardBdr }}>
              <div style={{ width: '72%', height: '100%', borderRadius: 2, background: `linear-gradient(90deg,${C.gold},${C.goldViv})` }} />
            </div>
          </div>

          {/* Floating stat card — RIGHT */}
          <div className="card-float2 stat-card" style={{ position: 'absolute', right: '4%', top: '44%', background: C.cardBg, border: `1px solid ${C.cardBdr}`, borderRadius: 20, padding: '20px 24px', minWidth: 175, cursor: 'default', boxShadow: C.cardShadow, backdropFilter: isDark ? 'blur(16px)' : 'none', transition: 'background .3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: C.textSub, fontWeight: 600 }}>Success Rate</span>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.goldPale, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowUpRight size={14} style={{ color: C.gold }} />
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: C.text, letterSpacing: '-.02em' }}>99.2%</div>
            <div style={{ fontSize: 11, color: C.gold, marginTop: 4, fontWeight: 600 }}>Transaction success</div>
            <div style={{ marginTop: 12, height: 4, borderRadius: 2, background: C.cardBdr }}>
              <div style={{ width: '99%', height: '100%', borderRadius: 2, background: `linear-gradient(90deg,${C.gold},${C.goldViv})` }} />
            </div>
          </div>
        </section>

        {/* ── STATS ROW ── */}
        <section style={{ borderTop: `1px solid ${C.statsBdr}`, borderBottom: `1px solid ${C.statsBdr}`, padding: '48px 32px', display: 'flex', justifyContent: 'center', background: C.statsBg, transition: 'background .3s' }}>
          <div style={{ maxWidth: 900, width: '100%', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
            {[
              { val: '50K+',    label: 'Active Customers' },
              { val: '12',      label: 'Countries Served' },
              { val: '< 2min',  label: 'Avg. Delivery Time' },
              { val: 'KYC/AML', label: 'Fully Compliant' },
            ].map(({ val, label }, i) => (
              <div key={label} style={{ textAlign: 'center', padding: '8px 24px', borderRight: i < 3 ? `1px solid ${C.statsBdr}` : 'none' }}>
                <div style={{ fontSize: 30, fontWeight: 900, color: C.text, letterSpacing: '-.02em', transition: 'color .3s' }}>{val}</div>
                <div style={{ fontSize: 12, color: C.gold, marginTop: 6, fontWeight: 700 }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 14 }}>Why Choose Us</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: C.text, margin: 0, lineHeight: 1.15, transition: 'color .3s' }}>Built for the African diaspora</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 20 }}>
            {[
              { icon: Zap,        title: 'Instant Delivery',    desc: 'Real-time mobile money payouts to MTN, Airtel and major banks across Africa.' },
              { icon: ShieldCheck,title: 'Regulated & Secure',   desc: 'Licensed operator with full KYC/AML compliance and end-to-end encryption.' },
              { icon: Globe2,     title: 'Best Exchange Rates',  desc: 'Mid-market rates with transparent fees — no hidden costs, ever.' },
              { icon: Users,      title: 'Agent Network',        desc: 'Hundreds of verified cash agents across Rwanda for in-person support.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="feat-card" style={{ padding: '30px 26px', borderRadius: 20, border: `1.5px solid ${C.cardBdr}`, background: C.cardBg, boxShadow: C.cardShadow, transition: 'background .3s, border-color .2s, transform .2s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = C.cardBdr; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 14, background: C.goldPale, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <Icon size={22} style={{ color: C.gold }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: C.text, margin: '0 0 10px', transition: 'color .3s' }}>{title}</h3>
                <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.65, margin: 0, transition: 'color .3s' }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section style={{ margin: '0 32px 96px', borderRadius: 24, padding: '64px 40px', textAlign: 'center', background: C.ctaBg, border: isDark ? `1px solid ${C.goldBdr}` : 'none', boxShadow: isDark ? 'none' : '0 16px 64px rgba(22,33,64,.2)' }}>
          <h2 style={{ fontSize: 'clamp(24px,4vw,42px)', fontWeight: 900, color: C.ctaText, margin: '0 0 16px', lineHeight: 1.15 }}>
            Start sending money today
          </h2>
          <p style={{ fontSize: 16, color: C.ctaSub, marginBottom: 36, maxWidth: 440, marginLeft: 'auto', marginRight: 'auto' }}>
            Join thousands of Rwandans who trust Ubuntu International Exchange every day.
          </p>
          <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 52, padding: '0 32px', borderRadius: 100, background: `linear-gradient(135deg,${C.gold},${C.goldViv})`, color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: `0 6px 24px ${C.gold}55` }}>
            Create Free Account <ArrowRight size={18} />
          </Link>
        </section>

        <Footer />
      </div>
    </>
  );
}
