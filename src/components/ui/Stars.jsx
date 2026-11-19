import { Star } from 'lucide-react';

export const Stars = ({ value, size = 14 }) => (
  <span className="inline-flex">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star key={n} size={size} className={n <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
    ))}
  </span>
);

