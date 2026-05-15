'use client';
import { useState } from 'react';
import { User, Mail, Phone, Globe, Shield, Edit3, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useLang } from '../../../contexts/LanguageContext';

const COUNTRIES = [
  'Rwanda', 'Uganda', 'Kenya', 'Tanzania', 'Burundi', 'DRC', 'Ethiopia',
  'South Africa', 'Nigeria', 'Ghana', 'Senegal', "Côte d'Ivoire", 'Other',
];

const ROLE_LABEL = { client: 'Client', agent: 'Agent', admin: 'Administrator' };

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { t } = useLang();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState({ name: user?.name || '', msisdn: user?.msisdn || '', country: user?.country || '' });

  const [pwForm, setPwForm]     = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);

  const isGoogleUser = !!user?.googleId;

  const initials = user?.name
    ? user.name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  async function handleSaveProfile(e) {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');
    setSaving(true);
    try {
      const { data } = await api.put('/api/v1/auth/profile', {
        name: form.name.trim(),
        msisdn: form.msisdn.trim() || null,
        country: form.country || null,
      });
      updateUser(data.user);
      toast.success('Profile updated');
      setEditing(false);
    } catch (err) {
      toast.error(err?.response?.data?.error ?? 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (!pwForm.currentPassword || !pwForm.newPassword) return toast.error('All fields are required');
    if (pwForm.newPassword.length < 8) return toast.error('New password must be at least 8 characters');
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('Passwords do not match');
    setPwSaving(true);
    try {
      await api.put('/api/v1/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      toast.success('Password updated successfully');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err?.response?.data?.error ?? 'Failed to update password');
    } finally {
      setPwSaving(false);
    }
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        .profile-input {
          width: 100%; padding: 10px 14px; border-radius: 8px; font-size: 14px;
          border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.06);
          color: #f0e2c4; outline: none; transition: border-color .15s;
        }
        .profile-input:focus { border-color: #c9a870; }
        .profile-input:disabled { opacity: .5; cursor: not-allowed; }
        .profile-card {
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 16px;
          padding: 24px 28px;
          margin-bottom: 16px;
        }
        .field-row {
          display: flex; align-items: flex-start; gap: 14;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,.07);
        }
        .field-row:last-child { border-bottom: none; }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#07111f 0%,#0f1e38 100%)', padding: '32px 20px', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>

          {/* Back button */}
          <button onClick={() => router.back()}
            style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,240,232,.5)', fontSize: 13, fontWeight: 500, padding: 0 }}
            onMouseOver={e => e.currentTarget.style.color = '#c9a870'}
            onMouseOut={e => e.currentTarget.style.color = 'rgba(245,240,232,.5)'}
          >
            <ArrowLeft size={16} /> Back
          </button>

          {/* Avatar hero card */}
          <div className="profile-card" style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#c9a870,#f0e2c4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#07111f', flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: '#f0e2c4', margin: '0 0 4px' }}>{user?.name}</h1>
              <p style={{ fontSize: 13, color: 'rgba(245,240,232,.5)', margin: '0 0 10px' }}>{user?.email}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: 'rgba(201,168,112,.15)', color: '#c9a870' }}>
                  {ROLE_LABEL[user?.role] ?? user?.role}
                </span>
                {user?.createdAt && (
                  <span style={{ padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, color: 'rgba(245,240,232,.4)', background: 'rgba(255,255,255,.05)' }}>
                    {t.profile_since} {format(new Date(user.createdAt), 'MMM yyyy')}
                  </span>
                )}
              </div>
            </div>
            {!editing && (
              <button onClick={() => setEditing(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 9, background: 'rgba(201,168,112,.1)', border: '1px solid rgba(201,168,112,.25)', cursor: 'pointer', color: '#c9a870', fontWeight: 700, fontSize: 13 }}>
                <Edit3 size={14} /> {t.profile_edit}
              </button>
            )}
          </div>

          {/* Personal info */}
          <div className="profile-card">
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#f0e2c4', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={15} color="#c9a870" /> {t.profile_personal}
            </h2>

            {editing ? (
              <form onSubmit={handleSaveProfile}>
                <div style={{ display: 'grid', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(245,240,232,.5)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>{t.profile_name}</label>
                    <input name="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="profile-input" />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(245,240,232,.5)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>{t.profile_email}</label>
                    <input value={user?.email} disabled className="profile-input" />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(245,240,232,.5)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>{t.profile_phone}</label>
                    <input name="msisdn" value={form.msisdn} onChange={e => setForm(f => ({ ...f, msisdn: e.target.value }))} placeholder="+250700000000" className="profile-input" />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(245,240,232,.5)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>{t.profile_country}</label>
                    <select name="country" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className="profile-input">
                      <option value="">— Select country —</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                  <button type="submit" disabled={saving}
                    style={{ padding: '10px 22px', borderRadius: 9, background: 'linear-gradient(135deg,#c9a870,#d4af7a)', color: '#07111f', fontWeight: 700, fontSize: 14, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {saving ? t.profile_saving : <><CheckCircle size={14} /> {t.profile_save}</>}
                  </button>
                  <button type="button" onClick={() => { setEditing(false); setForm({ name: user?.name || '', msisdn: user?.msisdn || '', country: user?.country || '' }); }}
                    style={{ padding: '10px 18px', borderRadius: 9, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: 'rgba(245,240,232,.6)' }}>
                    {t.profile_cancel}
                  </button>
                </div>
              </form>
            ) : (
              <>
                {[
                  { label: t.profile_name,    value: user?.name,    icon: User   },
                  { label: t.profile_email,   value: user?.email,   icon: Mail   },
                  { label: t.profile_phone,   value: user?.msisdn,  icon: Phone  },
                  { label: t.profile_country, value: user?.country, icon: Globe  },
                  { label: t.profile_role,    value: ROLE_LABEL[user?.role] ?? user?.role, icon: Shield },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="field-row" style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(201,168,112,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={15} color="#c9a870" />
                    </div>
                    <div>
                      <p style={{ fontSize: 10, color: 'rgba(245,240,232,.4)', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '.07em', fontWeight: 700 }}>{label}</p>
                      <p style={{ fontSize: 14, color: '#f0e2c4', margin: 0, fontWeight: 500 }}>{value || '—'}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Change password */}
          <div className="profile-card" style={{ marginBottom: 0 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#f0e2c4', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Lock size={15} color="#c9a870" /> {t.profile_pw_title}
            </h2>

            {isGoogleUser ? (
              <p style={{ fontSize: 13, color: 'rgba(245,240,232,.45)', margin: 0, padding: '12px 16px', borderRadius: 10, background: 'rgba(201,168,112,.06)', border: '1px solid rgba(201,168,112,.12)' }}>
                {t.profile_google_pw}
              </p>
            ) : (
              <form onSubmit={handleChangePassword}>
                <div style={{ display: 'grid', gap: 14 }}>
                  {[
                    { name: 'currentPassword', label: t.profile_current_pw },
                    { name: 'newPassword',     label: t.profile_new_pw },
                    { name: 'confirmPassword', label: t.profile_confirm_pw },
                  ].map(({ name, label }) => (
                    <div key={name}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(245,240,232,.5)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</label>
                      <input type="password" name={name} value={pwForm[name]}
                        onChange={e => setPwForm(f => ({ ...f, [name]: e.target.value }))}
                        required minLength={name !== 'currentPassword' ? 8 : undefined}
                        autoComplete={name === 'currentPassword' ? 'current-password' : 'new-password'}
                        className="profile-input" />
                    </div>
                  ))}
                </div>
                <button type="submit" disabled={pwSaving}
                  style={{ marginTop: 18, padding: '10px 22px', borderRadius: 9, background: 'linear-gradient(135deg,#c9a870,#d4af7a)', color: '#07111f', fontWeight: 700, fontSize: 14, border: 'none', cursor: pwSaving ? 'not-allowed' : 'pointer', opacity: pwSaving ? .7 : 1 }}>
                  {pwSaving ? t.profile_updating_pw : t.profile_update_pw}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
