'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Globe2, ShieldCheck, Zap, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/layout/Footer';

const ROLE_DASHBOARDS = {
  client: '/client/dashboard',
  agent:  '/agent/dashboard',
  admin:  '/admin/dashboard',
};

/* ── Brand colours (matching second logo) ─────────────────────────────────── */
const C = {
  navy:    '#162140',
  navyMid: '#1E3A6E',
  gold:    '#B89040',
  goldViv: '#C9A020',
  goldPale:'#F0E4BC',
  bg:      '#FFFFFF',
  bgSoft:  '#F4F7FF',
  text:    '#162140',
  textSub: '#4A5A80',
  border:  'rgba(22,33,64,.1)',
  goldBdr: 'rgba(184,144,64,.3)',
};

function LogoBadge({ size = 42 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `2px solid ${C.gold}`, boxShadow: `0 0 0 3px ${C.goldPale}` }}>
      <img src="/logo.jpeg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%' }} />
    </div>
  );
}

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

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
        @keyframes spin    { to { transform: rotate(360deg) } }
        @keyframes float   { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-16px) } }
        @keyframes fadein  { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulse   { 0%,100% { opacity:.7 } 50% { opacity:1 } }
        .hero-title  { animation: fadein .8s ease both }
        .hero-sub    { animation: fadein .8s .18s ease both }
        .hero-cta    { animation: fadein .8s .32s ease both }
        .card-float  { animation: float 5s ease-in-out infinite }
        .card-float2 { animation: float 6s 1.2s ease-in-out infinite }
        .nav-link    { color: ${C.textSub}; text-decoration:none; font-size:14px; font-weight:500; transition:color .15s }
        .nav-link:hover { color: ${C.navy} }
        .btn-gold    { display:inline-flex; align-items:center; gap:8px; height:52px; padding:0 32px; border-radius:100px; background:linear-gradient(135deg,${C.gold},${C.goldViv}); color:#fff; font-weight:700; font-size:15px; text-decoration:none; box-shadow:0 6px 24px rgba(184,144,64,.35); transition:opacity .15s; white-space:nowrap }
        .btn-gold:hover { opacity:.88 }
        .btn-navy    { display:inline-flex; align-items:center; gap:8px; height:52px; padding:0 30px; border-radius:100px; border:2px solid ${C.navy}; color:${C.navy}; font-weight:600; font-size:15px; text-decoration:none; transition:background .15s; white-space:nowrap }
        .btn-navy:hover { background:rgba(22,33,64,.06) }
        .stat-card   { transition:all .25s ease }
        .stat-card:hover { transform:translateY(-4px); box-shadow:0 16px 48px rgba(22,33,64,.14) !important }
        .feat-card   { transition:border-color .2s ease, transform .2s ease }
        .feat-card:hover { border-color:${C.gold} !important; transform:translateY(-3px) }
        .pill-btn    { display:inline-flex; align-items:center; gap:6px; padding:7px 18px; border-radius:100px; border:1.5px solid ${C.goldBdr}; background:${C.goldPale}; font-size:12px; font-weight:600; color:${C.navy}; white-space:nowrap }
      `}</style>

      <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden' }}>

        {/* ── NAV ── */}
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '0 40px', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}`, boxShadow: '0 1px 12px rgba(22,33,64,.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <LogoBadge size={44} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.navy, lineHeight: 1.2 }}>Ubuntu International</div>
              <div style={{ fontSize: 10, color: C.gold, fontWeight: 600, letterSpacing: '.05em' }}>Exchange Ltd</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
            {['About', 'Corridors', 'Rates', 'Contact'].map(l => (
              <a key={l} href="#" className="nav-link">{l}</a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/apply-agent" className="nav-link" style={{ padding: '8px 14px', fontWeight: 600, fontSize: 13 }}>Become an Agent</Link>
            <Link href="/login" style={{ fontSize: 14, fontWeight: 700, color: C.navy, textDecoration: 'none', padding: '8px 18px' }}>Login</Link>
            <Link href="/register" style={{ fontSize: 14, fontWeight: 700, padding: '9px 24px', borderRadius: 100, background: `linear-gradient(135deg,${C.gold},${C.goldViv})`, color: '#fff', textDecoration: 'none', boxShadow: '0 4px 16px rgba(184,144,64,.35)' }}>Sign up</Link>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', paddingTop: 70, overflow: 'hidden', background: `linear-gradient(160deg, ${C.bgSoft} 0%, ${C.bg} 55%, #FDF8EE 100%)` }}>

          {/* Soft background blobs */}
          <div style={{ position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,144,64,.08) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '30%', left: '10%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,33,64,.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '20%', right: '8%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,144,64,.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 780, padding: '0 24px' }}>

            <div className="hero-title" style={{ marginBottom: 8 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 18px', borderRadius: 100, border: `1.5px solid ${C.goldBdr}`, background: C.goldPale, fontSize: 12, fontWeight: 700, color: C.gold, marginBottom: 28 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.gold, animation: 'pulse 2s infinite' }} />
                Empowering Diaspora · Unity in Every Transfer
              </div>
              <h1 style={{ fontSize: 'clamp(40px, 6.5vw, 76px)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-.03em', color: C.navy, margin: 0 }}>
                Send Money Home<br />
                <span style={{ background: `linear-gradient(135deg,${C.gold} 20%,${C.goldViv} 60%,${C.gold} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Fast &amp; Secure
                </span>
              </h1>
            </div>

            <p className="hero-sub" style={{ fontSize: 18, color: C.textSub, maxWidth: 520, margin: '24px auto 40px', lineHeight: 1.7 }}>
              Rwanda&rsquo;s trusted international remittance platform. Competitive rates, real-time tracking, fully regulated.
            </p>

            <div className="hero-cta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 40 }}>
              <Link href="/register" className="btn-gold">Send Money Now <ArrowRight size={17} /></Link>
              <Link href="/login" className="btn-navy">Sign In</Link>
            </div>

            {/* Corridor pills */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'nowrap' }}>
              {[['RWF','AED'],['RWF','GHS'],['RWF','KES'],['RWF','UGX']].map(([f,t]) => (
                <div key={t} className="pill-btn">
                  {f} <ArrowRight size={11} style={{ opacity: .5 }} /> {t}
                </div>
              ))}
            </div>
          </div>

          {/* Floating stat card — LEFT */}
          <div className="card-float stat-card" style={{ position: 'absolute', left: '4%', top: '36%', background: C.bg, border: `1px solid ${C.goldBdr}`, borderRadius: 20, padding: '20px 24px', minWidth: 190, cursor: 'default', boxShadow: '0 8px 32px rgba(22,33,64,.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: C.textSub, fontWeight: 600 }}>Transfer Volume</span>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.goldPale, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowUpRight size={14} style={{ color: C.gold }} />
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: C.navy, letterSpacing: '-.02em' }}>₣2.4B+</div>
            <div style={{ fontSize: 11, color: C.gold, marginTop: 4, fontWeight: 600 }}>Processed annually</div>
            <div style={{ marginTop: 12, height: 4, borderRadius: 2, background: C.border }}>
              <div style={{ width: '72%', height: '100%', borderRadius: 2, background: `linear-gradient(90deg,${C.gold},${C.goldViv})` }} />
            </div>
          </div>

          {/* Floating stat card — RIGHT */}
          <div className="card-float2 stat-card" style={{ position: 'absolute', right: '4%', top: '44%', background: C.bg, border: `1px solid ${C.goldBdr}`, borderRadius: 20, padding: '20px 24px', minWidth: 175, cursor: 'default', boxShadow: '0 8px 32px rgba(22,33,64,.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: C.textSub, fontWeight: 600 }}>Success Rate</span>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.goldPale, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowUpRight size={14} style={{ color: C.gold }} />
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: C.navy, letterSpacing: '-.02em' }}>99.2%</div>
            <div style={{ fontSize: 11, color: C.gold, marginTop: 4, fontWeight: 600 }}>Transaction success</div>
            <div style={{ marginTop: 12, height: 4, borderRadius: 2, background: C.border }}>
              <div style={{ width: '99%', height: '100%', borderRadius: 2, background: `linear-gradient(90deg,${C.gold},${C.goldViv})` }} />
            </div>
          </div>
        </section>

        {/* ── STATS ROW ── */}
        <section style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '48px 32px', display: 'flex', justifyContent: 'center', background: C.bgSoft }}>
          <div style={{ maxWidth: 900, width: '100%', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
            {[
              { val: '50K+',    label: 'Active Customers' },
              { val: '12',      label: 'Countries Served' },
              { val: '< 2min',  label: 'Avg. Delivery Time' },
              { val: 'KYC/AML', label: 'Fully Compliant' },
            ].map(({ val, label }, i) => (
              <div key={label} style={{ textAlign: 'center', padding: '8px 24px', borderRight: i < 3 ? `1px solid ${C.border}` : 'none' }}>
                <div style={{ fontSize: 30, fontWeight: 900, color: C.navy, letterSpacing: '-.02em' }}>{val}</div>
                <div style={{ fontSize: 12, color: C.gold, marginTop: 6, fontWeight: 700 }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 14 }}>Why Choose Us</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: C.navy, margin: 0, lineHeight: 1.15 }}>Built for the African diaspora</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 20 }}>
            {[
              { icon: Zap,        title: 'Instant Delivery',    desc: 'Real-time mobile money payouts to MTN, Airtel and major banks across Africa.' },
              { icon: ShieldCheck,title: 'Regulated & Secure',   desc: 'Licensed operator with full KYC/AML compliance and end-to-end encryption.' },
              { icon: Globe2,     title: 'Best Exchange Rates',  desc: 'Mid-market rates with transparent fees — no hidden costs, ever.' },
              { icon: Users,      title: 'Agent Network',        desc: 'Hundreds of verified cash agents across Rwanda for in-person support.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="feat-card" style={{ padding: '30px 26px', borderRadius: 20, border: `1.5px solid ${C.border}`, background: C.bg, boxShadow: '0 2px 12px rgba(22,33,64,.05)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: C.goldPale, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <Icon size={22} style={{ color: C.gold }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: C.navy, margin: '0 0 10px' }}>{title}</h3>
                <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section style={{ margin: '0 32px 96px', borderRadius: 24, padding: '64px 40px', textAlign: 'center', background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 100%)`, boxShadow: '0 16px 64px rgba(22,33,64,.2)' }}>
          <h2 style={{ fontSize: 'clamp(24px,4vw,42px)', fontWeight: 900, color: '#FFFFFF', margin: '0 0 16px', lineHeight: 1.15 }}>
            Start sending money today
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.65)', marginBottom: 36, maxWidth: 440, marginLeft: 'auto', marginRight: 'auto' }}>
            Join thousands of Rwandans who trust Ubuntu International Exchange every day.
          </p>
          <Link href="/register" className="btn-gold">
            Create Free Account <ArrowRight size={18} />
          </Link>
        </section>

        <Footer />
      </div>
    </>
  );
}
