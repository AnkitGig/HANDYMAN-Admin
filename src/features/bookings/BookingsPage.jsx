import { useState } from 'react';
import { CalendarDays, CheckCircle2, Clock, XCircle, Layers, MapPin, Tag, UserCheck } from 'lucide-react';
import { ListPage, RowActions } from '../../components/common/ListPage';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import AssignProviderModal from './AssignProviderModal';

export default function Bookings() {
  const [assigningBooking, setAssigningBooking] = useState(null);

  return (
    <ListPage
      title="Bookings" sub="Manage and track all service bookings." noun="bookings" file="bookings"
      resource="bookings" searchPh="Search by booking ID, customer, or service..." searchKeys={['id', 'customer', 'service', 'provider']}
      detailPath="/bookings/:id"
      tabs={['In Progress', 'Completed', 'Scheduled', 'Cancelled', 'Refunded']}
      filters={[
        { key: 'service', label: 'All Services', icon: Layers }, { key: 'provider', label: 'All Providers', icon: MapPin },
        { key: 'status', label: 'All Status', icon: Tag },
      ]}
      stats={() => [
        { icon: CalendarDays, label: 'Total Bookings', value: '1,248', change: '+12.5%', tint: 'red' },
        { icon: CheckCircle2, label: 'Completed', value: '620', change: '+14.8%', tint: 'green' },
        { icon: Clock, label: 'In Progress', value: '236', change: '+8.1%', tint: 'blue' },
        { icon: XCircle, label: 'Cancelled', value: '124', change: '+5.6%', tint: 'red' },
      ]}
      columns={[
        { h: '#', r: (r) => <b>{r.id}</b> },
        { h: 'Customer', r: (r) => <span className="flex items-center gap-3"><Avatar name={r.customer} />{r.customer}</span> },
        { h: 'Service', r: (r) => <span className="font-semibold text-slate-800">{r.service}</span> },
        {
          h: 'Provider',
          r: (r, c) => (
            <div className="flex items-center gap-2">
              {r.provider ? (
                <>
                  <span className="font-semibold text-slate-800">{r.provider}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAssigningBooking({ booking: r, ctx: c });
                    }}
                    title="Change service provider"
                    className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-600 hover:border-brand-200 hover:bg-brand-50 hover:text-brand transition shadow-2xs"
                  >
                    <UserCheck size={11} className="text-brand" />
                    <span>Change</span>
                  </button>
                </>
              ) : (
                <>
                  <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 italic">
                    Unassigned
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAssigningBooking({ booking: r, ctx: c });
                    }}
                    title="Assign service provider"
                    className="inline-flex items-center gap-1 rounded-md bg-brand text-white px-2 py-0.5 text-[11px] font-bold hover:bg-brand-dark transition shadow-2xs"
                  >
                    <UserCheck size={11} />
                    <span>Assign</span>
                  </button>
                </>
              )}
            </div>
          ),
        },
        { h: 'Booking Date', r: (r) => r.date },
        { h: 'Amount', r: (r) => <b>{formatCurrency(r.amount)}</b> },
        { h: 'Status', r: (r) => <Badge>{r.status}</Badge> },
        {
          h: 'Action',
          r: (r, c) => (
            <RowActions
              r={r}
              ctx={c}
              extra={(row, context) => (
                <button
                  type="button"
                  onClick={() => setAssigningBooking({ booking: row, ctx: context })}
                  title={row.provider ? 'Change Provider' : 'Assign Provider'}
                  className="text-slate-500 hover:text-brand transition"
                >
                  <UserCheck size={16} />
                </button>
              )}
            />
          ),
        },
      ]}
    >
      {assigningBooking && (
        <AssignProviderModal
          booking={assigningBooking.booking}
          onClose={() => setAssigningBooking(null)}
          onAssign={(bookingId, providerName) => {
            assigningBooking.ctx.update(bookingId, { provider: providerName });
            setAssigningBooking(null);
          }}
        />
      )}
    </ListPage>
  );
}
