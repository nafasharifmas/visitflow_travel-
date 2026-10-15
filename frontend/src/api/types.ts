export interface Category { id: number; name: string; slug: string }
export interface Place {
  id: number; name: string; slug: string; category: Category | null; description: string;
  image_url: string | null; opening_hours: string; distance_km: number; latitude: number; longitude: number;
  estimated_visit_minutes: number | null; is_verified: boolean;
}
export interface Stop { position: number; place: Place; suggested_start: string | null; suggested_end: string | null }
export interface Itinerary { id: number; title: string; itinerary_date: string | null; start_time: string; stops: Stop[] }
export interface User { id: number; username: string; name: string; email: string; role: 'user' | 'admin'; created_at?: string }
export interface Envelope<T> { data: T; message?: string }
export interface AuthPayload { user: User; token: string }
