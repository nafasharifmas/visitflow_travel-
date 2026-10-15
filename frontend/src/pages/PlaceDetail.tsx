import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import type { Place } from '../api/types';
import MapView from '../components/MapView';
import PlaceImage from '../components/PlaceImage';
import { ErrorState, Loading, NotFound } from '../components/States';
import { usePlan } from '../context/Plan';
import { useAsync } from '../lib/useAsync';

export default function PlaceDetail() {
  const { id } = useParams();
  const plan = usePlan();
  const nav = useNavigate();
  const q = useAsync(() => api.get<Place>(`/places/${id}`).then((r) => r.data), [id]);

  if (q.loading) return <div className="wrap"><Loading label="Loading place" /></div>;
  if (q.error?.status === 404) return <NotFound what="place" />;
  if (q.error) return <div className="wrap"><ErrorState message={q.error.message} onRetry={q.reload} /></div>;
  const p = q.data!;
  const inPlan = plan.has(p.id);

  return (
    <article className="wrap py-12">
      <p className="label"><Link to="/explore">← All places</Link></p>
      <p className="kicker mt-6">{p.category?.name}</p>
      <h1 className="mt-1 text-5xl md:text-7xl">{p.name}</h1>
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <PlaceImage src={p.image_url} alt={p.name} className="h-[320px] w-full" />
        <div>
          <p className="max-w-prose">{p.description}</p>
          <dl className="mt-6">
            <div className="row"><dt className="label">Distance from reference point</dt><dd className="fig">{p.distance_km} km</dd></div>
            <div className="row"><dt className="label">Opening hours</dt><dd>{p.opening_hours}</dd></div>
            {p.estimated_visit_minutes && <div className="row"><dt className="label">Typical visit</dt><dd className="fig">{p.estimated_visit_minutes} min</dd></div>}
            <div className="row"><dt className="label">Coordinates</dt><dd className="fig">{p.latitude.toFixed(4)}, {p.longitude.toFixed(4)}</dd></div>
          </dl>
          {!p.is_verified && <p className="label mt-3">Unverified demo data — confirm hours before travelling.</p>}
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn" aria-pressed={inPlan} onClick={() => (inPlan ? plan.remove(p.id) : plan.add(p.id))}>{inPlan ? 'In plan ✓' : 'Add to plan'}</button>
            <Link className="btn-quiet btn no-underline" to="/planner">Open planner</Link>
          </div>
        </div>
      </div>
      <div className="mt-12"><MapView places={[p]} selectedId={p.id} height="340px" onOpen={() => nav(`/places/${p.id}`)} /></div>
    </article>
  );
}
