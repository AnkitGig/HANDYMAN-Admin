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
        className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-slate-200 bg-white text-slate-800 transition-transform lg:translate-x-0 ${
          open ? '' : '-translate-x-full'
        } overflow-hidden`}
      >
        {/* Decorative corner waves in bottom of sidebar matching the design mockup */}
        <svg
          className="pointer-events-none absolute bottom-0 left-0 w-full h-56 -z-0 opacity-80"
          viewBox="0 0 260 220"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="sideWaveA" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fecdd3" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#ffe4e6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="sideWaveB" x1="0%" y1="100%" x2="80%" y2="20%">
              <stop offset="0%" stopColor="#fda4af" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#fecdd3" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d="M0,90 C80,60 140,140 260,110 L260,220 L0,220 Z" fill="url(#sideWaveA)" />
          <path d="M0,130 C90,110 150,170 260,150 L260,220 L0,220 Z" fill="url(#sideWaveB)" />
        </svg>

        {/* Brand Logo Header */}
        <div className="relative z-10 flex items-center gap-3 px-6 py-5 border-b border-slate-100">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-11 w-11 shrink-0 object-contain"
          />
          <div className="leading-tight">
            <p className="text-xl font-extrabold tracking-tight text-slate-900">ServEase</p>
            <p className="text-xs font-medium text-slate-400">Admin Panel</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="relative z-10 flex-1 space-y-1 px-3 py-3">
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
        <div className="relative z-10 flex items-center gap-3 border-t border-slate-200/80 px-5 py-4 bg-white/80 backdrop-blur-xs">
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
