import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError, api } from '../api/client';
import type { Itinerary, Place } from '../api/types';
import MapView from '../components/MapView';
import { Empty, ErrorState, FieldError, Loading } from '../components/States';
import { useAuth } from '../context/Auth';
import { usePlan } from '../context/Plan';
import { pathKm, visitWindows } from '../lib/geo';
import { useAsync } from '../lib/useAsync';

export default function Planner() {
  const plan = usePlan();
  const { user } = useAuth();
  const nav = useNavigate();
  const places = useAsync(() => api.get<Place[]>('/places').then((r) => r.data), []);
  const [title, setTitle] = useState('My day');
  const [start, setStart] = useState('09:00');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<ApiError | null>(null);

  const stops = useMemo(() => plan.ids.map((id) => places.data?.find((p) => p.id === id)).filter((p): p is Place => !!p), [plan.ids, places.data]);
  const windows = useMemo(() => visitWindows(stops, start), [stops, start]);
  const available = (places.data ?? []).filter((p) => !plan.has(p.id));

  async function save() {
    setSaving(true); setErr(null);
    try {
      const r = await api.post<Itinerary>('/itineraries', { title, start_time: start, place_ids: stops.map((s) => s.id) });
      plan.clear();
      nav(`/itineraries/${r.data.id}`, { state: { saved: r.message } });
    } catch (e) {
      setErr(e instanceof ApiError ? e : new ApiError(0, 'Your itinerary was NOT saved.')); // never a false success
    } finally { setSaving(false); }
  }

  return (
    <div className="wrap py-12">
      <p className="kicker">Planner · one day</p>
      <h1 className="mt-2 text-5xl md:text-6xl">Build a day <em className="text-accent">with intention</em>.</h1>
      {places.loading && <Loading label="Loading places" />}
      {places.error && <ErrorState message={places.error.message} onRetry={places.reload} />}

      {places.data && (
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <section aria-labelledby="stops-h">
            <h2 id="stops-h" className="text-3xl">Your stops</h2>
            {stops.length === 0 ? (
              <Empty title="Your plan is empty.">Add places below or from <Link to="/explore">Explore</Link>.</Empty>
            ) : (
              <ol className="mt-4">
                {stops.map((p, i) => (
                  <li key={p.id} className="grid grid-cols-[2rem_1fr_auto] items-start gap-3 border-t border-hair py-4">
                    <span className="fig text-accent">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <Link to={`/places/${p.id}`} className="font-display text-xl text-ink no-underline hover:text-accent">{p.name}</Link>
                      <p className="label mt-1">
                        {windows[i].start ? `${windows[i].start}—${windows[i].end}` : 'Visit window: no time estimate configured'}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button className="btn-quiet btn min-h-[44px] w-[44px] px-0" aria-label={`Move ${p.name} up`} disabled={i === 0} onClick={() => plan.move(p.id, -1)}>↑</button>
                      <button className="btn-quiet btn min-h-[44px] w-[44px] px-0" aria-label={`Move ${p.name} down`} disabled={i === stops.length - 1} onClick={() => plan.move(p.id, 1)}>↓</button>
                      <button className="btn-quiet btn min-h-[44px] w-[44px] px-0" aria-label={`Remove ${p.name}`} onClick={() => plan.remove(p.id)}>×</button>
                    </div>
                  </li>
                ))}
              </ol>
            )}

            {stops.length > 1 && (
              <p className="mt-4 border-t border-hair pt-4 text-ink2">
                Suggested path in the order shown: about <span className="fig">{pathKm(stops).toFixed(1)} km</span> in straight lines.
                {' '}This is planning guidance only — not real-time road, transport, weather or safety information.
              </p>
            )}

            <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto]">
              <div>
                <label htmlFor="title" className="label">Itinerary title</label>
                <input id="title" className="input mt-1" value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} />
                <FieldError errors={err?.errors} name="title" />
              </div>
              <div>
                <label htmlFor="start" className="label">Start time</label>
                <input id="start" type="time" className="input mt-1" value={start} onChange={(e) => setStart(e.target.value)} />
              </div>
            </div>

            {err && <p role="alert" className="mt-4 border border-hair p-3">{err.message} {err.errors?.place_ids?.[0]}</p>}
            <div className="mt-6 flex flex-wrap gap-3">
              {user ? (
                <button className="btn" disabled={stops.length === 0 || saving || title.trim() === ''} onClick={save}>{saving ? 'Saving…' : 'Save itinerary'}</button>
              ) : (
                <Link className="btn no-underline" to="/login" state={{ from: '/planner' }}>Sign in to save</Link>
              )}
              {stops.length > 0 && <button className="btn-quiet btn" onClick={plan.clear}>Clear plan</button>}
            </div>
            {!user && <p className="label mt-3">Guest plans are temporary and are never stored on an account.</p>}
          </section>

          <section aria-labelledby="map-h">
            <h2 id="map-h" className="sr-only">Route map</h2>
            <MapView places={stops.length ? stops : places.data} route={stops} onOpen={(id) => nav(`/places/${id}`)} height="460px" />
            <h3 className="mt-8 text-2xl">Add a place</h3>
            <ul className="mt-2 max-h-[320px] overflow-y-auto">
              {available.length === 0 && <li className="py-3 text-ink2">Every place is already in your plan.</li>}
              {available.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 border-t border-hair py-2">
                  <span>{p.name} <span className="label">{p.distance_km} km</span></span>
                  <button className="btn-quiet btn" onClick={() => plan.add(p.id)} aria-label={`Add ${p.name} to plan`}>Add</button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
