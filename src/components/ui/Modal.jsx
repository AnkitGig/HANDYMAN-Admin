import { X } from 'lucide-react';

export const Modal = ({ title, onClose, children, maxWidth = 'max-w-md' }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 sm:p-6" onClick={onClose}>
    <div
      className={`w-full ${maxWidth} rounded-3xl bg-white shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 shrink-0 bg-white">
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">{title}</h3>
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <X size={18} />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
        {children}
      </div>
    </div>
  </div>
);

