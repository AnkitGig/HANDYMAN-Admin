import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ page, pages, total, perPage, noun, onChange }) {
  const set = [...new Set([1, pages, page - 1, page, page + 1].filter((n) => n >= 1 && n <= pages))].sort((a, b) => a - b);
  const items = set.flatMap((n, i) => (i && n - set[i - 1] > 1 ? ['…', n] : [n]));
  const btn = 'flex h-8 min-w-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-[13px] font-semibold disabled:opacity-40';
  const from = total ? (page - 1) * perPage + 1 : 0;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <p className="text-[13px] text-slate-500">Showing {from} to {Math.min(page * perPage, total)} of <b className="text-slate-700">{total.toLocaleString('en-IN')}</b> {noun}</p>
      <div className="flex items-center gap-2">
        <button className={btn} disabled={page === 1} onClick={() => onChange(page - 1)}><ChevronLeft size={16} /></button>
        {items.map((n, i) => n === '…' ? <span key={i} className="px-1 text-slate-400">…</span> :
          <button key={n} onClick={() => onChange(n)} className={`${btn} ${n === page ? '!border-brand !bg-brand text-white' : ''}`}>{n}</button>)}
        <button className={btn} disabled={page === pages} onClick={() => onChange(page + 1)}><ChevronRight size={16} /></button>
      </div>
    </div>
  );
}

