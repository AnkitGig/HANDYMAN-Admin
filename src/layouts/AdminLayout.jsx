import { Suspense, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { Loader } from '../components/common/Loader';
import { ROUTES } from '../constants/routes';
import { useAuthStore } from '../store/authStore';

export default function AdminLayout() {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  return (
    <div className="min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-[270px]">
        <Header onMenu={() => setOpen(true)} />
        <main className="p-5 lg:p-7"><Suspense fallback={<Loader />}><Outlet /></Suspense></main>
      </div>
    </div>
  );
}
