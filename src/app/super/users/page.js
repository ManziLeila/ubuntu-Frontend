'use client';
import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { api } from '../../../lib/api';
import Badge from '../../../components/ui/Badge';
import Pagination from '../../../components/ui/Pagination';
import Spinner from '../../../components/ui/Spinner';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';

const ROLES = ['All', 'client', 'agent', 'admin'];
const ROLE_BADGE = { client: 'info', agent: 'default', admin: 'warning' };
const ROLE_OPTIONS = ['client', 'agent', 'admin'];

export default function SuperUsersPage() {
  const [users, setUsers]   = useState([]);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [role, setRole]     = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState(null);
  // { userId, type:'status'|'role', currentStatus?, newStatus?, currentRole?, newRole? }

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (role !== 'All') params.set('role', role);
      if (search) params.set('search', search);
      const r = await api.get(`/api/v1/super/users?${params}`);
      const d = r.data.data ?? r.data;
      setUsers(Array.isArray(d) ? d : d.users ?? []);
      setTotal(d.total ?? 0);
    } catch { setUsers([]); } finally { setLoading(false); }
  }, [page, role, search]);

  useEffect(() => { load(); }, [load]);

  const doAction = async () => {
    if (!confirmAction) return;
    try {
      if (confirmAction.type === 'status') {
        const newStatus = confirmAction.currentStatus === 'suspended' ? 'active' : 'suspended';
        await api.put(`/api/v1/super/users/${confirmAction.userId}/status`, { status: newStatus });
        toast.success(`User ${newStatus}.`);
      } else if (confirmAction.type === 'role') {
        await api.put(`/api/v1/super/users/${confirmAction.userId}/role`, { role: confirmAction.newRole });
        toast.success(`Role changed to ${confirmAction.newRole}.`);
      }
      setConfirmAction(null);
      load();
    } catch (err) { toast.error(err?.response?.data?.message ?? 'Failed.'); }
  };

  const confirmTitle = () => {
    if (!confirmAction) return '';
    if (confirmAction.type === 'role') return `Change role to "${confirmAction.newRole}"?`;
    return confirmAction.currentStatus === 'suspended' ? 'Unsuspend user?' : 'Suspend user?';
  };

  const confirmMessage = () => {
    if (!confirmAction) return '';
    if (confirmAction.type === 'role') {
      return `This will change the user's role from "${confirmAction.currentRole}" to "${confirmAction.newRole}". The change takes effect immediately.`;
    }
    return confirmAction.currentStatus === 'suspended'
      ? "This will restore the user's access."
      : 'The user will be unable to log in or perform any actions.';
  };

  const confirmVariant = () => {
    if (!confirmAction) return 'default';
    if (confirmAction.type === 'role') return 'default';
    return confirmAction.currentStatus === 'suspended' ? 'default' : 'danger';
  };

  const confirmLabel = () => {
    if (!confirmAction) return 'Confirm';
    if (confirmAction.type === 'role') return 'Change Role';
    return confirmAction.currentStatus === 'suspended' ? 'Unsuspend' : 'Suspend';
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
      <div className="flex flex-col sm:flex-row gap-3">
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Name, email…"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        <select value={role} onChange={e => { setRole(e.target.value); setPage(1); }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          {ROLES.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><Spinner size="lg" /></div> : users.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-400">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Name', 'Email', 'Role', 'Status', 'Country', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3"><Badge variant={ROLE_BADGE[u.role] ?? 'default'} size="sm">{u.role}</Badge></td>
                    <td className="px-4 py-3"><Badge variant={u.status === 'suspended' ? 'danger' : u.status === 'pending' ? 'warning' : 'success'} size="sm">{u.status ?? 'active'}</Badge></td>
                    <td className="px-4 py-3 text-gray-500">{u.country}</td>
                    <td className="px-4 py-3 text-gray-400">{format(new Date(u.createdAt), 'dd MMM yy')}</td>
                    <td className="px-4 py-3">
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Suspend / Unsuspend */}
                        <button
                          onClick={() => setConfirmAction({ userId: u.id, type: 'status', currentStatus: u.status ?? 'active' })}
                          className={`text-xs font-medium px-2.5 py-1 rounded-lg transition ${u.status === 'suspended' ? 'bg-green-100 hover:bg-green-200 text-green-700' : 'bg-red-100 hover:bg-red-200 text-red-700'}`}>
                          {u.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                        </button>

                        {/* Role change select */}
                        <select
                          value={u.role}
                          onChange={e => {
                            const newRole = e.target.value;
                            if (newRole !== u.role) {
                              setConfirmAction({ userId: u.id, type: 'role', currentRole: u.role, newRole });
                            }
                          }}
                          className="border border-gray-200 rounded-md bg-white text-gray-600"
                          style={{ fontSize: 11, padding: '4px 6px', cursor: 'pointer' }}
                        >
                          {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {total > 15 && <div className="flex justify-center"><Pagination page={page} totalPages={Math.ceil(total / 15)} onPageChange={setPage} /></div>}

      <ConfirmDialog
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={doAction}
        title={confirmTitle()}
        message={confirmMessage()}
        variant={confirmVariant()}
        confirmLabel={confirmLabel()}
      />
    </div>
  );
}
