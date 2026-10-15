import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ApiError, api } from '../../api/client';
import type { Category, Place } from '../../api/types';
import { ErrorState, FieldError, Loading } from '../../components/States';
import { useAsync } from '../../lib/useAsync';

const blank = { category_id: '', name: '', description: '', opening_hours: '', distance_km: '', latitude: '', longitude: '', image_url: '', estimated_visit_minutes: '', is_verified: false };
type Form = typeof blank;

export default function AdminPlaceForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [f, setF] = useState<Form>(blank);
  const [err, setErr] = useState<ApiError | null>(null);
  const [busy, setBusy] = useState(false);
  const cats = useAsync(() => api.get<Category[]>('/categories').then((r) => r.data), []);
  const existing = useAsync(async () => (id ? (await api.get<Place>(`/admin/places/${id}`)).data : null), [id]);

  useEffect(() => {
    const p = existing.data;
    if (p) setF({ category_id: String(p.category?.id ?? ''), name: p.name, description: p.description, opening_hours: p.opening_hours, distance_km: String(p.distance_km), latitude: String(p.latitude), longitude: String(p.longitude), image_url: p.image_url ?? '', estimated_visit_minutes: p.estimated_visit_minutes ? String(p.estimated_visit_minutes) : '', is_verified: p.is_verified });
  }, [existing.data]);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF({ ...f, [k]: e.target instanceof HTMLInputElement && e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setErr(null);
    const body = {
      ...f, category_id: Number(f.category_id), distance_km: Number(f.distance_km), latitude: Number(f.latitude), longitude: Number(f.longitude),
      image_url: f.image_url.trim() || null, estimated_visit_minutes: f.estimated_visit_minutes ? Number(f.estimated_visit_minutes) : null,
    };
    try { await (id ? api.put(`/admin/places/${id}`, body) : api.post('/admin/places', body)); nav('/admin/places'); }
    catch (x) { setErr(x instanceof ApiError ? x : new ApiError(0, 'Unexpected error.')); }
    finally { setBusy(false); }
  }

  if (id && existing.loading) return <Loading />;
  if (existing.error) return <ErrorState message={existing.error.status === 404 ? 'Place not found.' : existing.error.message} />;

  const E = err?.errors;
  const input = (k: keyof Form, label: string, type = 'text') => (
    <div>
      <label htmlFor={k} className="label">{label}</label>
      <input id={k} type={type} step="any" className="input mt-1" value={String(f[k])} onChange={set(k)} />
      <FieldError errors={E} name={k} />
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="max-w-3xl">
      <h1 className="text-4xl">{id ? 'Edit place' : 'New place'}</h1>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {input('name', 'Name')}
        <div>
          <label htmlFor="category_id" className="label">Category</label>
          <select id="category_id" className="input mt-1" value={f.category_id} onChange={set('category_id')}>
            <option value="">Select…</option>
            {cats.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <FieldError errors={E} name="category_id" />
        </div>
        {input('distance_km', 'Distance from reference point (km)', 'number')}
        {input('opening_hours', 'Opening hours')}
        {input('latitude', 'Latitude', 'number')}
        {input('longitude', 'Longitude', 'number')}
        {input('estimated_visit_minutes', 'Typical visit (minutes, optional)', 'number')}
        {input('image_url', 'Image URL (optional)', 'url')}
      </div>
      <div className="mt-5">
        <label htmlFor="description" className="label">Description</label>
        <textarea id="description" rows={4} className="input mt-1 py-2" value={f.description} onChange={set('description')} />
        <FieldError errors={E} name="description" />
      </div>
      <label className="mt-5 flex items-center gap-3"><input type="checkbox" checked={f.is_verified} onChange={set('is_verified')} className="h-5 w-5" /> <span className="label">Details verified by an administrator</span></label>
      {err && !err.errors && <p role="alert" className="mt-4 text-accent">{err.message}</p>}
      <div className="mt-8 flex gap-3">
        <button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Save place'}</button>
        <Link to="/admin/places" className="btn-quiet btn no-underline">Cancel</Link>
      </div>
    </form>
  );
}
