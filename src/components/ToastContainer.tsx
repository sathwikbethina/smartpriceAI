import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/30 text-white'
              : toast.type === 'warning'
              ? 'bg-amber-950/90 border-amber-500/30 text-white'
              : 'bg-slate-900/90 border-blue-500/30 text-white'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : toast.type === 'warning' ? (
              <AlertCircle className="w-5 h-5 text-amber-400" />
            ) : (
              <Info className="w-5 h-5 text-blue-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-tight">{toast.title}</p>
            {toast.message && <p className="text-xs text-slate-300 mt-0.5 leading-snug">{toast.message}</p>}
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-slate-400 hover:text-white p-1 -mr-1 -mt-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
