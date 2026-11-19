export const PageHeader = ({ title, sub, children }) => (
  <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
    <div><h1 className="text-2xl font-extrabold tracking-tight">{title}</h1><p className="mt-1 text-sm text-slate-500">{sub}</p></div>
    <div className="flex gap-3">{children}</div>
  </div>
);

