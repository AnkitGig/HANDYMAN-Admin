export const Card = ({ className = '', children }) => (
  <div className={`rounded-xl border border-slate-200/90 bg-white shadow-xs ${className}`}>{children}</div>
);
