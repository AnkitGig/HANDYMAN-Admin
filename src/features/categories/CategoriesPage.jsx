import { useState } from 'react';
import { LayoutGrid, CheckCircle2, Ban, Layers, Tag, Home, Snowflake, Wrench, Zap, Tv, Hammer, PaintRoller, Car, Save, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { ListPage, RowActions } from '../../components/common/ListPage';
import { Badge } from '../../components/ui/Badge';


const ICONS = { home: Home, ac: Snowflake, plumb: Wrench, elec: Zap, appl: Tv, carp: Hammer, paint: PaintRoller, car: Car };
const COLORS = { home: 'bg-red-50 text-red-500', ac: 'bg-blue-50 text-blue-500', plumb: 'bg-purple-50 text-purple-500', elec: 'bg-amber-50 text-amber-500', appl: 'bg-sky-50 text-sky-600', carp: 'bg-rose-50 text-rose-500', paint: 'bg-violet-50 text-violet-500', car: 'bg-green-50 text-green-600' };
const Ico = ({ k, size = 20 }) => { const I = ICONS[k] || Home; return <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${COLORS[k]}`}><I size={size} /></span>; };

function Panel({ row, ctx }) {
  const [f, setF] = useState(row);
  const set = (p) => setF({ ...f, ...p });
  return (
    <div className="space-y-4">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-red-50 text-brand">{(() => { const I = ICONS[f.icon] || Home; return <I size={46} />; })()}</div>
      <label className="block text-sm font-bold">Category Name *<input className="field mt-1.5 font-normal" value={f.name} onChange={(e) => set({ name: e.target.value })} /></label>
      <label className="block text-sm font-bold">Description<textarea rows={3} className="field mt-1.5 font-normal" value={f.description} onChange={(e) => set({ description: e.target.value })} /></label>
      <div><p className="mb-2 text-sm font-bold">Icon</p>
        <div className="flex flex-wrap gap-2">{Object.keys(ICONS).slice(0, 6).map((k) => (
          <button key={k} onClick={() => set({ icon: k })} className={`rounded-xl border p-1.5 ${f.icon === k ? 'border-brand' : 'border-slate-200'}`}><Ico k={k} /></button>))}</div></div>
      <div><p className="mb-2 text-sm font-bold">Status</p>
        <button onClick={() => set({ status: f.status === 'Active' ? 'Inactive' : 'Active' })} className="flex items-center gap-3 text-sm font-medium">
          <span className={`relative h-6 w-11 rounded-full transition ${f.status === 'Active' ? 'bg-green-500' : 'bg-slate-300'}`}>
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${f.status === 'Active' ? 'left-[22px]' : 'left-0.5'}`} /></span>{f.status}</button></div>
      <button className="btn-primary w-full" onClick={() => ctx.update(row.id, f)}><Save size={16} />Update Category</button>
      <button className="btn-danger w-full" onClick={() => ctx.confirm('Delete this category?', () => ctx.remove(row.id))}><Trash2 size={16} />Delete Category</button>
    </div>
  );
}

export default function Categories() {
  return (
    <ListPage
      title="Service Categories" sub="Create and manage service categories and their details." noun="categories" file="categories" panelTitle="Edit Category"
      resource="categories" searchPh="Search by category name..." searchKeys={['name']} tabs={['Active', 'Inactive']} panel={Panel}
      filters={[{ key: 'status', label: 'All Status', icon: Tag, options: ['Active', 'Inactive'] }]}
      add={{
        label: 'Add Category', fields: [['name', 'Category name'], ['description', 'Description']],
        make: (v, n) => ({ ...v, id: 'CAT-' + String(n + 1).padStart(3, '0'), icon: 'home', services: 0, status: 'Active', created: formatDate(new Date(), false) }),
      }}
      stats={() => [
        { icon: LayoutGrid, label: 'Total Categories', value: '28', change: '+12.0%', tint: 'red' },
        { icon: CheckCircle2, label: 'Active', value: '26', change: '+13.0%', tint: 'green' },
        { icon: Ban, label: 'Inactive', value: '2', change: '-33.3%', tint: 'purple' },
        { icon: Layers, label: 'Total Services', value: '142', change: '+18.3%', tint: 'blue' },
      ]}
      columns={[
        { h: '#', r: (r) => <b>{r.id}</b> },
        { h: 'Category', r: (r) => <span className="flex items-center gap-3"><Ico k={r.icon} />{r.name}</span> },
        { h: 'Total Services', r: (r) => r.services },
        { h: 'Status', r: (r) => <Badge>{r.status}</Badge> },
        { h: 'Created On', r: (r) => r.created },
        { h: 'Actions', r: (r, c) => <RowActions r={r} ctx={c} /> },
      ]}
    />
  );
}
