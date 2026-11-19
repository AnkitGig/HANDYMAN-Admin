import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Layers, Tag, Wrench, CalendarDays, CheckCircle2, Trash2 } from 'lucide-react';
import { ListPage, RowActions } from '../../components/common/ListPage';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Stars } from '../../components/ui/Stars';


function Panel({ row: r, ctx }) {
  const [status, setStatus] = useState(r.status);
  return (
    <div>
      <div className="flex items-center gap-3"><Avatar name={r.customer} size={56} />
        <div><p className="text-lg font-extrabold">{r.customer}</p><span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold">{r.booking}</span></div></div>
      <p className="mt-4 flex items-center gap-2"><Stars value={r.rating} size={20} /><b className="text-lg">{r.rating}.0</b></p>
      <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed">{r.text}</p>
      <div className="my-5 space-y-3 border-b border-slate-100 pb-5 text-sm">
        {[[Wrench, 'Provider', r.provider], [Layers, 'Service', r.service], [CalendarDays, 'Date', r.date]].map(([I, l, v]) => (
          <p key={l} className="flex items-center gap-3"><I size={17} className="text-slate-500" /><span className="flex-1">{l}</span><b className={l === 'Provider' ? 'text-brand' : ''}>{v}</b></p>))}
      </div>
      <label className="text-sm font-bold">Review Status
        <select className="field mt-2 font-normal" value={status} onChange={(e) => setStatus(e.target.value)}><option>Published</option><option>Hidden</option></select></label>
      <button className="btn-primary mt-4 w-full" onClick={() => ctx.update(r.id, { status })}><CheckCircle2 size={16} />Update Status</button>
      <button className="btn-danger mt-3 w-full" onClick={() => ctx.confirm('Delete this review?', () => ctx.remove(r.id))}><Trash2 size={16} />Delete Review</button>
    </div>
  );
}

export default function Reviews() {
  return (
    <ListPage
      title="Customer Reviews" sub="View and manage customer reviews and ratings for providers and services." noun="reviews" file="reviews" panelTitle="Review Details"
      resource="reviews" tabKey="sentiment" tabs={['Positive', 'Neutral', 'Negative']} panel={Panel}
      searchPh="Search by customer, provider, or booking ID..." searchKeys={['customer', 'provider', 'booking']}
      filters={[{ key: 'rating', label: 'All Ratings', icon: Star, options: [1, 2, 3, 4, 5] }, { key: 'service', label: 'All Services', icon: Layers }]}
      stats={() => [
        { icon: Star, label: 'Total Reviews', value: '2,846', change: '+18.6%', tint: 'red' },
        { icon: Star, label: 'Average Rating', value: '4.7 / 5', change: '+0.2', tint: 'amber' },
        { icon: ThumbsUp, label: 'Positive (4–5★)', value: '2,624', change: '+92.2%', tint: 'green' },
        { icon: ThumbsDown, label: 'Negative (1–2★)', value: '222', change: '-7.8%', tint: 'red' },
      ]}
      columns={[
        { h: '#', r: (r) => <b>{r.id.slice(-2)}</b> },
        { h: 'Customer', r: (r) => <span className="flex items-center gap-3"><Avatar name={r.customer} /><span className="leading-tight"><b className="block">{r.customer}</b><span className="text-xs text-slate-500">{r.booking}</span></span></span> },
        { h: 'Provider', r: (r) => r.provider },
        { h: 'Service', r: (r) => r.service },
        { h: 'Rating', r: (r) => <span className="flex items-center gap-2"><Stars value={r.rating} /><b>{r.rating}.0</b></span> },
        { h: 'Review', r: (r) => <span className="inline-block max-w-[180px] truncate align-middle">{r.text}</span> },
        { h: 'Date', r: (r) => r.date },
        { h: 'Status', r: (r) => <Badge>{r.status}</Badge> },
        { h: 'Actions', r: (r, c) => <RowActions r={r} ctx={c} edit={false} del={false} /> },
      ]}
    />
  );
}
