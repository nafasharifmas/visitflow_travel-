import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import type { Place } from '../api/types';

interface Props {
  places: Place[];
  route?: Place[];
  selectedId?: number | null;
  onOpen?: (id: number) => void;
  height?: string;
}

const valid = (p: Place) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude) && Math.abs(p.latitude) <= 90 && Math.abs(p.longitude) <= 180;

export default function MapView({ places, route = [], selectedId, onOpen, height = '520px' }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const [tileError, setTileError] = useState(false);

  useEffect(() => {
    if (!el.current || map.current) return;
    const m = L.map(el.current, { zoomControl: true }).setView([6.9, 79.86], 11);
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });
    let errs = 0;
    tiles.on('tileerror', () => { if (++errs > 3) setTileError(true); });
    tiles.on('tileload', () => { errs = 0; setTileError(false); });
    tiles.addTo(m);
    layer.current = L.layerGroup().addTo(m);
    map.current = m;
    return () => { m.remove(); map.current = null; layer.current = null; };
  }, []);

  useEffect(() => {
    const m = map.current, g = layer.current;
    if (!m || !g) return;
    g.clearLayers();
    const pts: L.LatLngTuple[] = [];
    places.filter(valid).forEach((p) => {
      const icon = L.divIcon({ className: '', html: `<div class="vf-pin ${p.id === selectedId ? 'active' : ''}"></div>`, iconSize: [14, 14], iconAnchor: [7, 7] });
      const marker = L.marker([p.latitude, p.longitude], { icon, title: p.name, alt: p.name });
      // Popup built with DOM nodes + textContent: user data is never interpreted as HTML.
      const box = document.createElement('div');
      const title = document.createElement('strong'); title.textContent = p.name;
      const meta = document.createElement('div'); meta.textContent = `${p.category?.name ?? ''} · ${p.distance_km} km`;
      const hours = document.createElement('div'); hours.textContent = p.opening_hours;
      const btn = document.createElement('button'); btn.className = 'btn'; btn.style.minHeight = '32px'; btn.style.marginTop = '8px'; btn.textContent = 'View details';
      btn.onclick = () => onOpen?.(p.id);
      box.append(title, meta, hours, btn);
      marker.bindPopup(box).addTo(g);
      if (p.id === selectedId) marker.openPopup();
      pts.push([p.latitude, p.longitude]);
    });
    const r = route.filter(valid).map((p) => [p.latitude, p.longitude] as L.LatLngTuple);
    if (r.length > 1) L.polyline(r, { color: '#2C4A8F', weight: 3, dashArray: '8 6' }).addTo(g);
    const fit = r.length > 1 ? r : pts;
    if (fit.length > 1) m.fitBounds(L.latLngBounds(fit), { padding: [40, 40] });
    else if (fit.length === 1) m.setView(fit[0], 14);
  }, [places, route, selectedId, onOpen]);

  return (
    <div>
      <div ref={el} style={{ height }} className="w-full border border-hair" role="application" aria-label="Interactive map of places" />
      {tileError && (
        <p role="alert" className="mt-2 border border-hair p-3 text-[12px]">
          Map tiles are unavailable right now. Place information on this page is unaffected.
        </p>
      )}
    </div>
  );
}
