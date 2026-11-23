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
    <div className="relative min-h-screen bg-[#fafafa] text-slate-800">
      {/* Decorative top-right corner wave ribbons matching the design mockup */}
      <svg
        className="pointer-events-none absolute right-0 top-0 w-full max-w-[900px] h-[280px] opacity-75 overflow-hidden -z-0"
        viewBox="0 0 1100 360"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="topWave1" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f4c4c6" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#fbe3e4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fdf1f1" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="topWave2" x1="100%" y1="20%" x2="10%" y2="100%">
            <stop offset="0%" stopColor="#e99a9d" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#f4c4c6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="topWave3" x1="100%" y1="0%" x2="30%" y2="100%">
            <stop offset="0%" stopColor="#9c0409" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d="M350,0 C650,90 850,20 1100,130 L1100,0 Z" fill="url(#topWave1)" />
        <path d="M200,0 C520,160 800,40 1100,210 L1100,0 Z" fill="url(#topWave2)" />
        <path d="M100,0 C420,200 750,70 1100,280 L1100,0 Z" fill="url(#topWave3)" />
      </svg>

      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="lg:pl-[232px] relative z-10 flex flex-col min-h-screen">
        <Header onMenu={() => setOpen(true)} />
        <main className="mx-auto w-full max-w-[1440px] flex-1 p-4 lg:p-5 xl:p-6">
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
