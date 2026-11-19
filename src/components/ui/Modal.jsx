import { X } from 'lucide-react';

export const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
      <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold">{title}</h3>
        <button onClick={onClose} aria-label="Close"><X size={20} /></button></div>
      {children}
    </div>
  </div>
);

