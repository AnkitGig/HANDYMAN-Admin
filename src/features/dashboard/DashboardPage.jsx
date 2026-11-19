import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Users,
  Share2,
  Wallet,
  ChevronDown,
  BarChart2,
  Layers,
  Clock,
  Tag,
  ArrowUp
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card } from '../../components/ui/Card';
import { mock } from '../../services/api';
import { formatCurrency } from '../../utils/formatCurrency';

const { bookings, trend, statusSplit, topCats } = mock;

// Sparkline data
const spark1 = [{ v: 8 }, { v: 14 }, { v: 12 }, { v: 18 }, { v: 15 }, { v: 24 }, { v: 20 }, { v: 28 }];
const spark2 = [{ v: 10 }, { v: 16 }, { v: 13 }, { v: 20 }, { v: 17 }, { v: 24 }, { v: 22 }, { v: 26 }];
const spark3 = [{ v: 8 }, { v: 12 }, { v: 15 }, { v: 14 }, { v: 20 }, { v: 18 }, { v: 25 }];
const spark4 = [{ v: 12 }, { v: 15 }, { v: 18 }, { v: 16 }, { v: 22 }, { v: 20 }, { v: 28 }];

export default function Dashboard() {
  const [metric, setMetric] = useState('bookings');
  const total = statusSplit.reduce((a, s) => a + s.value, 0);

  // Status badge styling matching the screenshot
  const statusBadge = (st) => {
    switch (st) {
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
            <i className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            In Progress
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
            <i className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Completed
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
            <i className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Scheduled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            <i className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            {st}
          </span>
        );
    }
  };

  // Avatar colors matching screenshot
  const avatarColors = {
    'Rohit Sharma': { bg: 'bg-rose-500', text: 'RS' },
    'Priya Verma': { bg: 'bg-purple-500', text: 'PV' },
    'Amit Singh': { bg: 'bg-amber-500', text: 'AS' },
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ---------------- WELCOME BANNER & DATE FILTER ---------------- */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Welcome back, Admin 👋
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-400">
            Here's what's happening with ServEase today.
          </p>
        </div>

        {/* Date Filter Dropdown Button */}
        <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50">
          <CalendarDays size={16} className="text-[#ef4444]" />
          <span>Last 30 Days</span>
          <ChevronDown size={14} className="text-slate-400" />
        </button>
      </div>

      {/* ---------------- ROW 1: 4 STAT CARDS ---------------- */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Card 1: Total Bookings (HIGHLIGHTED RED GRADIENT) */}
        <div className="relative flex items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-[#ef4444] via-[#f43f5e] to-[#fb7185] p-5 text-white shadow-lg shadow-red-500/20">
          <div className="relative z-10 flex flex-col justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 border border-white/30 text-white backdrop-blur-xs shadow-xs">
              <CalendarDays size={20} />
            </span>
            <div className="mt-3">
              <p className="text-xs font-semibold text-white/90">Total Bookings</p>
              <p className="mt-0.5 text-2xl font-black tracking-tight text-white">1,248</p>
              <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-white/25 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-xs">
                <span>↑ +12.5%</span>
              </div>
            </div>
          </div>

          {/* Sparkline Curve */}
          <div className="h-16 w-32 shrink-0 self-end">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spark1} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="whiteGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="#ffffff"
                  strokeWidth={2.5}
                  fill="url(#whiteGlow)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Customers */}
        <Card className="flex items-center justify-between p-5 relative overflow-hidden">
          <div className="relative z-10">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-[#ef4444]">
              <Users size={20} />
            </span>
            <div className="mt-3">
              <p className="text-xs font-semibold text-slate-500">Customers</p>
              <p className="mt-0.5 text-2xl font-black tracking-tight text-slate-900">3,420</p>
              <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <span>↑ +8.1%</span>
              </div>
            </div>
          </div>

          {/* Sparkline Curve */}
          <div className="h-16 w-28 shrink-0 self-end">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spark2} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="pinkGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#pinkGlow)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Card 3: Service Providers */}
        <Card className="flex items-center justify-between p-5 relative overflow-hidden">
          <div className="relative z-10">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-[#ef4444]">
              <Share2 size={20} />
            </span>
            <div className="mt-3">
              <p className="text-xs font-semibold text-slate-500">Service Providers</p>
              <p className="mt-0.5 text-2xl font-black tracking-tight text-slate-900">427</p>
              <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <span>↑ +6.3%</span>
              </div>
            </div>
          </div>

          {/* Sparkline Curve */}
          <div className="h-16 w-28 shrink-0 self-end">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spark3} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#pinkGlow)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Card 4: Total Revenue */}
        <Card className="flex items-center justify-between p-5 relative overflow-hidden">
          <div className="relative z-10">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-[#ef4444]">
              <Wallet size={20} />
            </span>
            <div className="mt-3">
              <p className="text-xs font-semibold text-slate-500">Total Revenue</p>
              <p className="mt-0.5 text-2xl font-black tracking-tight text-slate-900">
                QAR 1,248,320
              </p>
              <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <span>↑ +18.9%</span>
              </div>
            </div>
          </div>

          {/* Sparkline Curve */}
          <div className="h-16 w-28 shrink-0 self-end">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spark4} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#pinkGlow)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ---------------- ROW 2: 2 CHARTS SIDE-BY-SIDE ---------------- */}
      <div className="grid gap-5 xl:grid-cols-[1.75fr_1fr]">
        {/* Left Chart: Bookings Overview */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 size={19} className="text-[#ef4444]" />
              <h3 className="text-base font-extrabold text-slate-900">Bookings Overview</h3>
            </div>

            {/* Metric Toggle Pill */}
            <div className="inline-flex rounded-full bg-slate-100 p-0.5 text-xs font-bold">
              <button
                onClick={() => setMetric('bookings')}
                className={`rounded-full px-4 py-1 transition-all ${
                  metric === 'bookings'
                    ? 'bg-[#ef4444] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setMetric('revenue')}
                className={`rounded-full px-4 py-1 transition-all ${
                  metric === 'revenue'
                    ? 'bg-[#ef4444] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Revenue
              </button>
            </div>
          </div>

          {/* Area Chart */}
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3 3" />
                <XAxis
                  dataKey="d"
                  interval={3}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  ticks={metric === 'bookings' ? [0, 55, 110, 165, 220] : undefined}
                  domain={metric === 'bookings' ? [0, 220] : undefined}
                  tickFormatter={(v) => (metric === 'revenue' ? v / 1000 + 'k' : v)}
                />
                <Tooltip
                  formatter={(v) => (metric === 'revenue' ? formatCurrency(v) : v)}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                    border: '1px solid #f1f5f9',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={metric}
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  fill="url(#areaGradient)"
                  dot={{ r: 3.5, fill: '#ef4444', stroke: '#ffffff', strokeWidth: 1.5 }}
                  activeDot={{ r: 5, fill: '#ef4444', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Right Chart: Bookings by Status */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="mb-2 flex items-center gap-2">
            <Layers size={19} className="text-[#ef4444]" />
            <h3 className="text-base font-extrabold text-slate-900">Bookings by Status</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
            {/* Donut */}
            <div className="relative h-44 w-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusSplit}
                    dataKey="value"
                    innerRadius={54}
                    outerRadius={80}
                    paddingAngle={1.5}
                    stroke="none"
                  >
                    {statusSplit.map((s) => (
                      <Cell key={s.name} fill={s.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  {total.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-semibold text-slate-400">Total</span>
              </div>
            </div>

            {/* Legend List */}
            <ul className="min-w-[170px] flex-1 space-y-2 text-xs">
              {statusSplit.map((s) => (
                <li key={s.name} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: s.color }}
                    />
                    <span className="font-medium text-slate-700">{s.name}</span>
                  </span>
                  <span className="font-bold text-slate-900">
                    {s.value}{' '}
                    <span className="font-medium text-slate-400">
                      ({((s.value / total) * 100).toFixed(1)}%)
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* ---------------- ROW 3: RECENT BOOKINGS & TOP CATEGORIES ---------------- */}
      <div className="grid gap-5 xl:grid-cols-[1.75fr_1fr]">
        {/* Left: Recent Bookings Table */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={19} className="text-[#ef4444]" />
              <h3 className="text-base font-extrabold text-slate-900">Recent Bookings</h3>
            </div>
            <Link
              to="/bookings"
              className="text-xs font-bold text-[#ef4444] hover:underline"
            >
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 pr-4 font-bold">#</th>
                  <th className="pb-3 pr-4 font-bold">Customer</th>
                  <th className="pb-3 pr-4 font-bold">Service</th>
                  <th className="pb-3 pr-4 font-bold">Provider</th>
                  <th className="pb-3 pr-4 font-bold">Amount</th>
                  <th className="pb-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.slice(0, 3).map((b) => {
                  const avatar = avatarColors[b.customer] || {
                    bg: 'bg-rose-500',
                    text: b.customer.slice(0, 2).toUpperCase(),
                  };

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 pr-4 font-bold text-slate-900">{b.id}</td>
                      <td className="py-3.5 pr-4">
                        <span className="flex items-center gap-2.5">
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${avatar.bg} text-[11px] font-bold text-white`}
                          >
                            {avatar.text}
                          </span>
                          <span className="font-bold text-slate-800">{b.customer}</span>
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-slate-600 font-medium">{b.service}</td>
                      <td className="py-3.5 pr-4 text-slate-600 font-medium">{b.provider}</td>
                      <td className="py-3.5 pr-4 font-extrabold text-slate-900">
                        {formatCurrency(b.amount)}
                      </td>
                      <td className="py-3.5">{statusBadge(b.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right: Top Service Categories */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag size={19} className="text-[#ef4444]" />
              <h3 className="text-base font-extrabold text-slate-900">Top Service Categories</h3>
            </div>
            <Link
              to="/categories"
              className="text-xs font-bold text-[#ef4444] hover:underline"
            >
              View All →
            </Link>
          </div>

          <ul className="space-y-4">
            {topCats.map(([n, p]) => (
              <li key={n} className="flex items-center gap-3 text-xs">
                <span className="w-36 shrink-0 font-semibold text-slate-700 truncate">{n}</span>
                <span className="h-2 flex-1 rounded-full bg-slate-100">
                  <span
                    className="block h-2 rounded-full bg-[#ef4444] transition-all"
                    style={{ width: `${(p / 28) * 100}%` }}
                  />
                </span>
                <b className="w-10 text-right font-extrabold text-slate-900">{p}%</b>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
