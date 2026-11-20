import { X } from 'lucide-react';

export const Modal = ({ title, onClose, children, maxWidth = 'max-w-md' }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
    <div className={`w-full ${maxWidth} rounded-2xl bg-white p-6 shadow-2xl max-h-[92vh] flex flex-col`} onClick={(e) => e.stopPropagation()}>
      <div className="mb-4 flex items-center justify-between shrink-0">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <button onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">
          <X size={20} />
        </button>
      </div>
      <div className="overflow-y-auto min-h-0 flex-1">
        {children}
      </div>
    </div>
  </div>
);

