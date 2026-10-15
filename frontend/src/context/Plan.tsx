import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

const KEY = 'vf_guest_plan'; // sessionStorage only: temporary, never sent to the server unless a signed-in user saves (BR-009)

interface PlanState {
  ids: number[];
  add: (id: number) => void;
  remove: (id: number) => void;
  move: (id: number, dir: -1 | 1) => void;
  clear: () => void;
  has: (id: number) => boolean;
}
const Ctx = createContext<PlanState | null>(null);

const load = (): number[] => {
  try { const v = JSON.parse(sessionStorage.getItem(KEY) ?? '[]'); return Array.isArray(v) ? v.filter(Number.isInteger) : []; } catch { return []; }
};

export function PlanProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<number[]>(load);
  const commit = useCallback((next: number[]) => {
    setIds(next);
    try { sessionStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage unavailable: plan stays in memory */ }
  }, []);

  const value = useMemo<PlanState>(() => ({
    ids,
    add: (id) => { if (!ids.includes(id) && ids.length < 20) commit([...ids, id]); },
    remove: (id) => commit(ids.filter((x) => x !== id)),
    move: (id, dir) => {
      const i = ids.indexOf(id), j = i + dir;
      if (i < 0 || j < 0 || j >= ids.length) return;
      const n = [...ids];
      [n[i], n[j]] = [n[j], n[i]];
      commit(n);
    },
    clear: () => commit([]),
    has: (id) => ids.includes(id),
  }), [ids, commit]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePlan(): PlanState {
  const v = useContext(Ctx);
  if (!v) throw new Error('usePlan must be used inside PlanProvider');
  return v;
}
