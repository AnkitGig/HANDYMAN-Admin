import { ChevronDown } from 'lucide-react';

export const Select = ({ icon: Icon, label, value, onChange, options }) => (
  <div className="relative">
    {Icon && <Icon size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />}
    <select value={value || ''} onChange={(e) => onChange(e.target.value)}
      className={`field appearance-none pr-9 font-medium ${Icon ? 'pl-9' : ''}`}>
      <option value="">{label}</option>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
  </div>
);

