import { Link } from 'react-router-dom';
import { api } from '../api/client';
import type { Itinerary } from '../api/types';
import { Empty, ErrorState, Loading } from '../components/States';
import { useAsync } from '../lib/useAsync';

export default function Itineraries() {
  const q = useAsync(() => api.get<Itinerary[]>('/itineraries').then((r) => r.data), []);
  return (
    <div className="wrap py-12">
      <p className="kicker">Profile</p>
      <h1 className="mt-2 text-5xl">Saved <em className="text-accent">itineraries</em></h1>
      {q.loading && <Loading />}
      {q.error && <ErrorState message={q.error.message} onRetry={q.reload} />}
      {q.data?.length === 0 && <Empty title="No saved itineraries yet.">Build one in the <Link to="/planner">planner</Link>.</Empty>}
      <ul className="mt-8">
        {q.data?.map((it) => (
          <li key={it.id} className="row">
            <div>
              <Link to={`/itineraries/${it.id}`} className="font-display text-2xl text-ink no-underline hover:text-accent">{it.title}</Link>
              <p className="label mt-1">{it.stops.map((s) => s.place.name).join(' → ')}</p>
            </div>
            <span className="fig">{it.stops.length} stops</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
