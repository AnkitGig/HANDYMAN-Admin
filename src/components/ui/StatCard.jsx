import { ArrowUp, ArrowDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Card } from './Card';

const TINT = { red: 'bg-red-50 text-red-500', green: 'bg-green-50 text-green-600', blue: 'bg-blue-50 text-blue-500', purple: 'bg-purple-50 text-purple-500', amber: 'bg-amber-50 text-amber-500' };
const SPARK = { red: '#ef4444', green: '#22a559', blue: '#3b82f6', purple: '#a855f7', amber: '#f59e0b' };
export function StatCard({ icon: Icon, label, value, change, tint = 'red', spark }) {
  const up = !String(change).startsWith('-');
  const data = Array.from({ length: 12 }, (_, i) => ({ v: 10 + i * (up ? 1.4 : 0.4) + 4 * Math.sin(i * 1.3 + label.length) }));
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${TINT[tint]}`}><Icon size={22} /></span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <p className="text-2xl font-extrabold tracking-tight">{value}</p>
        <p className={`flex items-center gap-1 text-sm font-semibold ${up ? 'text-green-600' : 'text-red-600'}`}>
          {up ? <ArrowUp size={14} /> : <ArrowDown size={14} />}{String(change).replace(/^[+-]/, up ? '+' : '-')}
        </p>
      </div>
      {spark && (
        <div className="h-14 w-24 shrink-0 self-end">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}><Area type="monotone" dataKey="v" stroke={SPARK[tint]} fill={SPARK[tint]} fillOpacity={0.12} strokeWidth={2} /></AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

