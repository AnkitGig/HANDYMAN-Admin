import { CalendarDays, CheckCircle2, Clock, XCircle, Layers, MapPin, Tag } from 'lucide-react';
import { ListPage, RowActions } from '../../components/common/ListPage';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatCurrency';

export default function Bookings() {
  return (
    <ListPage
      title="Bookings" sub="Manage and track all service bookings." noun="bookings" file="bookings"
      resource="bookings" searchPh="Search by booking ID, customer, or service..." searchKeys={['id', 'customer', 'service']}
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
        { h: 'Service', r: (r) => r.service },
        { h: 'Provider', r: (r) => r.provider },
        { h: 'Booking Date', r: (r) => r.date },
        { h: 'Amount', r: (r) => <b>{formatCurrency(r.amount)}</b> },
        { h: 'Status', r: (r) => <Badge>{r.status}</Badge> },
        { h: 'Action', r: (r, c) => <RowActions r={r} ctx={c} /> },
      ]}
    />
  );
}
