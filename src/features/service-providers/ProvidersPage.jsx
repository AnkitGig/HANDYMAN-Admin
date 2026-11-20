import { Users, CheckCircle2, Clock, Ban, Star, MapPin, Layers, Tag } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { ListPage, RowActions } from '../../components/common/ListPage';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';


export default function Providers() {
  return (
    <ListPage
      title="Service Providers" sub="Manage, verify, and monitor all plumbers, electricians, and technicians." noun="providers" file="providers"
      resource="providers" searchPh="Search by technician name, profession, phone, or location..." searchKeys={['name', 'profession', 'service', 'phone', 'location', 'id']}
      tabs={['Active', 'Pending', 'Suspended']}
      filters={[
        { key: 'service', label: 'All Categories', icon: Layers }, { key: 'location', label: 'All Locations', icon: MapPin },
        { key: 'status', label: 'All Status', icon: Tag },
      ]}
      add={{
        label: 'Add Provider', fields: [['name', 'Technician name'], ['profession', 'Profession / Specialty (e.g. Plumber)'], ['service', 'Service category'], ['phone', 'Phone number'], ['location', 'Location']],
        make: (v) => ({ ...v, id: 'SP-' + (1100 + Math.floor(Math.random() * 900)), rating: 5.0, reviews: 0, joined: formatDate(new Date(), false), status: 'Pending', business: v.profession }),
      }}
      stats={() => [
        { icon: Users, label: 'Total Technicians', value: '427', change: '+6.3%', tint: 'blue' },
        { icon: CheckCircle2, label: 'Active', value: '384', change: '+8.9%', tint: 'green' },
        { icon: Clock, label: 'Pending Approval', value: '28', change: '-12.5%', tint: 'purple' },
        { icon: Ban, label: 'Suspended', value: '15', change: '+7.1%', tint: 'red' },
      ]}
      columns={[
        { h: '#', r: (r) => <b>{r.id}</b> },
        { h: 'Technician', r: (r) => (
          <span className="flex items-center gap-3"><Avatar name={r.name} size={40} />
            <span className="leading-tight"><b className="block text-slate-900">{r.name}</b>
              <span className="flex items-center gap-1 text-xs text-slate-500"><Star size={12} className="fill-amber-400 text-amber-400" />{r.rating} ({r.reviews} jobs)</span></span></span>) },
        { h: 'Profession / Trade', r: (r) => <span className="font-semibold text-slate-800">{r.profession || r.business}</span> },
        { h: 'Category', r: (r) => <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold">{r.service}</span> },
        { h: 'Phone', r: (r) => <span className="text-xs font-medium text-slate-600">{r.phone}</span> },
        { h: 'Location', r: (r) => r.location },
        { h: 'Status', r: (r) => <Badge>{r.status}</Badge> },
        { h: 'Actions', r: (r, c) => <RowActions r={r} ctx={c} /> },
      ]}
    />
  );
}
