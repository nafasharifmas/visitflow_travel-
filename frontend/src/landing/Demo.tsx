import { useState } from 'react';

type Mode = 'DISCOVER' | 'MAP' | 'PLAN';
const MODES: Mode[] = ['DISCOVER', 'MAP', 'PLAN'];
const FACTS: Record<Mode, [string, string][]> = {
  DISCOVER: [['MODE', 'CATALOGUE'], ['PLACES', '10+'], ['FILTER', 'CATEGORY']],
  MAP: [['MODE', 'MAP'], ['STOPS', '04'], ['TILES', 'OSM']],
  PLAN: [['MODE', 'ITINERARY'], ['STOPS', '04'], ['WINDOW', '09:00—17:30']],
};

const pts: [number, number][] = [[70, 230], [190, 110], [320, 190], [440, 80]];

function Drawing({ mode }: { mode: Mode }) {
  return (
    <svg viewBox="0 0 520 300" className="h-auto w-full" role="img" aria-label={`Illustration: ${mode.toLowerCase()} view`}>
      {mode === 'DISCOVER' && [0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(30 ${20 + i * 66})`}>
          <rect width="90" height="52" fill="none" stroke="#141C2B" strokeOpacity=".5" />
          <line x1="110" y1="14" x2="330" y2="14" stroke="#141C2B" strokeOpacity=".7" />
          <line x1="110" y1="30" x2="260" y2="30" stroke="#141C2B" strokeOpacity=".3" />
          <line x1="110" y1="44" x2="300" y2="44" stroke="#141C2B" strokeOpacity=".3" />
          <text x="440" y="18" fontSize="11" fill="#2C4A8F" fontFamily="Courier Prime">{(i + 1) * 3.4} KM</text>
        </g>
      ))}
      {mode !== 'DISCOVER' && (
        <>
          {[1, 2, 3, 4].map((i) => <ellipse key={i} cx="260" cy="150" rx={i * 55} ry={i * 32} fill="none" stroke="#141C2B" strokeOpacity=".15" />)}
          <path d={`M${pts.map((p) => p.join(' ')).join(' L')}`} fill="none" stroke="#2C4A8F" strokeWidth="2.5" strokeDasharray="8 6" />
          {pts.map(([x, y], i) => <rect key={i} x={x - 7} y={y - 7} width="14" height="14" fill="#EFE9DD" stroke="#2C4A8F" strokeWidth="2" />)}
        </>
      )}
      {mode === 'PLAN' && pts.map(([x, y], i) => (
        <text key={i} x={x + 12} y={y - 10} fontSize="11" fill="#141C2B" fontFamily="Courier Prime">{['09:00', '11:00', '13:30', '15:30'][i]}</text>
      ))}
    </svg>
  );
}

export default function Demo() {
  const [mode, setMode] = useState<Mode>('DISCOVER');
  return (
    <div>
      <div className="flex gap-2" role="group" aria-label="Demonstration view">
        {MODES.map((m) => <button key={m} className="btn" aria-pressed={mode === m} onClick={() => setMode(m)}>{m}</button>)}
      </div>
      <div className="mt-6 border border-hair bg-ground/60 p-4 md:p-8"><Drawing mode={mode} /></div>
      <dl className="mt-0 grid grid-cols-3 border border-t-0 border-hair" aria-live="polite">
        {FACTS[mode].map(([k, v]) => (
          <div key={k} className="border-r border-hair p-4 last:border-r-0">
            <dt className="label">{k}</dt><dd className="fig mt-1">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
