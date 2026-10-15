import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  const cls = ({ isActive }: { isActive: boolean }) => `label no-underline pb-1 ${isActive ? 'border-b border-accent text-accent' : 'hover:text-accent'}`;
  return (
    <div className="wrap py-10">
      <p className="kicker">Administration</p>
      <nav aria-label="Admin" className="mt-3 flex gap-6 border-b border-hair pb-3">
        <NavLink end to="/admin" className={cls}>Dashboard</NavLink>
        <NavLink to="/admin/places" className={cls}>Places</NavLink>
        <NavLink to="/admin/users" className={cls}>Users</NavLink>
      </nav>
      <div className="pt-8"><Outlet /></div>
    </div>
  );
}
