const TONES = {
  green: 'bg-green-50 text-green-700 [&>i]:bg-green-500', blue: 'bg-blue-50 text-blue-600 [&>i]:bg-blue-500',
  yellow: 'bg-amber-50 text-amber-700 [&>i]:bg-amber-400', red: 'bg-red-50 text-red-600 [&>i]:bg-red-500',
  gray: 'bg-slate-100 text-slate-600 [&>i]:bg-slate-400', purple: 'bg-purple-50 text-purple-600 [&>i]:bg-purple-500',
};
export const STATUS_TONE = {
  Active: 'green', Completed: 'green', Successful: 'green', Published: 'green', Resolved: 'green', Verified: 'green',
  'In Progress': 'blue',
  Open: 'red', Scheduled: 'yellow', Pending: 'yellow', Medium: 'yellow',
  Cancelled: 'red', Suspended: 'red', Blocked: 'red', Inactive: 'red', High: 'red', Rejected: 'red',
  Refunded: 'gray', Hidden: 'gray', Low: 'gray', Neutral: 'gray',
};
export const Badge = ({ children, tone }) => (
  <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold ${TONES[tone || STATUS_TONE[children] || 'gray']}`}>
    <i className="h-1.5 w-1.5 rounded-full" />{children}
  </span>
);

