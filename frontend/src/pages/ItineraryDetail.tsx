import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ApiError, api } from '../api/client';
import type { Itinerary } from '../api/types';
import MapView from '../components/MapView';
import { ErrorState, Loading, NotFound } from '../components/States';
import { pathKm } from '../lib/geo';
import { useAsync } from '../lib/useAsync';

export default function ItineraryDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const note = (useLocation().state as { saved?: string } | null)?.saved;
  const q = useAsync(() => api.get<Itinerary>(`/itineraries/${id}`).then((r) => r.data), [id]);
  const [err, setErr] = useState<string | null>(null);

  if (q.loading) return <div className="wrap"><Loading /></div>;
  if (q.error?.status === 404) return <NotFound what="itinerary" />;
  if (q.error) return <div className="wrap"><ErrorState message={q.error.message} onRetry={q.reload} /></div>;
  const it = q.data!;
  const places = it.stops.map((s) => s.place);

  async function remove() {
    if (!window.confirm('Delete this itinerary?')) return;
    try { await api.del(`/itineraries/${it.id}`); nav('/itineraries'); }
    catch (e) { setErr(e instanceof ApiError ? e.message : 'Could not delete.'); }
  }

  return (
    <div className="wrap py-12">
      <p className="label"><Link to="/itineraries">← Saved itineraries</Link></p>
      {note && <p role="status" className="mt-4 border border-accent p-3 text-accent">{note}</p>}
      <h1 className="mt-4 text-5xl">{it.title}</h1>
      <p className="label mt-2">Start {it.start_time} · {places.length} stops · ~{pathKm(places).toFixed(1)} km straight-line</p>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <ol>
          {it.stops.map((s) => (
            <li key={s.position} className="grid grid-cols-[2rem_1fr_auto] border-t border-hair py-4">
              <span className="fig text-accent">{String(s.position).padStart(2, '0')}</span>
              <Link to={`/places/${s.place.id}`} className="font-display text-xl text-ink no-underline hover:text-accent">{s.place.name}</Link>
              <span className="fig">{s.suggested_start ? `${s.suggested_start}—${s.suggested_end}` : '—'}</span>
            </li>
          ))}
        </ol>
        <MapView places={places} route={places} onOpen={(pid) => nav(`/places/${pid}`)} height="400px" />
      </div>
      {err && <p role="alert" className="mt-4 text-accent">{err}</p>}
      <button className="btn-quiet btn mt-8" onClick={remove}>Delete itinerary</button>
    </div>
  );
}
