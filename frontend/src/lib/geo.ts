import type { Place } from '../api/types';

export function haversineKm(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }): number {
  const r = 6371, rad = (d: number) => (d * Math.PI) / 180;
  const dLa = rad(b.latitude - a.latitude), dLo = rad(b.longitude - a.longitude);
  const h = Math.sin(dLa / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLo / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(h));
}

/** Straight-line distance along the ordered stops (planning aid only - not road distance). */
export function pathKm(places: Place[]): number {
  let total = 0;
  for (let i = 1; i < places.length; i++) total += haversineKm(places[i - 1], places[i]);
  return total;
}

const pad = (n: number) => String(n).padStart(2, '0');
export const fmtClock = (mins: number) => `${pad(Math.floor(mins / 60) % 24)}:${pad(mins % 60)}`;

/** Visit windows from `start` (HH:MM), only while every stop so far has an estimate. */
export function visitWindows(places: Place[], start = '09:00'): { start: string | null; end: string | null }[] {
  const [h, m] = start.split(':').map(Number);
  let clock = h * 60 + m;
  let known = true;
  return places.map((p) => {
    if (known && p.estimated_visit_minutes) {
      const s = clock;
      clock += p.estimated_visit_minutes;
      return { start: fmtClock(s), end: fmtClock(clock) };
    }
    known = false;
    return { start: null, end: null };
  });
}

export function filterPlaces(places: Place[], search: string, category: string): Place[] {
  const q = search.trim().toLowerCase();
  return places.filter(
    (p) =>
      (!category || p.category?.slug === category) &&
      (!q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)),
  );
}
