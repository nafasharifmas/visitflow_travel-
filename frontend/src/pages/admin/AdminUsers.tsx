import { useState } from 'react';
import { ApiError, api } from '../../api/client';
import type { User } from '../../api/types';
import { ErrorState, Loading } from '../../components/States';
import { useAuth } from '../../context/Auth';
import { useAsync } from '../../lib/useAsync';

export default function AdminUsers() {
  const { user: me } = useAuth();
  const q = useAsync(() => api.get<User[]>('/admin/users').then((r) => r.data), []);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function act(fn: () => Promise<{ message?: string }>) {
    try { const r = await fn(); setMsg({ ok: true, text: r.message ?? 'Done.' }); q.reload(); }
    catch (e) { setMsg({ ok: false, text: e instanceof ApiError ? e.message : 'Action failed.' }); }
  }

  return (
    <div>
      <h1 className="text-4xl">Users</h1>
      <p className="label mt-2">Actions: change role, delete. Passwords are never shown.</p>
      {msg && <p role={msg.ok ? 'status' : 'alert'} className="mt-4 border border-hair p-3">{msg.text}</p>}
      {q.loading && <Loading />}
      {q.error && <ErrorState message={q.error.message} onRetry={q.reload} />}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead><tr className="label"><th className="py-2">Username</th><th>Name</th><th>Email</th><th>Role</th><th className="text-right">Actions</th></tr></thead>
          <tbody>
            {q.data?.map((u) => (
              <tr key={u.id} className="border-t border-hair">
                <td className="py-3">{u.username}</td><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td>
                <td className="space-x-4 text-right">
                  {u.id !== me?.id && (
                    <>
                      <button className="text-accent underline underline-offset-4" onClick={() => act(() => api.put<User>(`/admin/users/${u.id}`, { role: u.role === 'admin' ? 'user' : 'admin' }))}>
                        Make {u.role === 'admin' ? 'user' : 'admin'}
                      </button>
                      <button className="text-accent underline underline-offset-4" onClick={() => window.confirm(`Delete ${u.username}?`) && act(() => api.del(`/admin/users/${u.id}`))}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
