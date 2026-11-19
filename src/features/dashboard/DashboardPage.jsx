import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Users, UserCog, Wallet, ChevronDown, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { mock } from '../../services/api';
import { formatCurrency } from '../../utils/formatCurrency';

const { bookings, trend, statusSplit, topCats } = mock;

export default function Dashboard() {
  const [metric, setMetric] = useState('bookings');
  const total = statusSplit.reduce((a, s) => a + s.value, 0);

  return (
    <>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div><h1 className="text-3xl font-extrabold tracking-tight">Welcome back, Admin 👋</h1>
          <p className="mt-1 text-slate-500">Here's what's happening with ServEase today.</p></div>
        <button className="btn-light">Last 30 Days <ChevronDown size={16} /></button>
      </div>

      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard spark icon={CalendarDays} label="Total Bookings" value="1,248" change="+12.5%" tint="red" />
        <StatCard spark icon={Users} label="Customers" value="3,420" change="+8.1%" tint="blue" />
        <StatCard spark icon={UserCog} label="Service Providers" value="427" change="+6.3%" tint="purple" />
        <StatCard spark icon={Wallet} label="Total Revenue" value="₹12,48,320" change="+18.9%" tint="green" />
      </div>

      <div className="mb-5 grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-extrabold">Bookings Overview</h3>
            <div className="flex rounded-lg border border-slate-200 p-0.5 text-sm font-semibold">
              {['bookings', 'revenue'].map((m) => (
                <button key={m} onClick={() => setMetric(m)} className={`rounded-md px-4 py-1.5 capitalize ${metric === m ? 'bg-brand text-white' : ''}`}>{m}</button>))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ left: -10, right: 10 }}>
                <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d9172d" stopOpacity={0.25} /><stop offset="100%" stopColor="#d9172d" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid vertical={false} stroke="#eef2f6" />
                <XAxis dataKey="d" interval={3} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => (metric === 'revenue' ? v / 1000 + 'k' : v)} />
                <Tooltip formatter={(v) => (metric === 'revenue' ? formatCurrency(v) : v)} />
                <Area type="monotone" dataKey={metric} stroke="#d9172d" strokeWidth={2.5} fill="url(#g)" dot={{ r: 3, fill: '#d9172d' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 text-lg font-extrabold">Bookings by Status</h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative h-44 w-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={statusSplit} dataKey="value" innerRadius={52} outerRadius={80} paddingAngle={1} stroke="none">
                  {statusSplit.map((s) => <Cell key={s.name} fill={s.color} />)}</Pie></PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><b className="text-xl">{total.toLocaleString('en-IN')}</b><span className="text-xs text-slate-500">Total</span></div>
            </div>
            <ul className="min-w-[180px] flex-1 space-y-2.5 text-sm">
              {statusSplit.map((s) => (
                <li key={s.name} className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="flex-1">{s.name}</span><b>{s.value}</b><span className="text-slate-500">({((s.value / total) * 100).toFixed(1)}%)</span></li>))}
            </ul>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        <Card>
          <div className="flex items-center justify-between p-5 pb-3"><h3 className="text-lg font-extrabold">Recent Bookings</h3>
            <Link to="/bookings" className="flex items-center gap-1 text-sm font-bold text-brand">View All <ArrowRight size={14} /></Link></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-sm">
            <thead><tr className="bg-slate-50 text-left text-slate-600">{['#', 'Customer', 'Service', 'Provider', 'Amount', 'Status'].map((h) => <th key={h} className="px-4 py-3 font-bold">{h}</th>)}</tr></thead>
            <tbody>{bookings.slice(0, 5).map((b) => (
              <tr key={b.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-bold">{b.id}</td>
                <td className="px-4 py-3"><span className="flex items-center gap-2.5"><Avatar name={b.customer} size={32} />{b.customer}</span></td>
                <td className="px-4 py-3">{b.service}</td><td className="px-4 py-3">{b.provider}</td>
                <td className="px-4 py-3">{formatCurrency(b.amount)}</td><td className="px-4 py-3"><Badge>{b.status}</Badge></td>
              </tr>))}</tbody></table></div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-extrabold">Top Service Categories</h3>
            <Link to="/categories" className="flex items-center gap-1 text-sm font-bold text-brand">View All <ArrowRight size={14} /></Link></div>
          <ul className="space-y-4">{topCats.map(([n, p]) => (
            <li key={n} className="flex items-center gap-3 text-sm"><span className="w-40 shrink-0 font-medium">{n}</span>
              <span className="h-2 flex-1 rounded-full bg-slate-100"><span className="block h-2 rounded-full bg-brand" style={{ width: p * 3.2 + '%' }} /></span>
              <b className="w-10 text-right">{p}%</b></li>))}</ul>
        </Card>
      </div>
    </>
  );
}
