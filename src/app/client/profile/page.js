'use client';
import { useState } from 'react';
import { User, Mail, Phone, Globe, Shield, Edit3, Lock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { api } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useLang } from '../../../contexts/LanguageContext';
import DashboardLayout from '../../../components/layout/DashboardLayout';

const COUNTRIES = [
  'Rwanda', 'Uganda', 'Kenya', 'Tanzania', 'Burundi', 'DRC', 'Ethiopia',
  'South Africa', 'Nigeria', 'Ghana', 'Senegal', 'Côte d\'Ivoire', 'Other',
];

const ROLE_LABEL = { client: 'Client', agent: 'Agent', admin: 'Administrator' };

function Field({ label, value, icon: Icon }) {
  return (
    <div className="border-gray-100" style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 0', borderBottom: '1px solid' }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(201,168,112,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={16} color="#c9a870" />
      </div>
      <div>
        <p className="db-text-secondary" style={{ fontSize: 11, margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600 }}>{label}</p>
        <p className="db-text-primary" style={{ fontSize: 14, margin: 0, fontWeight: 500 }}>{value || '—'}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { t } = useLang();

  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [form, setForm]         = useState({ name: user?.name || '', msisdn: user?.msisdn || '', country: user?.country || '' });

  const [pwForm, setPwForm]     = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);

  const isGoogleUser = !!user?.googleId;

  function handleFormChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handlePwChange(e) {
    setPwForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

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

  const initials = user?.name
    ? user.name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <DashboardLayout title={t.profile_title}>
      <style>{`
        :root { --bdr: rgba(22,33,64,.09); --sub: rgba(22,33,64,.5); --text: #162140; }
        .db-form-input {
          width: 100%; padding: 10px 14px; border-radius: 8px; font-size: 14px;
          outline: none; transition: border-color .15s;
        }
        .db-form-input:focus { border-color: #c9a870 !important; }
      `}</style>

      <div style={{ maxWidth: 720 }}>
        {/* Avatar + name hero */}
        <div className="db-card" style={{ borderRadius: 16, padding: '28px 28px 24px', border: '1px solid transparent', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#c9a870,#f0e2c4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: '#07111f', flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <h1 className="db-text-primary" style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>{user?.name}</h1>
            <p className="db-text-secondary" style={{ fontSize: 13, margin: '0 0 8px' }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: 'rgba(201,168,112,.15)', color: '#c9a870', textTransform: 'capitalize' }}>
                {ROLE_LABEL[user?.role] ?? user?.role}
              </span>
              {user?.createdAt && (
                <span className="db-text-secondary" style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'rgba(22,33,64,.05)' }}>
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
        <div className="db-card" style={{ borderRadius: 16, padding: '24px 28px', border: '1px solid transparent', marginBottom: 24 }}>
          <h2 className="db-text-primary" style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={16} color="#c9a870" /> {t.profile_personal}
          </h2>
          <p className="db-text-secondary" style={{ fontSize: 12, margin: '0 0 20px' }}>
            {editing ? 'Update your personal details below.' : 'Your account information.'}
          </p>

          {editing ? (
            <form onSubmit={handleSaveProfile}>
              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>{t.profile_name}</label>
                  <input name="name" value={form.name} onChange={handleFormChange} required
                    className="db-form-input bg-white border-gray-200" style={{ boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>{t.profile_email}</label>
                  <input value={user?.email} disabled
                    className="db-form-input bg-gray-50" style={{ boxSizing: 'border-box', opacity: .6, cursor: 'not-allowed' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>{t.profile_phone}</label>
                  <input name="msisdn" value={form.msisdn} onChange={handleFormChange} placeholder="+250700000000"
                    className="db-form-input bg-white border-gray-200" style={{ boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>{t.profile_country}</label>
                  <select name="country" value={form.country} onChange={handleFormChange}
                    className="db-form-input bg-white border-gray-200" style={{ boxSizing: 'border-box' }}>
                    <option value="">— Select country —</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="submit" disabled={saving}
                  style={{ padding: '10px 22px', borderRadius: 9, background: 'linear-gradient(135deg,#c9a870,#d4af7a)', color: '#07111f', fontWeight: 700, fontSize: 14, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {saving ? t.profile_saving : <><CheckCircle size={14} /> {t.profile_save}</>}
                </button>
                <button type="button" onClick={() => { setEditing(false); setForm({ name: user?.name || '', msisdn: user?.msisdn || '', country: user?.country || '' }); }}
                  style={{ padding: '10px 18px', borderRadius: 9, background: 'none', border: '1px solid rgba(22,33,64,.15)', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}
                  className="db-text-secondary">
                  {t.profile_cancel}
                </button>
              </div>
            </form>
          ) : (
            <div>
              <Field label={t.profile_name}    value={user?.name}    icon={User}   />
              <Field label={t.profile_email}   value={user?.email}   icon={Mail}   />
              <Field label={t.profile_phone}   value={user?.msisdn}  icon={Phone}  />
              <Field label={t.profile_country} value={user?.country} icon={Globe}  />
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, paddingTop: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(201,168,112,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Shield size={16} color="#c9a870" />
                </div>
                <div>
                  <p style={{ fontSize: 11, color: 'var(--sub)', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600 }}>{t.profile_role}</p>
                  <p style={{ fontSize: 14, color: 'var(--text)', margin: 0, fontWeight: 500, textTransform: 'capitalize' }}>{ROLE_LABEL[user?.role] ?? user?.role}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Change password */}
        <div className="db-card" style={{ borderRadius: 16, padding: '24px 28px', border: '1px solid transparent' }}>
          <h2 className="db-text-primary" style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lock size={16} color="#c9a870" /> {t.profile_pw_title}
          </h2>

          {isGoogleUser ? (
            <p className="db-text-secondary" style={{ fontSize: 13, margin: '12px 0 0', padding: '12px 16px', borderRadius: 10, background: 'rgba(201,168,112,.06)', border: '1px solid rgba(201,168,112,.15)' }}>
              {t.profile_google_pw}
            </p>
          ) : (
            <form onSubmit={handleChangePassword} style={{ marginTop: 16 }}>
              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>{t.profile_current_pw}</label>
                  <input type="password" name="currentPassword" value={pwForm.currentPassword} onChange={handlePwChange} required autoComplete="current-password"
                    className="db-form-input bg-white border-gray-200" style={{ boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>{t.profile_new_pw}</label>
                  <input type="password" name="newPassword" value={pwForm.newPassword} onChange={handlePwChange} required minLength={8} autoComplete="new-password"
                    className="db-form-input bg-white border-gray-200" style={{ boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>{t.profile_confirm_pw}</label>
                  <input type="password" name="confirmPassword" value={pwForm.confirmPassword} onChange={handlePwChange} required minLength={8} autoComplete="new-password"
                    className="db-form-input bg-white border-gray-200" style={{ boxSizing: 'border-box' }} />
                </div>
              </div>
              <button type="submit" disabled={pwSaving}
                style={{ marginTop: 20, padding: '10px 22px', borderRadius: 9, background: 'linear-gradient(135deg,#c9a870,#d4af7a)', color: '#07111f', fontWeight: 700, fontSize: 14, border: 'none', cursor: pwSaving ? 'not-allowed' : 'pointer', opacity: pwSaving ? .7 : 1 }}>
                {pwSaving ? t.profile_updating_pw : t.profile_update_pw}
              </button>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
