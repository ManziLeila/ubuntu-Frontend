'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowLeft, Check, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { api } from '../../../lib/api';

const schema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Invalid email address'),
  msisdn:   z.string().min(9, 'Enter a valid phone number'),
  country:  z.string().length(2, 'Select a country'),
  password: z.string().min(8, 'At least 8 characters')
            .regex(/[A-Z]/, 'Must contain uppercase letter')
            .regex(/[0-9]/, 'Must contain a number'),
  confirm:  z.string(),
}).refine(d => d.password === d.confirm, { message: 'Passwords do not match', path: ['confirm'] });

const COUNTRIES = [
  { code: 'RW', name: 'Rwanda' }, { code: 'GH', name: 'Ghana' }, { code: 'UG', name: 'Uganda' },
  { code: 'KE', name: 'Kenya' }, { code: 'TZ', name: 'Tanzania' }, { code: 'NG', name: 'Nigeria' },
  { code: 'ZM', name: 'Zambia' }, { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' }, { code: 'CA', name: 'Canada' }, { code: 'AE', name: 'UAE' },
];

const PERKS = [
  'Send money across 20+ African corridors',
  'Real-time exchange rates, zero hidden fees',
  'KYC-regulated and fully compliant',
  'Delivery under 2 minutes via Mobile Money',
];

export default function RegisterPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
      toast.success(`Account created! Welcome, ${data.user.name}!`);
      router.push('/client/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.error ?? 'Google sign-up failed');
    }
  };

  const onSubmit = async (data) => {
    try {
      await api.post('/api/v1/auth/register', {
        name: data.name, email: data.email, msisdn: data.msisdn,
        country: data.country, password: data.password,
      });
      toast.success('Account created! Please sign in.');
      router.push('/login');
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Registration failed.');
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
    inputErr:    isLight ? 'rgba(220,38,38,.5)'  : 'rgba(239,68,68,.5)',
    selectBg:    isLight ? '#FFFFFF' : '#07111f',
    divider:     isLight ? 'rgba(22,33,64,.1)'   : 'rgba(255,255,255,.08)',
    link:        isLight ? '#B89040' : '#c9a870',
    toggleBg:    isLight ? 'rgba(22,33,64,.08)'  : 'rgba(255,255,255,.08)',
    toggleIcon:  isLight ? '#162140' : '#f0e2c4',
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Inter, system-ui, sans-serif; }
        .rg-field input, .rg-field select {
          width: 100%; padding: 12px 16px; border-radius: 10px;
          border: 1.5px solid ${right.inputBorder};
          background: ${right.inputBg}; color: ${right.text};
          font-size: 14px; outline: none; transition: border-color .15s;
          appearance: none; -webkit-appearance: none;
        }
        .rg-field select { background-color: ${right.selectBg}; }
        .rg-field select option { background: ${right.selectBg}; color: ${right.text}; }
        .rg-field input::placeholder { color: ${right.subtext}; }
        .rg-field input:focus, .rg-field select:focus { border-color: ${right.inputFocus}; }
        .rg-field input.err, .rg-field select.err { border-color: ${right.inputErr}; }
        .rg-submit:hover { opacity: .88 }
        .rg-link { color: ${right.link}; text-decoration: none; }
        .rg-link:hover { text-decoration: underline; }
        @keyframes fadein { from { opacity:0; transform:translateX(12px) } to { opacity:1; transform:translateX(0) } }
        .rg-panel { animation: fadein .4s ease }
        @keyframes spin { to { transform: rotate(360deg) } }
        .rg-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', transition: 'background .3s' }}>

        {/* ── LEFT PANEL (always dark brand) ── */}
        <div style={{ flex: '0 0 44%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 40, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #0f1e38 0%, #07111f 40%, #1a1200 100%)' }} />
          <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%,-50%)', width: 460, height: 460, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,112,.13) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '8%', right: '-8%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,112,.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

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

          {/* Middle */}
          <div style={{ position: 'relative' }}>
            <div style={{ width: 180, margin: '0 auto 32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/logo.png" alt="Ubuntu International Exchange" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
            </div>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: '#f0e2c4', lineHeight: 1.15, marginBottom: 12 }}>
              Join Thousands<br />Sending Home
            </h2>
            <p style={{ fontSize: 13.5, color: 'rgba(245,240,232,.45)', lineHeight: 1.7, maxWidth: 300, marginBottom: 28 }}>
              Open your free account in minutes. No paperwork, no branches.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PERKS.map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(201,168,112,.15)', border: '1px solid rgba(201,168,112,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Check size={10} color="#c9a870" strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: 12.5, color: 'rgba(245,240,232,.55)', lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ position: 'relative', fontSize: 11, color: 'rgba(245,240,232,.25)' }}>
            © {new Date().getFullYear()} Ubuntu International Exchange Ltd
          </p>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="rg-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 56px', overflowY: 'auto', background: right.bg, transition: 'background .3s', position: 'relative' }}>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{ position: 'absolute', top: 24, right: 24, width: 36, height: 36, borderRadius: '50%', border: 'none', background: right.toggleBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .3s' }}
            title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {isLight ? <Moon size={16} color={right.toggleIcon} /> : <Sun size={16} color={right.toggleIcon} />}
          </button>

          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: right.subtext, textDecoration: 'none', marginBottom: 32, transition: 'color .3s' }}>
            <ArrowLeft size={14} /> Back to website
          </Link>

          <div style={{ maxWidth: 440 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: right.text, marginBottom: 6, lineHeight: 1.1, transition: 'color .3s' }}>Create account</h1>
            <p style={{ fontSize: 14, color: right.subtext, marginBottom: 28, transition: 'color .3s' }}>
              Already have an account?{' '}
              <Link href="/login" className="rg-link">Sign in</Link>
            </p>

            {/* Google SSO */}
            <div style={{ marginBottom: 22, display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google sign-up was cancelled or failed')}
                theme={isLight ? 'outline' : 'filled_black'}
                size="large"
                width={400}
                text="continue_with"
                shape="rectangular"
                auto_select={false}
              />
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
              <div style={{ flex: 1, height: 1, background: right.divider, transition: 'background .3s' }} />
              <span style={{ fontSize: 12, color: right.subtext, transition: 'color .3s' }}>or sign up with email</span>
              <div style={{ flex: 1, height: 1, background: right.divider, transition: 'background .3s' }} />
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Name */}
              <div className="rg-field" style={{ marginBottom: 12 }}>
                <input {...register('name')} type="text" placeholder="Full name" autoComplete="name" className={errors.name ? 'err' : ''} />
                {errors.name && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="rg-field" style={{ marginBottom: 12 }}>
                <input {...register('email')} type="email" placeholder="Email address" autoComplete="email" className={errors.email ? 'err' : ''} />
                {errors.email && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{errors.email.message}</p>}
              </div>

              {/* Phone + Country */}
              <div className="rg-grid2" style={{ marginBottom: 12 }}>
                <div className="rg-field">
                  <input {...register('msisdn')} type="tel" placeholder="Phone (+250...)" autoComplete="tel" className={errors.msisdn ? 'err' : ''} />
                  {errors.msisdn && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{errors.msisdn.message}</p>}
                </div>
                <div className="rg-field">
                  <select {...register('country')} className={errors.country ? 'err' : ''} defaultValue="">
                    <option value="" disabled>Country</option>
                    {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                  </select>
                  {errors.country && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{errors.country.message}</p>}
                </div>
              </div>

              {/* Password */}
              <div className="rg-field" style={{ marginBottom: 12, position: 'relative' }}>
                <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="Password (min 8 chars)" autoComplete="new-password" className={errors.password ? 'err' : ''} style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: right.subtext, padding: 0 }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {errors.password && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{errors.password.message}</p>}
              </div>

              {/* Confirm */}
              <div className="rg-field" style={{ marginBottom: 22 }}>
                <input {...register('confirm')} type={showPw ? 'text' : 'password'} placeholder="Confirm password" autoComplete="new-password" className={errors.confirm ? 'err' : ''} />
                {errors.confirm && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{errors.confirm.message}</p>}
              </div>

              <button type="submit" disabled={isSubmitting} className="rg-submit" style={{ width: '100%', padding: '14px', borderRadius: 10, background: 'linear-gradient(135deg,#c9a870,#d4af7a)', color: '#07111f', fontWeight: 700, fontSize: 15, border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? .7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'opacity .15s' }}>
                {isSubmitting ? <><span style={{ width: 16, height: 16, border: '2px solid #07111f', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />Creating account…</> : 'Create account'}
              </button>

              <p style={{ fontSize: 11, color: right.subtext, textAlign: 'center', marginTop: 16, lineHeight: 1.6, transition: 'color .3s' }}>
                By creating an account you agree to our{' '}
                <a href="#" className="rg-link">Terms of Service</a> and{' '}
                <a href="#" className="rg-link">Privacy Policy</a>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
