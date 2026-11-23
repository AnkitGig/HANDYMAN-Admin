import { useLocation } from 'react-router-dom';
import { Menu, Search, Bell } from 'lucide-react';
import { SIDEBAR_MENU } from '../constants/sidebarMenu';
import { useAuthStore } from '../store/authStore';

export default function Header({ onMenu }) {
  const { pathname } = useLocation();
  const user = useAuthStore((s) => s.user);
  const title = (SIDEBAR_MENU.find((m) => m.to === pathname) || SIDEBAR_MENU[0]).label;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 py-2.5 lg:px-5 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg p-1 text-slate-600 hover:bg-slate-100 lg:hidden"
          onClick={onMenu}
          aria-label="Menu"
        >
          <Menu size={22} />
        </button>
        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Search bar pill */}
        <div className="relative hidden w-64 md:block lg:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-full border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-[13px] font-medium text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100"
            placeholder="Search bookings, users, providers..."
          />
        </div>

        {/* Notifications */}
        <button
          className="relative rounded-full p-2 text-slate-600 hover:bg-brand-50 hover:text-[#9c0409] transition"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-grad ring-2 ring-white" />
        </button>

        {/* User Avatar */}
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-grad text-sm font-bold text-white shadow-xs">
          {(user?.name || 'A')[0]}
        </span>
      </div>
    </header>
  );
}
