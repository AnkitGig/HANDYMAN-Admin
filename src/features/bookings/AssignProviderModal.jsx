import { useState, useMemo } from 'react';
import {
  X,
  Search,
  Star,
  MapPin,
  Phone,
  Check,
  CheckCircle2,
  Wrench,
  AlertCircle
} from 'lucide-react';
import { providers as allProviders, assignBookingProvider } from '../../services/api';

export default function AssignProviderModal({ booking, onClose, onAssign }) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('recommended'); // 'recommended' | 'all'
  const [selectedTechId, setSelectedTechId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Matching technicians for this booking's service category
  const matchingProviders = useMemo(() => {
    if (!booking?.service) return [];
    const bService = booking.service.toLowerCase();
    return allProviders.filter((p) => {
      const pService = p.service.toLowerCase();
      const pProf = (p.profession || '').toLowerCase();
      return pService.includes(bService) || bService.includes(pService) || pProf.includes(bService);
    });
  }, [booking?.service]);

  // Default selection
  useMemo(() => {
    if (!selectedTechId) {
      if (booking?.provider) {
        const found = allProviders.find((p) => p.name === booking.provider);
        if (found) {
          setSelectedTechId(found.id);
          return;
        }
      }
      if (matchingProviders.length > 0) {
        setSelectedTechId(matchingProviders[0].id);
      } else if (allProviders.length > 0) {
        setSelectedTechId(allProviders[0].id);
      }
    }
  }, [matchingProviders, booking?.provider]);

  // Filtered providers list
  const filteredProviders = useMemo(() => {
    return allProviders.filter((p) => {
      // Tab filter
      if (tab === 'recommended' && booking?.service) {
        const bService = booking.service.toLowerCase();
        const pService = p.service.toLowerCase();
        const pProf = (p.profession || '').toLowerCase();
        const matches = pService.includes(bService) || bService.includes(pService) || pProf.includes(bService);
        if (!matches) return false;
      }

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          (p.profession && p.profession.toLowerCase().includes(q)) ||
          p.service.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          (p.phone && p.phone.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [search, tab, booking?.service]);

  if (!booking) return null;

  const handleConfirmAssign = (techToAssign) => {
    const tech = techToAssign || allProviders.find((p) => p.id === selectedTechId);
    if (!tech) return;

    assignBookingProvider(booking.id, tech.name);
    if (onAssign) {
      onAssign(booking.id, tech.name);
    }

    setSuccessMsg(`Assigned ${tech.name} to booking ${booking.id}`);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleUnassign = () => {
    assignBookingProvider(booking.id, '');
    if (onAssign) {
      onAssign(booking.id, '');
    }
    setSuccessMsg(`Unassigned provider from booking ${booking.id}`);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const selectedTech = allProviders.find((p) => p.id === selectedTechId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---------------- 1. CLEAN ENTERPRISE HEADER ---------------- */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shrink-0">
          <div>
            <h3 className="text-base font-bold text-slate-900">Assign Service Provider</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a verified technician to assign to this booking
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* ---------------- 2. BOOKING CONTEXT STRIP ---------------- */}
        <div className="bg-slate-50/90 border-b border-slate-100 px-6 py-3 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 flex-wrap text-slate-600">
            <span className="font-bold text-slate-900 bg-white border border-slate-200/80 px-2 py-0.5 rounded-md">
              {booking.id}
            </span>
            <span>•</span>
            <span className="font-semibold text-slate-800">{booking.service}</span>
            <span>•</span>
            <span>Customer: <b className="text-slate-700">{booking.customer}</b></span>
          </div>

          <div>
            {booking.provider ? (
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full text-[11px]">
                <Check size={12} /> {booking.provider}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Unassigned
              </span>
            )}
          </div>
        </div>

        {/* ---------------- 3. CONTROLS: SEARCH & TABS ---------------- */}
        <div className="px-6 pt-4 pb-2 space-y-3 shrink-0 bg-white">
          {/* Search bar */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className="w-full h-9 rounded-lg border border-slate-200 bg-white pl-8 pr-8 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#9c0409] focus:ring-1 focus:ring-[#9c0409] outline-none transition"
              placeholder={`Search ${booking.service || ''} technicians by name, city, phone...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Underline Style Segmented Tabs (Linear / GitHub style) */}
          <div className="flex border-b border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setTab('recommended')}
              className={`pb-2.5 px-3 font-semibold transition-all border-b-2 -mb-px flex items-center gap-1.5 ${
                tab === 'recommended'
                  ? 'border-[#9c0409] text-[#9c0409]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Matching Technicians</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  tab === 'recommended' ? 'bg-brand-50 text-[#9c0409]' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {matchingProviders.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTab('all')}
              className={`pb-2.5 px-3 font-semibold transition-all border-b-2 -mb-px flex items-center gap-1.5 ${
                tab === 'all'
                  ? 'border-[#9c0409] text-[#9c0409]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>All Technicians</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  tab === 'all' ? 'bg-brand-50 text-[#9c0409]' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {allProviders.length}
              </span>
            </button>
          </div>
        </div>

        {/* ---------------- 4. TECHNICIAN LIST (SCROLLABLE) ---------------- */}
        <div className="px-6 py-2 overflow-y-auto space-y-2 flex-1 min-h-0">
          {successMsg && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 text-xs font-semibold text-emerald-800 mb-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {filteredProviders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
              <AlertCircle size={24} className="mx-auto text-slate-300" />
              <p className="mt-2 text-xs font-semibold text-slate-700">No technicians found</p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                Try a different search or switch to "All Technicians".
              </p>
              {tab === 'recommended' && (
                <button
                  type="button"
                  onClick={() => setTab('all')}
                  className="mt-2.5 text-xs font-semibold text-[#9c0409] hover:underline"
                >
                  View All Technicians →
                </button>
              )}
            </div>
          ) : (
            filteredProviders.map((p) => {
              const isSelected = selectedTechId === p.id;
              const initials = p.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedTechId(p.id)}
                  className={`group flex items-center justify-between gap-3 rounded-xl border p-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#9c0409] bg-brand-50/20 ring-1 ring-[#9c0409]/25 shadow-2xs'
                      : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  {/* Left: Radio + Avatar + Details */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Radio indicator */}
                    <div
                      className={`h-4 w-4 shrink-0 rounded-full border flex items-center justify-center transition ${
                        isSelected
                          ? 'border-[#9c0409] bg-brand-grad'
                          : 'border-slate-300 group-hover:border-slate-400 bg-white'
                      }`}
                    >
                      {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>

                    {/* Clean neutral avatar */}
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
                      {initials}
                    </span>

                    <div className="min-w-0 leading-tight">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-[#9c0409] transition-colors">
                          {p.name}
                        </p>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                          {p.profession}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1 font-semibold text-amber-600">
                          <Star size={11} className="fill-amber-400 text-amber-400" /> {p.rating}
                          <span className="font-normal text-slate-400">({p.reviews})</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-slate-600">
                          <MapPin size={11} className="text-slate-400" /> {p.location.split(',')[0]}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-slate-500 text-[11px]">
                          {p.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quick action / Status */}
                  <div className="shrink-0 pl-1">
                    {isSelected ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirmAssign(p);
                        }}
                        className="rounded-lg bg-brand-grad hover:bg-brand-dark text-white px-3 py-1.5 text-xs font-semibold transition shadow-2xs"
                      >
                        Assign
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 group-hover:text-slate-600 font-medium px-2 py-1">
                        Select
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ---------------- 5. CLEAN FOOTER ---------------- */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
          <div>
            {booking.provider ? (
              <button
                type="button"
                onClick={handleUnassign}
                className="text-xs font-medium text-slate-500 hover:text-red-600 transition"
              >
                Unassign Current Provider
              </button>
            ) : (
              <span className="text-xs text-slate-500">
                {filteredProviders.length} technicians available
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => handleConfirmAssign()}
              disabled={!selectedTech}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-brand-grad hover:bg-brand-dark text-white shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Assign Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
