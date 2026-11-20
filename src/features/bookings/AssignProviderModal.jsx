import { useState, useMemo } from 'react';
import { Search, UserCheck, Star, MapPin, Check, Wrench, AlertCircle, X, Phone, User } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { providers as allProviders, assignBookingProvider } from '../../services/api';

export default function AssignProviderModal({ booking, onClose, onAssign }) {
  const [search, setSearch] = useState('');
  const [filterMatchingOnly, setFilterMatchingOnly] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  // Count how many technicians match this booking's service category
  const matchingCount = useMemo(() => {
    if (!booking?.service) return 0;
    const bService = booking.service.toLowerCase();
    return allProviders.filter((p) => {
      const pService = p.service.toLowerCase();
      const pProf = (p.profession || '').toLowerCase();
      return pService.includes(bService) || bService.includes(pService) || pProf.includes(bService);
    }).length;
  }, [booking?.service]);

  // Filtered list of technicians
  const filteredProviders = useMemo(() => {
    return allProviders.filter((p) => {
      // Service category filter
      if (filterMatchingOnly && booking?.service) {
        const bService = booking.service.toLowerCase();
        const pService = p.service.toLowerCase();
        const pProf = (p.profession || '').toLowerCase();
        const matchesService =
          pService.includes(bService) ||
          bService.includes(pService) ||
          pProf.includes(bService);
        if (!matchesService) return false;
      }

      // Search query filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesSearch =
          p.name.toLowerCase().includes(q) ||
          (p.profession && p.profession.toLowerCase().includes(q)) ||
          p.service.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          (p.phone && p.phone.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [search, filterMatchingOnly, booking?.service]);

  if (!booking) return null;

  const handleAssign = (technician) => {
    // 1. Update API mock data with the technician's name
    assignBookingProvider(booking.id, technician.name);

    // 2. Notify parent component to update state
    if (onAssign) {
      onAssign(booking.id, technician.name);
    }

    setSuccessMsg(`Successfully assigned ${technician.name} (${technician.profession}) to booking ${booking.id}!`);
    setTimeout(() => {
      onClose();
    }, 850);
  };

  const handleUnassign = () => {
    assignBookingProvider(booking.id, '');
    if (onAssign) {
      onAssign(booking.id, '');
    }
    setSuccessMsg(`Unassigned technician from booking ${booking.id}.`);
    setTimeout(() => {
      onClose();
    }, 850);
  };

  return (
    <Modal
      title="Assign Handyman / Service Provider"
      onClose={onClose}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Booking Summary Card */}
        <div className="rounded-xl border border-red-100 bg-gradient-to-r from-red-50/70 via-rose-50/50 to-orange-50/30 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-red-100 pb-2.5 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm">Booking {booking.id}</span>
              <Badge tone="red">{booking.status || 'Active'}</Badge>
            </div>
            <span className="text-xs font-bold text-slate-700">
              Customer: <span className="text-slate-900">{booking.customer}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
            <div>
              <p className="text-slate-400 font-medium">Service Required</p>
              <p className="mt-0.5 font-bold text-brand flex items-center gap-1">
                <Wrench size={13} /> {booking.service}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Assigned Technician</p>
              <p className="mt-0.5 font-bold text-slate-800 flex items-center gap-1">
                <User size={13} className="text-slate-400" />
                {booking.provider ? (
                  <span className="text-emerald-700 font-bold">{booking.provider}</span>
                ) : (
                  <span className="text-amber-600 italic">Unassigned</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Booking Date</p>
              <p className="mt-0.5 font-semibold text-slate-700">{booking.date}</p>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800 animate-fadeIn">
            <Check size={16} className="text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Search & Matching Filter */}
        <div className="space-y-2">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-9 pr-4 text-xs font-medium text-slate-800 outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-red-100"
              placeholder="Search plumber / technician by name, skill, phone or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={filterMatchingOnly}
                onChange={(e) => setFilterMatchingOnly(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
              />
              <span>
                Show matching technicians for <b>"{booking.service}"</b>
                {matchingCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-extrabold text-brand">
                    {matchingCount} available
                  </span>
                )}
              </span>
            </label>

            <span className="text-slate-400 font-medium">
              Showing {filteredProviders.length} of {allProviders.length} technicians
            </span>
          </div>
        </div>

        {/* Technician Cards List */}
        <div className="max-h-[350px] space-y-2.5 overflow-y-auto pr-1">
          {filteredProviders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
              <AlertCircle size={28} className="mx-auto text-slate-300" />
              <p className="mt-2 text-sm font-bold text-slate-700">No matching technicians found</p>
              <p className="mt-1 text-xs text-slate-400">
                Try clearing the search or unchecking "matching technicians only".
              </p>
              {filterMatchingOnly && (
                <button
                  type="button"
                  onClick={() => setFilterMatchingOnly(false)}
                  className="mt-3 text-xs font-bold text-brand hover:underline"
                >
                  View All Available Technicians →
                </button>
              )}
            </div>
          ) : (
            filteredProviders.map((p) => {
              const isAssigned = booking.provider === p.name;
              const matchesService =
                booking.service &&
                (p.service.toLowerCase().includes(booking.service.toLowerCase()) ||
                  booking.service.toLowerCase().includes(p.service.toLowerCase()) ||
                  (p.profession && p.profession.toLowerCase().includes(booking.service.toLowerCase())));

              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between gap-3 rounded-xl border p-3.5 transition-all duration-150 ${
                    isAssigned
                      ? 'border-emerald-300 bg-emerald-50/50 ring-1 ring-emerald-400/50'
                      : 'border-slate-100 bg-white hover:border-red-200 hover:bg-rose-50/30'
                  }`}
                >
                  {/* Left: Avatar + Details */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Avatar name={p.name} size={42} />

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-black text-slate-900">{p.name}</p>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                          {p.profession}
                        </span>
                        {isAssigned && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            <Check size={11} /> Currently Assigned
                          </span>
                        )}
                        {matchesService && !isAssigned && (
                          <span className="rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-brand">
                            {p.service}
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1 text-slate-600">
                          <Phone size={11} className="text-slate-400" /> {p.phone}
                        </span>
                        <span className="flex items-center gap-1 text-amber-600 font-semibold">
                          <Star size={11} className="fill-amber-400 text-amber-400" /> {p.rating} ({p.reviews} jobs)
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <MapPin size={11} /> {p.location}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-600">
                          ● {p.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Assign Button */}
                  <div className="shrink-0 pl-2">
                    {isAssigned ? (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs">
                        <Check size={14} /> Assigned
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleAssign(p)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold shadow-xs hover:shadow-md"
                      >
                        <UserCheck size={14} /> Assign
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          {booking.provider ? (
            <button
              type="button"
              onClick={handleUnassign}
              className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline transition"
            >
              Unassign Current Technician
            </button>
          ) : (
            <span className="text-xs text-slate-400 italic">No technician assigned yet</span>
          )}

          <Button type="button" variant="light" onClick={onClose} size="sm">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
