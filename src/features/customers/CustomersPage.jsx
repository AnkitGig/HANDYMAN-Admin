import { Users, UserCheck, UserPlus, Ban, MapPin, CalendarDays, Tag, Phone, Mail, ChevronRight, FileText, CreditCard, Star, MessageSquare, Wallet } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { ListPage, RowActions } from '../../components/common/ListPage';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatCurrency';

function Panel({ row: r, ctx }) {
  const Row = ({ icon: I, children }) => <p className="flex items-center gap-3 text-sm"><I size={17} className="text-slate-500" />{children}</p>;
  return (
    <div>
      <div className="flex items-center gap-4">
        <Avatar name={r.name} size={64} />
        <div><p className="flex items-center gap-2 text-lg font-extrabold">{r.name}<Badge>{r.status}</Badge></p>
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold">{r.id}</span></div>
      </div>
      <div className="mt-5 space-y-3 border-b border-slate-100 pb-5">
        <Row icon={Phone}>{r.phone}</Row><Row icon={Mail}>{r.email}</Row>
        <Row icon={MapPin}>{r.location}</Row><Row icon={CalendarDays}>Joined on {r.joined}</Row>
      </div>
      <div className="my-5 grid grid-cols-3 gap-2 text-center">
        {[[CalendarDays, r.bookings, 'Total Bookings', 'text-brand'], [Wallet, formatCurrency(r.spent), 'Total Spent', 'text-green-600'], [Star, r.rating, 'Avg. Rating', 'text-amber-500']].map(([I, v, l, c]) => (
          <div key={l} className="rounded-xl bg-slate-50 p-3"><I size={20} className={`mx-auto ${c}`} /><p className="mt-1 font-extrabold">{v}</p><p className="text-[11px] text-slate-500">{l}</p></div>
        ))}
      </div>
      {[[FileText, 'Booking History'], [CreditCard, 'Payment History'], [Star, 'Reviews'], [MessageSquare, 'Support Tickets']].map(([I, l]) => (
        <button key={l} className="flex w-full items-center gap-3 border-t border-slate-100 py-3 text-sm font-medium"><I size={18} className="text-slate-500" /><span className="flex-1 text-left">{l}</span><ChevronRight size={16} /></button>
      ))}
      <button className="btn-danger mt-4 w-full" onClick={() => ctx.update(r.id, { status: r.status === 'Blocked' ? 'Active' : 'Blocked' })}>
        <Ban size={16} />{r.status === 'Blocked' ? 'Unblock Customer' : 'Block Customer'}
      </button>
    </div>
  );
}

export default function Customers() {
  return (
    <ListPage
      title="Customers" sub="Manage all registered customers on the platform." noun="customers" file="customers" panelTitle="Customer Details"
      resource="customers" searchPh="Search by name, phone, or email..." searchKeys={['name', 'phone', 'email']}
      detailPath="/customers/:id"
      tabs={['Active', 'Blocked']} panel={Panel}
      filters={[{ key: 'location', label: 'All Locations', icon: MapPin }, { key: 'status', label: 'All Status', icon: Tag }]}
      add={{
        label: 'Add Customer', fields: [['name', 'Full name'], ['phone', 'Phone'], ['email', 'Email', 'email'], ['location', 'Location']],
        make: (v) => ({ ...v, id: 'CU-' + (3200 + Math.floor(Math.random() * 800)), joined: formatDate(new Date(), false), status: 'Active', bookings: 0, spent: 0, rating: 0 }),
      }}
      stats={() => [
        { icon: Users, label: 'Total Customers', value: '3,420', change: '+8.1%', tint: 'red' },
        { icon: UserCheck, label: 'Active Customers', value: '3,284', change: '+8.9%', tint: 'green' },
        { icon: UserPlus, label: 'New (This Month)', value: '126', change: '+12.5%', tint: 'blue' },
        { icon: Ban, label: 'Blocked Customers', value: '10', change: '-9.1%', tint: 'purple' },
      ]}
      columns={[
        { h: '#', r: (r) => <b>{r.id}</b> },
        { h: 'Customer', r: (r) => <span className="flex items-center gap-3"><Avatar name={r.name} />{r.name}</span> },
        { h: 'Phone', r: (r) => r.phone },
        { h: 'Email', r: (r) => r.email },
        { h: 'Location', r: (r) => <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" />{r.location}</span> },
        { h: 'Joined On', r: (r) => r.joined },
        { h: 'Status', r: (r) => <Badge>{r.status}</Badge> },
        { h: 'Actions', r: (r, c) => <RowActions r={r} ctx={c} del={false} /> },
      ]}
    />
  );
}
