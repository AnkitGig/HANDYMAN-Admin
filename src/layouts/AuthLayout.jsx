import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useAuthStore } from '../store/authStore';

export default function AuthLayout() {
  const user = useAuthStore((s) => s.user);
  if (user) return <Navigate to={ROUTES.DASHBOARD} replace />;
  return (
    <div className="flex min-h-screen items-center justify-center bg-nav p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-2xl font-black text-white">S</span>
          <div className="leading-tight"><p className="text-xl font-extrabold">ServEase</p><p className="text-sm text-slate-500">Admin Panel</p></div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
