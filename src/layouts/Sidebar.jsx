import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { SIDEBAR_MENU } from '../constants/sidebarMenu';
import { ROUTES } from '../constants/routes';
import { useAuthStore } from '../store/authStore';

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuthStore();
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col bg-nav text-white transition-transform lg:translate-x-0 ${open ? '' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-6 py-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-2xl font-black">S</span>
          <div className="leading-tight"><p className="text-xl font-extrabold">ServEase</p><p className="text-sm text-slate-300">Admin Panel</p></div>
        </div>
        <nav className="flex-1 space-y-1 px-2.5 py-2">
          {SIDEBAR_MENU.map(({ to, label, icon: Icon, badge }) => (
            <NavLink key={to} to={to} end={to === ROUTES.DASHBOARD} onClick={onClose}
              className={({ isActive }) => `flex items-center gap-4 rounded-xl px-4 py-3.5 text-[15px] font-medium transition ${isActive ? 'bg-brand text-white' : 'text-slate-200 hover:bg-white/10'}`}>
              <Icon size={22} /><span className="flex-1">{label}</span>
              {badge && <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-bold ring-1 ring-white/30">{badge}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3 border-t border-white/10 px-5 py-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg font-bold text-nav">{(user?.name || 'A')[0]}</span>
          <div className="min-w-0 flex-1 leading-tight"><p className="font-semibold">{user?.name}</p><p className="truncate text-xs text-slate-300">{user?.email}</p></div>
          <button onClick={logout} aria-label="Log out" title="Log out"><LogOut size={19} className="text-slate-300 hover:text-white" /></button>
        </div>
      </aside>
    </>
  );
}
