import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';

const Toggle = ({ on, onChange }) => (
  <button type="button" onClick={() => onChange(!on)} className={`relative h-6 w-11 rounded-full transition ${on ? 'bg-green-500' : 'bg-slate-300'}`}>
    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} /></button>
);

export default function Settings() {
  const [s, setS] = useState({ name: 'ServEase', email: 'support@servease.com', phone: '+91 98765 43210', currency: 'INR', commission: 23, payout: 'Weekly', emailN: true, smsN: false, newBooking: true });
  const [saved, setSaved] = useState(false);
  const set = (p) => { setS({ ...s, ...p }); setSaved(false); };
  const In = ({ k, label, type = 'text' }) => <label className="block text-sm font-semibold">{label}<input type={type} className="field mt-1.5 font-normal" value={s[k]} onChange={(e) => set({ [k]: e.target.value })} /></label>;

  return (
    <>
      <PageHeader title="Settings" sub="Configure platform details, payments and notifications." />
      <form className="grid max-w-5xl gap-6 lg:grid-cols-2" onSubmit={(e) => { e.preventDefault(); setSaved(true); }}>
        <Card className="space-y-4 p-6"><h2 className="text-lg font-extrabold">General</h2>
          <In k="name" label="Platform name" /><In k="email" label="Support email" type="email" /><In k="phone" label="Support phone" /></Card>
        <Card className="space-y-4 p-6"><h2 className="text-lg font-extrabold">Payments</h2>
          <label className="block text-sm font-semibold">Currency
            <select className="field mt-1.5 font-normal" value={s.currency} onChange={(e) => set({ currency: e.target.value })}><option>INR</option><option>USD</option></select></label>
          <In k="commission" label="Platform commission (%)" type="number" />
          <label className="block text-sm font-semibold">Provider payout cycle
            <select className="field mt-1.5 font-normal" value={s.payout} onChange={(e) => set({ payout: e.target.value })}><option>Daily</option><option>Weekly</option><option>Monthly</option></select></label></Card>
        <Card className="space-y-4 p-6 lg:col-span-2"><h2 className="text-lg font-extrabold">Notifications</h2>
          {[['emailN', 'Email notifications'], ['smsN', 'SMS notifications'], ['newBooking', 'Alert on new booking']].map(([k, l]) => (
            <div key={k} className="flex items-center justify-between text-sm font-medium">{l}<Toggle on={s[k]} onChange={(v) => set({ [k]: v })} /></div>))}</Card>
        <div className="flex items-center gap-4"><button className="btn-primary">Save Changes</button>{saved && <span className="text-sm font-medium text-green-600">Saved (in memory only).</span>}</div>
      </form>
    </>
  );
}
