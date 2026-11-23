import { useState, useEffect } from 'react';
import { Search, Download, Plus, X, Eye, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Modal } from '../ui/Modal';
import { Table } from '../ui/Table';
import { Pagination } from '../ui/Pagination';
import { Tabs } from '../ui/Tabs';
import { Card } from '../ui/Card';
import { PageHeader } from '../ui/PageHeader';
import { StatCard } from '../ui/StatCard';
import { Loader } from './Loader';
import { EmptyState } from './EmptyState';
import { ConfirmDialog } from './ConfirmDialog';

const PER_PAGE = 8;

const csv = (rows, name) => {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]).filter((k) => typeof rows[0][k] !== 'object');
  const body = rows.map((r) => keys.map((k) => `"${String(r[k]).replace(/"/g, '""')}"`).join(','));
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([[keys.join(','), ...body].join('\n')], { type: 'text/csv' }));
  a.download = name + '.csv'; a.click(); URL.revokeObjectURL(a.href);
};


export function RowActions({ r, ctx, edit = true, del = true, extra }) {
  const navigate = useNavigate();
  const b = 'text-slate-500 hover:text-slate-900';
  const handleView = () => {
    if (ctx.detailPath) {
      navigate(ctx.detailPath.replace(':id', r.id));
    } else {
      ctx.open(r);
    }
  };
  return (
    <div className="flex items-center gap-2.5">
      {extra && extra(r, ctx)}
      <button className={b} aria-label="View" title="View details" onClick={handleView}><Eye size={16} /></button>
      {edit && <button className={b} aria-label="Edit" title="Edit" onClick={() => ctx.open(r)}><Pencil size={15} /></button>}
      {del && <button className="text-brand hover:text-brand-dark" aria-label="Delete" title="Delete"
        onClick={() => ctx.confirm('Delete this record?', () => ctx.remove(r.id))}><Trash2 size={15} /></button>}
    </div>
  );
}


/* Fallback detail panel: shows every field + status dropdown */
export function DefaultPanel({ row, ctx }) {
  const rows = Object.entries(row).filter(([k, v]) => typeof v !== 'object' && k !== 'sentiment');
  return (
    <div className="space-y-3 text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 border-b border-slate-100 pb-2">
          <span className="capitalize text-slate-500">{k}</span><span className="text-right font-semibold">{String(v)}</span>
        </div>
      ))}
      {row.status && ctx.statuses?.length > 0 && (
        <select className="field" value={row.status} onChange={(e) => ctx.update(row.id, { status: e.target.value })}>
          {ctx.statuses.map((s) => <option key={s}>{s}</option>)}
        </select>
      )}
    </div>
  );
}


export function ListPage({
  title, sub, stats, tabKey = 'status', tabs = [], searchPh, searchKeys, filters = [], columns, resource,
  noun, add, panel: PanelComponent = DefaultPanel, panelTitle = 'Details', file, detailPath,
  children,
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [tab, setTab] = useState('All');
  const [q, setQ] = useState('');
  const [f, setF] = useState({});
  const dq = useDebounce(q, 300);
  const [selId, setSelId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({});

  const list = rows.filter((r) =>
    (tab === 'All' || r[tabKey] === tab) &&
    (!dq || searchKeys.some((k) => String(r[k]).toLowerCase().includes(dq.toLowerCase()))) &&
    filters.every((x) => !f[x.key] || String(r[x.key]) === f[x.key]));
  const { page: cur, setPage, pages, range } = usePagination(list.length, PER_PAGE);
  const view = list.slice(range[0], range[1]);
  useEffect(() => {
    let on = true;
    api.list(resource).then((d) => on && setRows(d)).catch((e) => on && setError(e.message)).finally(() => on && setLoading(false));
    return () => { on = false; };
  }, [resource]);
  const sel = rows.find((r) => r.id === selId);
  const cap = noun[0].toUpperCase() + noun.slice(1);

  const ctx = {
    statuses: tabs, detailPath, confirm: (message, onYes) => setConfirm({ message, onYes }), open: (r) => setSelId(r.id), close: () => setSelId(null),
    update: (id, patch) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r))),
    remove: (id) => { setRows((rs) => rs.filter((r) => r.id !== id)); setSelId(null); },
  };
  const reset = () => { setQ(''); setF({}); setTab('All'); setPage(1); };

  return (
    <div className="flex items-start gap-5">
      <div className="min-w-0 flex-1">
        <PageHeader title={title} sub={sub}>
          <Button variant="light" onClick={() => csv(list, file || noun)}><Download size={16} />Export</Button>
          {add && <Button onClick={() => { setForm({}); setAdding(true); }}><Plus size={16} />{add.label}</Button>}
        </PageHeader>

        {stats && <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{stats(rows).map((s) => <StatCard key={s.label} {...s} />)}</div>}

        <Tabs value={tab} onChange={(t) => { setTab(t); setPage(1); }}
          tabs={[['All', `All ${cap} (${rows.length})`], ...tabs.map((t) => [t, `${t} (${rows.filter((r) => r[tabKey] === t).length})`])]} />

        <Card>
          <div className="flex flex-wrap gap-2.5 border-b border-slate-200 p-3">
            <div className="relative min-w-[200px] flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="field pl-9" placeholder={searchPh} value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
            </div>
            {filters.map((x) => (
              <div key={x.key} className="min-w-[140px]">
                <Select icon={x.icon} label={x.label} value={f[x.key]} options={x.options || [...new Set(rows.map((r) => r[x.key]).filter(Boolean))]}
                  onChange={(v) => { setF({ ...f, [x.key]: v }); setPage(1); }} />
              </div>
            ))}
            <button className="btn-light" onClick={reset}>Reset</button>
          </div>

          {loading ? <Loader /> : error ? <p className="py-14 text-center text-red-600">{error}</p> : (
            <Table columns={columns} rows={view} ctx={ctx} selectedId={selId} empty={<EmptyState noun={noun} />} />
          )}
          <Pagination page={cur} pages={pages} total={list.length} perPage={PER_PAGE} noun={noun} onChange={setPage} />
        </Card>
      </div>

      {sel && (
        <aside className="fixed inset-y-0 right-0 z-40 w-full max-w-sm overflow-y-auto border-l border-slate-100 bg-white p-5 shadow-2xl xl:sticky xl:top-20 xl:z-0 xl:max-h-[calc(100vh-6rem)] xl:w-[320px] xl:max-w-none xl:shrink-0 xl:rounded-2xl xl:border xl:shadow-card">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-extrabold">{panelTitle}</h2>
            <button onClick={ctx.close} aria-label="Close"><X size={20} /></button>
          </div>
          <div>
            <PanelComponent key={sel.id} row={sel} ctx={ctx} />
          </div>
        </aside>
      )}

      {adding && add && (
        <Modal title={add.label} onClose={() => setAdding(false)}>
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); const r = add.make(form, rows.length); setRows([r, ...rows]); setAdding(false); }}>
            {add.fields.map(([k, label, type]) => (
              <Input key={k} required label={label} type={type || 'text'} value={form[k] || ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
            ))}
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="light" onClick={() => setAdding(false)}>Cancel</Button>
              <Button>Save</Button>
            </div>
          </form>
        </Modal>
      )}
    {confirm && <ConfirmDialog message={confirm.message} onCancel={() => setConfirm(null)} onConfirm={() => { confirm.onYes(); setConfirm(null); }} />}
    {children}
    </div>
  );
}
