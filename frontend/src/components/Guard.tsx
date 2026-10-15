import type { ReactNode } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import { Loading } from './States';

/** UI convenience only. The Laravel API independently enforces authentication and role (NFR-011). */
export function RequireAuth({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <div className="wrap pt-24"><Loading /></div>;
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  if (admin && user.role !== 'admin') {
    return (
      <div className="wrap pt-32 pb-24" role="alert">
        <p className="kicker">403 · Forbidden</p>
        <h1 className="mt-2 text-5xl">Administrators only.</h1>
        <p className="mt-4"><Link to="/explore">Back to Explore</Link></p>
      </div>
    );
  }
  return <>{children}</>;
}
