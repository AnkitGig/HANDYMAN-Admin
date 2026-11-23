export const PageHeader = ({ title, sub, children }) => (
  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
    <div><h1 className="text-xl font-extrabold tracking-tight">{title}</h1><p className="mt-0.5 text-[13px] text-slate-500">{sub}</p></div>
    <div className="flex gap-2">{children}</div>
  </div>
);

