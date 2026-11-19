const HUES = ['#f97316', '#0ea5e9', '#8b5cf6', '#10b981', '#ec4899', '#eab308', '#6366f1', '#14b8a6'];
export const Avatar = ({ name, size = 36 }) => (
  <span className="inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white"
    style={{ width: size, height: size, fontSize: size * 0.38, background: HUES[(name.charCodeAt(0) + name.length) % 8] }}>
    {name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
  </span>
);

