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
    <div className="relative min-h-screen bg-[#faf9fa] text-slate-800">
      {/* Ambient background pink wave in top right */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-[420px] w-[500px] bg-gradient-to-bl from-pink-100/70 via-rose-50/40 to-transparent blur-3xl -z-0"
        aria-hidden="true"
      />

      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="lg:pl-[260px] relative z-10 flex flex-col min-h-screen">
        <Header onMenu={() => setOpen(true)} />
        <main className="flex-1 p-5 lg:p-7">
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
