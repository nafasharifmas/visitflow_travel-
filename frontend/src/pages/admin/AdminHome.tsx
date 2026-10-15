import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import type { Place, User } from '../../api/types';
import { ErrorState, Loading } from '../../components/States';
import { useAsync } from '../../lib/useAsync';

export default function AdminHome() {
  const q = useAsync(async () => {
    const [p, u] = await Promise.all([api.get<Place[]>('/admin/places'), api.get<User[]>('/admin/users')]);
    return { places: p.data, users: u.data };
  }, []);
  if (q.loading) return <Loading />;
  if (q.error) return <ErrorState message={q.error.message} onRetry={q.reload} />;
  const { places, users } = q.data!;
  return (
    <div>
      <h1 className="text-4xl">Dashboard</h1>
      <dl className="mt-6 max-w-xl">
        <div className="row"><dt className="label">Places</dt><dd className="fig">{places.length}</dd></div>
        <div className="row"><dt className="label">Unverified places</dt><dd className="fig">{places.filter((p) => !p.is_verified).length}</dd></div>
        <div className="row"><dt className="label">Registered accounts</dt><dd className="fig">{users.length}</dd></div>
      </dl>
      <p className="mt-6"><Link to="/admin/places/create">Add a place →</Link></p>
    </div>
  );
}
