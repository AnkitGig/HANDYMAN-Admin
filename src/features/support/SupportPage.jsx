import { Headphones, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { ListPage, RowActions } from '../../components/common/ListPage';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';


export default function Support() {
  return (
    <ListPage
      title="Support" sub="Respond to customer and provider support tickets." noun="tickets" file="tickets" panelTitle="Ticket Details"
      resource="tickets" tabs={['Open', 'In Progress', 'Resolved']} searchPh="Search by ticket ID, subject or user..." searchKeys={['id', 'subject', 'user']}
      filters={[{ key: 'priority', label: 'All Priorities', icon: AlertCircle }]}
      stats={(rows) => [
        { icon: Headphones, label: 'Total Tickets', value: rows.length, change: '+4.2%', tint: 'blue' },
        { icon: AlertCircle, label: 'Open', value: rows.filter((r) => r.status === 'Open').length, change: '+3.0%', tint: 'red' },
        { icon: Clock, label: 'In Progress', value: rows.filter((r) => r.status === 'In Progress').length, change: '-2.1%', tint: 'amber' },
        { icon: CheckCircle2, label: 'Resolved', value: rows.filter((r) => r.status === 'Resolved').length, change: '+9.8%', tint: 'green' },
      ]}
      columns={[
        { h: 'Ticket', r: (r) => <b>{r.id}</b> },
        { h: 'Subject', r: (r) => r.subject },
        { h: 'User', r: (r) => <span className="flex items-center gap-3"><Avatar name={r.user} />{r.user}</span> },
        { h: 'Priority', r: (r) => <Badge>{r.priority}</Badge> },
        { h: 'Status', r: (r) => <Badge>{r.status}</Badge> },
        { h: 'Date', r: (r) => r.date },
        { h: 'Actions', r: (r, c) => <RowActions r={r} ctx={c} edit={false} /> },
      ]}
    />
  );
}
