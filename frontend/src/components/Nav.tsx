import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import { usePlan } from '../context/Plan';

const links = [['EXPLORE', '/explore'], ['MAP', '/map'], ['PLANNER', '/planner'], ['ABOUT', '/#about']] as const;

export default function Nav() {
  const { user, logout } = useAuth();
  const plan = usePlan();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[58px] border-b border-hair bg-ground/85 backdrop-blur-[12px]">
      <div className="wrap flex h-full items-center justify-between">
        <Link to="/" className="font-display text-[19px] text-ink no-underline" aria-label="Visit Flow home">
          Visit Flow<span className="text-accent">.</span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {links.map(([label, to]) => (
            <NavLink key={label} to={to} className={({ isActive }) => `label no-underline hover:text-accent ${isActive && !to.includes('#') ? 'text-accent' : ''}`}>
              {label}{label === 'PLANNER' && plan.ids.length > 0 ? ` (${plan.ids.length})` : ''}
            </NavLink>
          ))}
        </nav>
        <div className="relative">
          <button className="btn h-[36px] min-h-[36px] w-[44px] px-0" aria-label="Account menu" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((o) => !o)}>
            {open ? '×' : '≡'}
          </button>
          {open && (
            <div role="menu" className="absolute right-0 top-[44px] w-56 border border-hair bg-ground p-2" onClick={() => setOpen(false)}>
              {links.map(([label, to]) => <Link key={label} role="menuitem" to={to} className="label block px-3 py-2 no-underline md:hidden">{label}</Link>)}
              {user ? (
                <>
                  <p className="label px-3 py-2">{user.username} · {user.role}</p>
                  <Link role="menuitem" to="/itineraries" className="label block px-3 py-2 no-underline">My itineraries</Link>
                  {user.role === 'admin' && <Link role="menuitem" to="/admin" className="label block px-3 py-2 no-underline">Admin</Link>}
                  <button role="menuitem" className="label block w-full px-3 py-2 text-left hover:text-accent" onClick={() => logout().then(() => nav('/'))}>Sign out</button>
                </>
              ) : (
                <>
                  <Link role="menuitem" to="/login" className="label block px-3 py-2 no-underline">Sign in</Link>
                  <Link role="menuitem" to="/register" className="label block px-3 py-2 no-underline">Register</Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
