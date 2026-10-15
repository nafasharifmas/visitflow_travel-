import type { Envelope } from './types';

const BASE: string = import.meta.env.VITE_API_BASE_URL ?? '/api';
const TOKEN_KEY = 'vf_token'; // TBD-005: bearer token kept in localStorage (see docs/SECURITY.md)

export class ApiError extends Error {
  constructor(public status: number, message: string, public errors?: Record<string, string[]>) {
    super(message);
  }
}

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string | null): void => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

export async function request<T>(path: string, method = 'GET', body?: unknown): Promise<Envelope<T>> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch {
    throw new ApiError(0, 'The server could not be reached. Please try again.');
  }
  let json: { message?: string; errors?: Record<string, string[]> } & Partial<Envelope<T>> = {};
  try { json = await res.json(); } catch { /* empty body */ }
  if (!res.ok) throw new ApiError(res.status, json.message ?? 'Something went wrong.', json.errors);
  return json as Envelope<T>;
}

export const api = {
  get: <T>(p: string) => request<T>(p),
  post: <T>(p: string, b?: unknown) => request<T>(p, 'POST', b ?? {}),
  put: <T>(p: string, b: unknown) => request<T>(p, 'PUT', b),
  del: <T = null>(p: string) => request<T>(p, 'DELETE'),
};
