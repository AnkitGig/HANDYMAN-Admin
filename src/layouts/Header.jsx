import { useLocation } from 'react-router-dom';
import { Menu, Search, Bell } from 'lucide-react';
import { SIDEBAR_MENU } from '../constants/sidebarMenu';
import { useAuthStore } from '../store/authStore';

export default function Header({ onMenu }) {
  const { pathname } = useLocation();
  const user = useAuthStore((s) => s.user);
  const title = (SIDEBAR_MENU.find((m) => m.to === pathname) || SIDEBAR_MENU[0]).label;
  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-slate-100 bg-white px-5 py-3.5">
      <button className="lg:hidden" onClick={onMenu} aria-label="Menu"><Menu size={24} /></button>
      <h2 className="text-xl font-extrabold">{title}</h2>
      <div className="relative ml-auto hidden w-full max-w-md md:block">
        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input className="field rounded-xl py-3 pl-10" placeholder="Search bookings, users, providers..." />
      </div>
      <button className="relative ml-auto md:ml-0" aria-label="Notifications">
        <Bell size={22} /><span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-brand" />
      </button>
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand font-bold text-white">{(user?.name || 'A')[0]}</span>
    </header>
  );
}
