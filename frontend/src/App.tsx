import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { RequireAuth } from './components/Guard';
import Nav from './components/Nav';
import { Loading, NotFound } from './components/States';
import Explore from './pages/Explore';
import ItineraryDetail from './pages/ItineraryDetail';
import Itineraries from './pages/Itineraries';
import Landing from './pages/Landing';
import { Login, Register } from './pages/AuthPages';
import PlaceDetail from './pages/PlaceDetail';
import Planner from './pages/Planner';

const MapPage = lazy(() => import('./pages/MapPage'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminPlaces = lazy(() => import('./pages/admin/AdminPlaces'));
const AdminPlaceForm = lazy(() => import('./pages/admin/AdminPlaceForm'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminHome = lazy(() => import('./pages/admin/AdminHome'));

export default function App() {
  const { pathname } = useLocation();
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[60] focus:bg-ground focus:p-2">Skip to content</a>
      <Nav />
      <main id="main" className={pathname === '/' ? '' : 'pt-[58px]'}>
        <Suspense fallback={<div className="wrap"><Loading /></div>}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/places/:id" element={<PlaceDetail />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/itineraries" element={<RequireAuth><Itineraries /></RequireAuth>} />
            <Route path="/itineraries/:id" element={<RequireAuth><ItineraryDetail /></RequireAuth>} />
            <Route path="/admin" element={<RequireAuth admin><AdminLayout /></RequireAuth>}>
              <Route index element={<AdminHome />} />
              <Route path="places" element={<AdminPlaces />} />
              <Route path="places/create" element={<AdminPlaceForm />} />
              <Route path="places/:id/edit" element={<AdminPlaceForm />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}
