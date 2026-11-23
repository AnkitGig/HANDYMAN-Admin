import { ChevronDown } from 'lucide-react';

export const Select = ({ icon: Icon, label, value, onChange, options }) => (
  <div className="relative">
    {Icon && <Icon size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />}
    <select value={value || ''} onChange={(e) => onChange(e.target.value)}
      style={Icon ? { paddingLeft: '2.5rem' } : undefined}
      className="field appearance-none pr-8 font-medium">
      <option value="">{label}</option>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
  </div>
);

