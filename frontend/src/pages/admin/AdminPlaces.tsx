import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiError, api } from '../../api/client';
import type { Place } from '../../api/types';
import { Empty, ErrorState, Loading } from '../../components/States';
import { useAsync } from '../../lib/useAsync';

export default function AdminPlaces() {
  const q = useAsync(() => api.get<Place[]>('/admin/places').then((r) => r.data), []);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function remove(p: Place) {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try { const r = await api.del(`/admin/places/${p.id}`); setMsg({ ok: true, text: r.message ?? 'Deleted.' }); q.reload(); }
    catch (e) { setMsg({ ok: false, text: e instanceof ApiError ? e.message : 'Delete failed.' }); }
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-4xl">Places</h1>
        <Link className="btn no-underline" to="/admin/places/create">New place</Link>
      </div>
      {msg && <p role={msg.ok ? 'status' : 'alert'} className="mt-4 border border-hair p-3">{msg.text}</p>}
      {q.loading && <Loading />}
      {q.error && <ErrorState message={q.error.message} onRetry={q.reload} />}
      {q.data?.length === 0 && <Empty title="No places yet." />}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead><tr className="label"><th className="py-2 pr-4">Name</th><th>Category</th><th>Distance</th><th>Verified</th><th className="text-right">Actions</th></tr></thead>
          <tbody>
            {q.data?.map((p) => (
              <tr key={p.id} className="border-t border-hair">
                <td className="py-3 pr-4">{p.name}</td>
                <td>{p.category?.name}</td>
                <td className="fig">{p.distance_km} km</td>
                <td>{p.is_verified ? 'Yes' : 'No'}</td>
                <td className="space-x-4 text-right">
                  <Link to={`/places/${p.id}`}>View</Link>
                  <Link to={`/admin/places/${p.id}/edit`}>Edit</Link>
                  <button className="text-accent underline underline-offset-4" onClick={() => remove(p)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
