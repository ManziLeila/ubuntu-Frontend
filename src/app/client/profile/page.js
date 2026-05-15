'use client';
import { useState } from 'react';
import { User, Mail, Phone, Globe, Shield, Edit3, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useLang } from '../../../contexts/LanguageContext';
import { useTheme } from '../../../contexts/ThemeContext';

const COUNTRIES = [
  'Rwanda', 'Uganda', 'Kenya', 'Tanzania', 'Burundi', 'DRC', 'Ethiopia',
  'South Africa', 'Nigeria', 'Ghana', 'Senegal', "Côte d'Ivoire", 'Other',
];

const ROLE_LABEL = { client: 'Client', agent: 'Agent', admin: 'Administrator' };

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { t } = useLang();
  const { theme } = useTheme();
  const router = useRouter();
  const isLight = theme === 'light';

  const C = {
    bg:       isLight ? '#f0ede8' : 'linear-gradient(180deg,#07111f 0%,#0f1e38 100%)',
    card:     isLight ? '#ffffff' : 'rgba(255,255,255,.04)',
    cardBdr:  isLight ? 'rgba(22,33,64,.09)' : 'rgba(255,255,255,.08)',
    text:     isLight ? '#162140' : '#f0e2c4',
    sub:      isLight ? 'rgba(22,33,64,.45)' : 'rgba(245,240,232,.4)',
    label:    isLight ? 'rgba(22,33,64,.5)' : 'rgba(245,240,232,.4)',
    divider:  isLight ? 'rgba(22,33,64,.08)' : 'rgba(255,255,255,.07)',
    inputBg:  isLight ? 'rgba(22,33,64,.04)' : 'rgba(255,255,255,.06)',
    inputBdr: isLight ? 'rgba(22,33,64,.15)' : 'rgba(255,255,255,.12)',
    inputClr: isLight ? '#162140' : '#f0e2c4',
    backClr:  isLight ? 'rgba(22,33,64,.4)' : 'rgba(245,240,232,.4)',
    cancelBg: isLight ? 'rgba(22,33,64,.06)' : 'rgba(255,255,255,.06)',
    cancelBdr:isLight ? 'rgba(22,33,64,.15)' : 'rgba(255,255,255,.1)',
    cancelClr:isLight ? 'rgba(22,33,64,.6)' : 'rgba(245,240,232,.6)',
    pwInfoBg: isLight ? 'rgba(201,168,112,.06)' : 'rgba(201,168,112,.06)',
    pwInfoBdr:isLight ? 'rgba(201,168,112,.2)' : 'rgba(201,168,112,.12)',
    iconBg:   isLight ? 'rgba(201,168,112,.1)' : 'rgba(201,168,112,.08)',
    memberBg: isLight ? 'rgba(22,33,64,.06)' : 'rgba(255,255,255,.05)',
    memberClr:isLight ? 'rgba(22,33,64,.5)' : 'rgba(245,240,232,.4)',
  };

  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState({ name: user?.name || '', msisdn: user?.msisdn || '', country: user?.country || '' });
  const [pwForm, setPwForm]   = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
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
    } finally { setSaving(false); }
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
    } finally { setPwSaving(false); }
  }

  const cardStyle = { background: C.card, border: `1px solid ${C.cardBdr}`, borderRadius: 16, padding: '24px 28px', marginBottom: 16 };
  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 8, fontSize: 14, border: `1px solid ${C.inputBdr}`, background: C.inputBg, color: C.inputClr, outline: 'none', boxSizing: 'border-box', transition: 'border-color .15s' };
  const labelStyle = { fontSize: 11, fontWeight: 700, color: C.label, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.07em' };

  return (
    <>
      <style>{`
        .profile-input:focus { border-color: #c9a870 !important; }
        .profile-input:disabled { opacity: .5; cursor: not-allowed; }
        .back-btn:hover { color: #c9a870 !important; }
      `}</style>

      <div style={{ minHeight: '100vh', background: C.bg, padding: '32px 20px', fontFamily: 'Inter, system-ui, sans-serif', transition: 'background .3s' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>

          {/* Back */}
          <button onClick={() => router.back()} className="back-btn"
            style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, background: 'none', border: 'none', cursor: 'pointer', color: C.backClr, fontSize: 13, fontWeight: 500, padding: 0, transition: 'color .15s' }}>
            <ArrowLeft size={16} /> Back
          </button>

          {/* Avatar hero */}
          <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#c9a870,#f0e2c4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#07111f', flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: C.text, margin: '0 0 4px', transition: 'color .3s' }}>{user?.name}</h1>
              <p style={{ fontSize: 13, color: C.sub, margin: '0 0 10px' }}>{user?.email}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: 'rgba(201,168,112,.15)', color: '#c9a870' }}>
                  {ROLE_LABEL[user?.role] ?? user?.role}
                </span>
                {user?.createdAt && (
                  <span style={{ padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, color: C.memberClr, background: C.memberBg }}>
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
          <div style={cardStyle}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={15} color="#c9a870" /> {t.profile_personal}
            </h2>

            {editing ? (
              <form onSubmit={handleSaveProfile}>
                <div style={{ display: 'grid', gap: 14 }}>
                  {[
                    { name: 'name',    label: t.profile_name,    type: 'text',  placeholder: '' },
                    { name: 'msisdn',  label: t.profile_phone,   type: 'text',  placeholder: '+250700000000' },
                  ].map(({ name, label, type, placeholder }) => (
                    <div key={name}>
                      <label style={labelStyle}>{label}</label>
                      <input type={type} name={name} value={form[name]} placeholder={placeholder}
                        onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                        required={name === 'name'}
                        className="profile-input" style={inputStyle} />
                    </div>
                  ))}
                  <div>
                    <label style={labelStyle}>{t.profile_email}</label>
                    <input value={user?.email} disabled className="profile-input" style={{ ...inputStyle, opacity: .5, cursor: 'not-allowed' }} />
                  </div>
                  <div>
                    <label style={labelStyle}>{t.profile_country}</label>
                    <select name="country" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                      className="profile-input" style={inputStyle}>
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
                    style={{ padding: '10px 18px', borderRadius: 9, background: C.cancelBg, border: `1px solid ${C.cancelBdr}`, cursor: 'pointer', fontWeight: 600, fontSize: 14, color: C.cancelClr }}>
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
                ].map(({ label, value, icon: Icon }, i, arr) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0', borderBottom: i < arr.length - 1 ? `1px solid ${C.divider}` : 'none' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: C.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={15} color="#c9a870" />
                    </div>
                    <div>
                      <p style={{ fontSize: 10, color: C.label, margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '.07em', fontWeight: 700 }}>{label}</p>
                      <p style={{ fontSize: 14, color: C.text, margin: 0, fontWeight: 500 }}>{value || '—'}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Change password */}
          <div style={{ ...cardStyle, marginBottom: 0 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Lock size={15} color="#c9a870" /> {t.profile_pw_title}
            </h2>

            {isGoogleUser ? (
              <p style={{ fontSize: 13, color: C.sub, margin: 0, padding: '12px 16px', borderRadius: 10, background: C.pwInfoBg, border: `1px solid ${C.pwInfoBdr}` }}>
                {t.profile_google_pw}
              </p>
            ) : (
              <form onSubmit={handleChangePassword}>
                <div style={{ display: 'grid', gap: 14 }}>
                  {[
                    { name: 'currentPassword', label: t.profile_current_pw, ac: 'current-password' },
                    { name: 'newPassword',     label: t.profile_new_pw,     ac: 'new-password' },
                    { name: 'confirmPassword', label: t.profile_confirm_pw, ac: 'new-password' },
                  ].map(({ name, label, ac }) => (
                    <div key={name}>
                      <label style={labelStyle}>{label}</label>
                      <input type="password" name={name} value={pwForm[name]}
                        onChange={e => setPwForm(f => ({ ...f, [name]: e.target.value }))}
                        required minLength={name !== 'currentPassword' ? 8 : undefined}
                        autoComplete={ac} className="profile-input" style={inputStyle} />
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
