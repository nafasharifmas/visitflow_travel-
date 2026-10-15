import { Link } from 'react-router-dom';
import type { Place } from '../api/types';
import { usePlan } from '../context/Plan';
import PlaceImage from './PlaceImage';

export default function PlaceRow({ place }: { place: Place }) {
  const plan = usePlan();
  const inPlan = plan.has(place.id);
  return (
    <li className="grid gap-5 border-t border-hair py-6 sm:grid-cols-[200px_1fr_auto]">
      <PlaceImage src={place.image_url} alt={place.name} className="h-[130px] w-full sm:w-[200px]" />
      <div>
        <p className="kicker">{place.category?.name ?? 'Uncategorised'}</p>
        <h2 className="mt-1 text-3xl"><Link to={`/places/${place.id}`} className="text-ink no-underline hover:text-accent">{place.name}</Link></h2>
        <p className="mt-2 max-w-prose text-ink2">{place.description}</p>
        {!place.is_verified && <p className="label mt-2 text-muted">Unverified demo data</p>}
      </div>
      <dl className="grid content-start gap-1 sm:text-right">
        <div><dt className="label inline">Distance </dt><dd className="fig inline">{place.distance_km} km</dd></div>
        <div><dt className="label inline">Hours </dt><dd className="inline">{place.opening_hours}</dd></div>
        <button className="btn mt-3" aria-pressed={inPlan} onClick={() => (inPlan ? plan.remove(place.id) : plan.add(place.id))}>
          {inPlan ? 'In plan ✓' : 'Add to plan'}
        </button>
      </dl>
    </li>
  );
}
