import { Inbox } from 'lucide-react';

export const EmptyState = ({ noun = 'records' }) => (
  <div className="flex flex-col items-center gap-2 py-10 text-slate-400"><Inbox size={34} /><p>No {noun} found.</p></div>
);
