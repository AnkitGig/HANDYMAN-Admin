import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, User, Wrench, Building2, IndianRupee, Clock } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { formatCurrency } from '../../utils/formatCurrency';
import { bookings } from '../../services/api';

export default function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-bold text-slate-700">Booking Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">The booking "{id}" does not exist.</p>
        <Button className="mt-4" onClick={() => navigate('/bookings')}>← Back to Bookings</Button>
      </div>
    );
  }

  const info = [
    { icon: User, label: 'Customer', value: booking.customer },
    { icon: Wrench, label: 'Service', value: booking.service },
    { icon: Building2, label: 'Provider', value: booking.provider },
    { icon: Calendar, label: 'Booking Date', value: booking.date },
    { icon: IndianRupee, label: 'Amount', value: formatCurrency(booking.amount) },
    { icon: Clock, label: 'Status', value: booking.status, isBadge: true },
  ];

  return (
    <div>
      <button
        onClick={() => navigate('/bookings')}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft size={16} /> Back to Bookings
      </button>

      <PageHeader title={`Booking ${booking.id}`} sub={`Details for booking ${booking.id}`} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info Card */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="mb-5 text-lg font-extrabold">Booking Information</h2>
          <div className="space-y-4">
            {info.map(({ icon: Icon, label, value, isBadge }) => (
              <div key={label} className="flex items-center gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                  <Icon size={18} />
                </span>
                <div className="flex-1">
                  <p className="text-xs text-slate-400 font-medium">{label}</p>
                  {isBadge ? <Badge>{value}</Badge> : <p className="text-sm font-semibold text-slate-800">{value}</p>}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Customer Card */}
        <Card className="p-6">
          <h2 className="mb-5 text-lg font-extrabold">Customer</h2>
          <div className="flex flex-col items-center text-center">
            <Avatar name={booking.customer} size={64} />
            <p className="mt-3 text-base font-bold">{booking.customer}</p>
            <p className="mt-1 text-xs text-slate-400">{booking.customer.toLowerCase().replace(' ', '.') + '@gmail.com'}</p>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Service</span>
              <span className="font-semibold">{booking.service}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Provider</span>
              <span className="font-semibold">{booking.provider}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Amount</span>
              <span className="font-bold text-brand">{formatCurrency(booking.amount)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
