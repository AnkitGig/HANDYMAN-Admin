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
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-slate-100 bg-white text-slate-800 transition-transform lg:translate-x-0 ${
          open ? '' : '-translate-x-full'
        } overflow-hidden`}
      >
        {/* Subtle decorative bottom wave in sidebar */}
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-gradient-to-tr from-rose-100/60 via-pink-50/40 to-transparent blur-2xl -z-0"
          aria-hidden="true"
        />

        {/* Brand Logo Header */}
        <div className="relative z-10 flex items-center gap-3 px-6 py-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ef4444] text-xl font-black text-white shadow-md shadow-red-500/25">
            S
          </span>
          <div className="leading-tight">
            <p className="text-xl font-extrabold tracking-tight text-slate-900">ServEase</p>
            <p className="text-xs font-medium text-slate-400">Admin Panel</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="relative z-10 flex-1 space-y-1 px-3 py-2">
          {SIDEBAR_MENU.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={to === ROUTES.DASHBOARD}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#ef4444] text-white shadow-md shadow-red-500/25'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} className={isActive ? 'text-white' : 'text-slate-500'} />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        isActive
                          ? 'bg-white text-[#ef4444]'
                          : 'bg-[#ef4444] text-white'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Profile Footer */}
        <div className="relative z-10 flex items-center gap-3 border-t border-slate-100 px-5 py-4 bg-white/80 backdrop-blur-xs">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ef4444] text-base font-bold text-white shadow-xs">
            {(user?.name || 'A')[0]}
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-bold text-slate-900">{user?.name || 'Admin'}</p>
            <p className="truncate text-xs text-slate-400">{user?.email || 'admin@servease.com'}</p>
          </div>
          <button
            onClick={logout}
            aria-label="Log out"
            title="Log out"
            className="text-slate-400 hover:text-slate-700 transition"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>
    </>
  );
}
