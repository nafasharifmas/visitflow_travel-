import { useMemo, useState } from 'react';
import { api } from '../api/client';
import type { Category, Place } from '../api/types';
import { Empty, ErrorState, Loading } from '../components/States';
import PlaceRow from '../components/PlaceRow';
import { filterPlaces } from '../lib/geo';
import { useAsync } from '../lib/useAsync';

export default function Explore() {
  const places = useAsync(() => api.get<Place[]>('/places').then((r) => r.data), []);
  const cats = useAsync(() => api.get<Category[]>('/categories').then((r) => r.data), []);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  // Client-side filtering of the full catalogue (NFR-002: <= 500 ms on the initial dataset).
  const shown = useMemo(() => filterPlaces(places.data ?? [], search, category), [places.data, search, category]);
  const filtered = search.trim() !== '' || category !== '';

  return (
    <div className="wrap py-12">
      <p className="kicker">Explore</p>
      <h1 className="mt-2 text-5xl md:text-6xl">Places worth <em className="text-accent">the day</em>.</h1>

      <div className="mt-10 grid gap-6 md:grid-cols-[1fr_auto]">
        <div>
          <label htmlFor="q" className="label">Search by name or keyword</label>
          <input id="q" type="search" className="input mt-1" placeholder="e.g. temple, beach, museum" value={search} onChange={(e) => setSearch(e.target.value)} maxLength={100} />
        </div>
        {filtered && <button className="btn-quiet btn self-end" onClick={() => { setSearch(''); setCategory(''); }}>Clear</button>}
      </div>

      <fieldset className="mt-6">
        <legend className="label mb-2">Category</legend>
        <div className="flex flex-wrap gap-2">
          <button className="btn" aria-pressed={category === ''} onClick={() => setCategory('')}>All</button>
          {(cats.data ?? []).map((c) => (
            <button key={c.id} className="btn" aria-pressed={category === c.slug} onClick={() => setCategory(c.slug)}>{c.name}</button>
          ))}
        </div>
      </fieldset>

      <p className="label mt-8" aria-live="polite">{places.data ? `${shown.length} of ${places.data.length} places` : ' '}</p>
      {places.loading && <Loading label="Loading places" />}
      {places.error && <ErrorState message={places.error.message} onRetry={places.reload} />}
      {places.data && places.data.length === 0 && <Empty title="No places have been added yet." />}
      {places.data && places.data.length > 0 && shown.length === 0 && (
        <Empty title="No places match your search.">Try a different keyword or clear the filters.</Empty>
      )}
      <ul className="mt-2">{shown.map((p) => <PlaceRow key={p.id} place={p} />)}</ul>
    </div>
  );
}
