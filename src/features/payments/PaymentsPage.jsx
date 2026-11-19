import { Wallet, CreditCard, RefreshCw, PieChart, Eye, Layers, Tag, Landmark, Smartphone } from 'lucide-react';
import { ListPage } from '../../components/common/ListPage';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatCurrency';

const METHOD = { UPI: Smartphone, Card: CreditCard, Wallet: Wallet, Bank: Landmark };

export default function Payments() {
  return (
    <ListPage
      title="Payments & Transactions" sub="Track all payments, payouts and transaction details." noun="transactions" file="transactions"
      resource="payments" tabKey="type" searchPh="Search by transaction ID, booking ID, or customer..." searchKeys={['id', 'booking', 'party']}
      tabs={['Payment', 'Payout']}
      filters={[
        { key: 'type', label: 'All Types', icon: Layers }, { key: 'status', label: 'All Status', icon: Tag },
        { key: 'method', label: 'All Methods', icon: CreditCard },
      ]}
      stats={() => [
        { icon: Wallet, label: 'Total Revenue', value: '₹12,48,320', change: '+18.9%', tint: 'green' },
        { icon: CreditCard, label: 'Total Payments', value: '1,248', change: '+12.5%', tint: 'blue' },
        { icon: RefreshCw, label: 'Provider Payouts', value: '₹9,62,480', change: '+17.2%', tint: 'purple' },
        { icon: PieChart, label: 'Platform Earnings', value: '₹2,85,840', change: '+24.6%', tint: 'red' },
      ]}
      columns={[
        { h: '#', r: (r, c) => <b>{r.id.slice(-2)}</b> },
        { h: 'Transaction ID', r: (r) => <b>{r.id}</b> },
        { h: 'Booking ID', r: (r) => r.booking },
        { h: 'Customer', r: (r) => <span className="flex items-center gap-3"><Avatar name={r.party} />{r.party}</span> },
        { h: 'Provider', r: (r) => r.provider },
        { h: 'Amount', r: (r) => <b>{formatCurrency(r.amount)}</b> },
        { h: 'Type', r: (r) => <Badge tone={r.type === 'Payout' ? 'purple' : 'green'}>{r.type}</Badge> },
        { h: 'Method', r: (r) => { const I = METHOD[r.method]; return <span className="flex items-center gap-2"><I size={16} className="text-slate-500" />{r.method}</span>; } },
        { h: 'Status', r: (r) => <Badge tone={r.type === 'Payout' ? 'blue' : 'green'}>{r.status}</Badge> },
        { h: 'Date & Time', r: (r) => r.date },
        { h: 'Actions', r: (r, c) => <button aria-label="View" onClick={() => c.open(r)}><Eye size={17} className="text-slate-500" /></button> },
      ]}
    />
  );
}
