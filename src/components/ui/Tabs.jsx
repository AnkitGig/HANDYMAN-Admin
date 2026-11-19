export const Tabs = ({ tabs, value, onChange }) => (
  <div className="mb-4 flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xs">
    {tabs.map(([key, label]) => (
      <button
        key={key}
        onClick={() => onChange(key)}
        className={`whitespace-nowrap rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
          value === key
            ? 'bg-brand text-white shadow-xs'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);
