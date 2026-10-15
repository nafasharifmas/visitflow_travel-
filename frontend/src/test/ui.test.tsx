import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RequireAuth } from '../components/Guard';
import { AuthProvider } from '../context/Auth';
import { PlanProvider } from '../context/Plan';
import Demo from '../landing/Demo';
import Explore from '../pages/Explore';

const places = [
  { id: 1, name: 'Old Museum', slug: 'old-museum', category: { id: 1, name: 'Museums', slug: 'museums' }, description: 'History', image_url: null, opening_hours: '9-5', distance_km: 2, latitude: 6.9, longitude: 79.8, estimated_visit_minutes: 60, is_verified: false },
  { id: 2, name: 'Green Park', slug: 'green-park', category: { id: 2, name: 'Parks', slug: 'parks' }, description: 'Trees', image_url: null, opening_hours: '9-5', distance_km: 3, latitude: 6.9, longitude: 79.8, estimated_visit_minutes: 30, is_verified: false },
];
const cats = [{ id: 1, name: 'Museums', slug: 'museums' }, { id: 2, name: 'Parks', slug: 'parks' }];

function mockFetch(handler: (url: string) => { ok: boolean; status?: number; body: unknown } | 'network') {
  vi.stubGlobal('fetch', vi.fn(async (url: string) => {
    const r = handler(String(url));
    if (r === 'network') throw new TypeError('offline');
    return { ok: r.ok, status: r.status ?? 200, json: async () => r.body } as Response;
  }));
}
const wrap = (ui: React.ReactElement) => render(<MemoryRouter><AuthProvider><PlanProvider>{ui}</PlanProvider></AuthProvider></MemoryRouter>);

afterEach(() => { vi.unstubAllGlobals(); localStorage.clear(); sessionStorage.clear(); });

describe('Explore', () => {
  it('lists, searches, filters and shows the empty state', async () => {
    mockFetch((u) => ({ ok: true, body: { data: u.endsWith('/categories') ? cats : places } }));
    wrap(<Explore />);
    expect(await screen.findByText('Old Museum')).toBeInTheDocument();
    expect(screen.getByText('Green Park')).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/search by name/i), 'museum');
    expect(screen.queryByText('Green Park')).not.toBeInTheDocument();

    await userEvent.clear(screen.getByLabelText(/search by name/i));
    await userEvent.click(screen.getByRole('button', { name: 'Parks' }));
    expect(screen.getByRole('button', { name: 'Parks' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByText('Old Museum')).not.toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/search by name/i), 'zzzz');
    expect(screen.getByText(/no places match/i)).toBeInTheDocument();
  });

  it('shows a controlled error state when the API is unreachable', async () => {
    mockFetch(() => 'network');
    wrap(<Explore />);
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not be reached/i);
  });
});

describe('Demo variant picker', () => {
  it('toggles aria-pressed and updates the facts', async () => {
    render(<Demo />);
    const plan = screen.getByRole('button', { name: 'PLAN' });
    expect(screen.getByRole('button', { name: 'DISCOVER' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(plan);
    expect(plan).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('09:00—17:30')).toBeInTheDocument();
  });
});

describe('Route guards', () => {
  it('redirects guests away from protected UI routes (server still enforces 401/403)', async () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthProvider>
          <Routes>
            <Route path="/admin" element={<RequireAuth admin><p>secret</p></RequireAuth>} />
            <Route path="/login" element={<p>login page</p>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );
    expect(await screen.findByText('login page')).toBeInTheDocument();
    expect(screen.queryByText('secret')).not.toBeInTheDocument();
  });
});
