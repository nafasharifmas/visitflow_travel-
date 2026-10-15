import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function Loading({ label = 'Loading' }: { label?: string }) {
  return <p role="status" className="label py-10">{label}…</p>;
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rule py-12">
      <h3 className="text-2xl">{title}</h3>
      {children && <div className="mt-3 text-ink2">{children}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rule py-12">
      <p className="kicker">Something went wrong</p>
      <p className="mt-2">{message}</p>
      {onRetry && <button className="btn mt-4" onClick={onRetry}>Try again</button>}
    </div>
  );
}

export function NotFound({ what = 'page' }: { what?: string }) {
  return (
    <div className="wrap py-24">
      <p className="kicker">404</p>
      <h1 className="mt-2 text-5xl">This {what} could not be found.</h1>
      <p className="mt-4"><Link to="/explore">Back to Explore</Link></p>
    </div>
  );
}

export function FieldError({ errors, name }: { errors?: Record<string, string[]>; name: string }) {
  const msg = errors?.[name]?.[0];
  return msg ? <p role="alert" className="mt-1 text-[12px] text-accent">{msg}</p> : null;
}
