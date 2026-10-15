import { describe, expect, it } from 'vitest';
import type { Place } from '../api/types';
import { filterPlaces, haversineKm, pathKm, visitWindows } from '../lib/geo';

const mk = (id: number, name: string, slug: string, mins: number | null, lat = 6.9, lng = 79.85): Place => ({
  id, name, slug: name.toLowerCase(), category: { id: 1, name: slug, slug }, description: `About ${name}`, image_url: null,
  opening_hours: '9-5', distance_km: 1, latitude: lat, longitude: lng, estimated_visit_minutes: mins, is_verified: false,
});

describe('geo helpers', () => {
  it('computes haversine distance', () => {
    expect(haversineKm({ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 1 })).toBeCloseTo(111.19, 1);
  });
  it('sums the path across stops', () => {
    expect(pathKm([mk(1, 'A', 'x', 10, 0, 0), mk(2, 'B', 'x', 10, 0, 1), mk(3, 'C', 'x', 10, 0, 2)])).toBeCloseTo(222.4, 0);
  });
  it('builds visit windows and stops when an estimate is missing', () => {
    const w = visitWindows([mk(1, 'A', 'x', 60), mk(2, 'B', 'x', null), mk(3, 'C', 'x', 30)], '09:00');
    expect(w[0]).toEqual({ start: '09:00', end: '10:00' });
    expect(w[1]).toEqual({ start: null, end: null });
    expect(w[2]).toEqual({ start: null, end: null });
  });
  it('filters by keyword and category', () => {
    const list = [mk(1, 'Museum', 'museums', 30), mk(2, 'Park', 'parks', 30)];
    expect(filterPlaces(list, 'mus', '')).toHaveLength(1);
    expect(filterPlaces(list, '', 'parks')[0].name).toBe('Park');
    expect(filterPlaces(list, 'zzz', '')).toHaveLength(0);
  });
});
