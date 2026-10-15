import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ApiError } from '../api/client';
import { FieldError } from '../components/States';
import { useAuth } from '../context/Auth';

function useSubmit(action: () => Promise<unknown>) {
  const [error, setError] = useState<ApiError | null>(null);
  const [busy, setBusy] = useState(false);
  const loc = useLocation();
  const nav = useNavigate();
  const from = (loc.state as { from?: string } | null)?.from ?? '/explore';
  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setError(null);
    try { await action(); nav(from, { replace: true }); }
    catch (x) { setError(x instanceof ApiError ? x : new ApiError(0, 'Unexpected error.')); }
    finally { setBusy(false); }
  }
  return { error, busy, submit };
}

const Field = ({ id, label, error, ...rest }: { id: string; label: string; error?: Record<string, string[]> } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="mt-5">
    <label htmlFor={id} className="label">{label}</label>
    <input id={id} name={id} className="input mt-1" {...rest} />
    <FieldError errors={error} name={id} />
  </div>
);

export function Login() {
  const { login } = useAuth();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const { error, busy, submit } = useSubmit(() => login(id, pw));
  return (
    <div className="wrap max-w-[520px] py-16">
      <p className="kicker">Sign in</p>
      <h1 className="mt-2 text-5xl">Welcome <em className="text-accent">back</em>.</h1>
      <form onSubmit={submit} className="mt-8" noValidate>
        <Field id="login" label="Username or email" value={id} onChange={(e) => setId(e.target.value)} autoComplete="username" required error={error?.errors} />
        <Field id="password" label="Password" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" required error={error?.errors} />
        {error && !error.errors && <p role="alert" className="mt-4 text-accent">{error.message}</p>}
        <button className="btn mt-6" disabled={busy || !id || !pw}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <p className="mt-6">No account? <Link to="/register">Register</Link></p>
    </div>
  );
}

export function Register() {
  const { register } = useAuth();
  const [f, setF] = useState({ username: '', name: '', email: '', password: '', password_confirmation: '' });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const { error, busy, submit } = useSubmit(() => register(f));
  return (
    <div className="wrap max-w-[520px] py-16">
      <p className="kicker">Register</p>
      <h1 className="mt-2 text-5xl">Save your <em className="text-accent">days</em>.</h1>
      <form onSubmit={submit} className="mt-6" noValidate>
        <Field id="username" label="Username" value={f.username} onChange={set('username')} autoComplete="username" error={error?.errors} />
        <Field id="name" label="Full name" value={f.name} onChange={set('name')} autoComplete="name" error={error?.errors} />
        <Field id="email" label="Email" type="email" value={f.email} onChange={set('email')} autoComplete="email" error={error?.errors} />
        <Field id="password" label="Password (8+ characters, letters and numbers)" type="password" value={f.password} onChange={set('password')} autoComplete="new-password" error={error?.errors} />
        <Field id="password_confirmation" label="Confirm password" type="password" value={f.password_confirmation} onChange={set('password_confirmation')} autoComplete="new-password" error={error?.errors} />
        {error && !error.errors && <p role="alert" className="mt-4 text-accent">{error.message}</p>}
        <button className="btn mt-6" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
      </form>
      <p className="mt-6">Already registered? <Link to="/login">Sign in</Link></p>
    </div>
  );
}
