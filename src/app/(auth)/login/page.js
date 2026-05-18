'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowLeft, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { api } from '../../../lib/api';
import { setToken, setUser } from '../../../lib/auth';
import { setAuthToken } from '../../../lib/api';

const schema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const ROLE_DASHBOARDS = {
  client: '/client/dashboard',
  agent:  '/agent/dashboard',
  admin:  '/admin/dashboard',
};

export default function LoginPage() {
  const { login, setSession } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const isLight = theme === 'light';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      toast.error('Google did not return credentials — please try again');
      return;
    }
    try {
      const { data } = await api.post('/api/v1/auth/google', { idToken: credentialResponse.credential });
      setSession(data.accessToken, data.user);
      toast.success(`Welcome, ${data.user.name}!`);
      router.push(ROLE_DASHBOARDS[data.user.role] ?? '/');
    } catch (err) {
      toast.error(err?.response?.data?.error ?? 'Google login failed');
    }
  };

  const onSubmit = async ({ email, password }) => {
    try {
      const user = await login(email, password);
      toast.success('Welcome back!');
      router.push(ROLE_DASHBOARDS[user.role] ?? '/');
    } catch (err) {
      toast.error(err?.response?.data?.error ?? err?.response?.data?.message ?? 'Login failed. Check your credentials.');
    }
  };

  // ── Colours ────────────────────────────────────────────────────────────────
  const right = {
    bg:          isLight ? '#FFFFFF' : '#07111f',
    text:        isLight ? '#162140' : '#f0e2c4',
    subtext:     isLight ? 'rgba(22,33,64,.55)' : 'rgba(245,240,232,.45)',
    inputBg:     isLight ? 'rgba(22,33,64,.04)' : 'rgba(255,255,255,.05)',
    inputBorder: isLight ? 'rgba(22,33,64,.14)' : 'rgba(255,255,255,.1)',
    inputFocus:  isLight ? 'rgba(184,144,64,.5)' : 'rgba(201,168,112,.5)',
    inputErr:    isLight ? 'rgba(220,38,38,.5)' : 'rgba(239,68,68,.5)',
    divider:     isLight ? 'rgba(22,33,64,.1)' : 'rgba(255,255,255,.08)',
    link:        isLight ? '#B89040' : '#c9a870',
    demoBox:     isLight ? 'rgba(184,144,64,.08)' : 'rgba(201,168,112,.05)',
    demoBorder:  isLight ? 'rgba(184,144,64,.25)' : 'rgba(201,168,112,.15)',
    demoLabel:   isLight ? '#B89040' : '#c9a870',
    demoText:    isLight ? 'rgba(22,33,64,.5)' : 'rgba(245,240,232,.4)',
    toggleBg:    isLight ? 'rgba(22,33,64,.08)' : 'rgba(255,255,255,.08)',
    toggleIcon:  isLight ? '#162140' : '#f0e2c4',
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Inter, system-ui, sans-serif; }
        .lg-field input {
          width: 100%; padding: 13px 16px; border-radius: 10px;
          border: 1.5px solid ${right.inputBorder};
          background: ${right.inputBg}; color: ${right.text};
          font-size: 14px; outline: none; transition: border-color .15s;
        }
        .lg-field input::placeholder { color: ${right.subtext}; }
        .lg-field input:focus { border-color: ${right.inputFocus}; }
        .lg-field input.err { border-color: ${right.inputErr}; }
        .lg-submit:hover { opacity: .88 }
        .lg-link { color: ${right.link}; text-decoration: none; }
        .lg-link:hover { text-decoration: underline; }
        @keyframes fadein { from { opacity:0; transform:translateX(12px) } to { opacity:1; transform:translateX(0) } }
        .lg-panel { animation: fadein .4s ease }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', transition: 'background .3s' }}>

        {/* ── LEFT PANEL (always dark brand) ── */}
        <div style={{ flex: '0 0 44%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 40, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #0f1e38 0%, #07111f 40%, #1a1200 100%)' }} />
          <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,112,.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,112,.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Brand */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', border: '2px solid #B89040', boxShadow: '0 0 0 3px rgba(184,144,64,.2)', background: '#07111f' }}>
              <img src="/logo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f0e2c4', lineHeight: 1.2 }}>Ubuntu International</div>
              <div style={{ fontSize: 10, color: '#c9a870' }}>Exchange Ltd</div>
            </div>
          </div>

          {/* Middle content */}
          <div style={{ position: 'relative' }}>
            <div style={{ width: 220, margin: '0 auto 36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/logo.png" alt="Ubuntu International Exchange" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#f0e2c4', lineHeight: 1.15, marginBottom: 14 }}>
              Move Money<br />Across Africa
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(245,240,232,.45)', lineHeight: 1.7, maxWidth: 300 }}>
              Fast, affordable remittances from Rwanda to the world. Real-time rates, zero hidden fees.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 28, flexWrap: 'wrap' }}>
              {['99.2% Success', '< 2 min delivery', 'KYC Regulated'].map(s => (
                <span key={s} style={{ padding: '5px 12px', borderRadius: 100, border: '1px solid rgba(201,168,112,.25)', background: 'rgba(201,168,112,.07)', fontSize: 11, fontWeight: 600, color: '#c9a870' }}>{s}</span>
              ))}
            </div>
          </div>

          <p style={{ position: 'relative', fontSize: 11, color: 'rgba(245,240,232,.25)' }}>
            © {new Date().getFullYear()} Ubuntu International Exchange Ltd
          </p>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="lg-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 56px', overflowY: 'auto', background: right.bg, transition: 'background .3s, color .3s', position: 'relative' }}>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{ position: 'absolute', top: 24, right: 24, width: 36, height: 36, borderRadius: '50%', border: 'none', background: right.toggleBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .3s' }}
            title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {isLight ? <Moon size={16} color={right.toggleIcon} /> : <Sun size={16} color={right.toggleIcon} />}
          </button>

          {/* Back link */}
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: right.subtext, textDecoration: 'none', marginBottom: 40 }}>
            <ArrowLeft size={14} /> Back to website
          </Link>

          <div style={{ maxWidth: 420 }}>
            <h1 style={{ fontSize: 36, fontWeight: 800, color: right.text, marginBottom: 8, lineHeight: 1.1, transition: 'color .3s' }}>Welcome back</h1>
            <p style={{ fontSize: 14, color: right.subtext, marginBottom: 32, transition: 'color .3s' }}>
              Don&apos;t have an account?{' '}
              <Link href="/register" className="lg-link">Sign up</Link>
            </p>

            {/* Google SSO */}
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google login was cancelled or failed')}
                theme={isLight ? 'outline' : 'filled_black'}
                size="large"
                width={400}
                text="continue_with"
                shape="rectangular"
                auto_select={false}
              />
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ flex: 1, height: 1, background: right.divider, transition: 'background .3s' }} />
              <span style={{ fontSize: 12, color: right.subtext, transition: 'color .3s' }}>or sign in with email</span>
              <div style={{ flex: 1, height: 1, background: right.divider, transition: 'background .3s' }} />
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="lg-field" style={{ marginBottom: 16 }}>
                <input {...register('email')} type="email" placeholder="Email address" autoComplete="email" className={errors.email ? 'err' : ''} />
                {errors.email && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 5 }}>{errors.email.message}</p>}
              </div>

              <div className="lg-field" style={{ marginBottom: 8, position: 'relative' }}>
                <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="Password" autoComplete="current-password" className={errors.password ? 'err' : ''} style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: right.subtext, padding: 0 }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {errors.password && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 5 }}>{errors.password.message}</p>}
              </div>

              <div style={{ textAlign: 'right', marginBottom: 24 }}>
                <Link href="/forgot-password" className="lg-link" style={{ fontSize: 12 }}>Forgot password?</Link>
              </div>

              <button type="submit" disabled={isSubmitting} className="lg-submit" style={{ width: '100%', padding: '14px', borderRadius: 10, background: 'linear-gradient(135deg,#c9a870,#d4af7a)', color: '#07111f', fontWeight: 700, fontSize: 15, border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? .7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'opacity .15s' }}>
                {isSubmitting ? <><span style={{ width: 16, height: 16, border: '2px solid #07111f', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />Signing in…</> : 'Sign in'}
              </button>
            </form>

            {/* Demo hint */}
            <div style={{ marginTop: 28, padding: '14px 16px', borderRadius: 10, border: `1px solid ${right.demoBorder}`, background: right.demoBox, transition: 'background .3s, border-color .3s' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: right.demoLabel, marginBottom: 6 }}>Demo credentials</p>
              <div style={{ fontSize: 11, color: right.demoText, lineHeight: 1.8, fontFamily: 'monospace', transition: 'color .3s' }}>
                {[['client','Client@12345'],['agent','Agent@12345'],['admin','Admin@12345']].map(([u,p]) => (
                  <div key={u}>{u}@demo.com / {p}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
