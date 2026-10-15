import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import type { Place } from '../api/types';
import MapView from '../components/MapView';
import { ErrorState, Loading } from '../components/States';
import { useAsync } from '../lib/useAsync';

export default function MapPage() {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const places = useAsync(() => api.get<Place[]>('/places').then((r) => r.data), []);
  const selected = Number(sp.get('place')) || null;

  return (
    <div className="wrap py-12">
      <p className="kicker">Map</p>
      <h1 className="mt-2 text-5xl">Every place, <em className="text-accent">where it is</em>.</h1>
      {places.loading && <Loading label="Loading places" />}
      {places.error && <ErrorState message={places.error.message} onRetry={places.reload} />}
      {places.data && (
        <div className="mt-8">
          <MapView places={places.data} selectedId={selected} height="min(70vh, 640px)" onOpen={(id) => nav(`/places/${id}`)} />
          <p className="label mt-2">{places.data.length} places · markers open a summary</p>
        </div>
      )}
    </div>
  );
}
