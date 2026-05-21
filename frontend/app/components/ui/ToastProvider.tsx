import React from 'react';
import { useToastStore } from '~/core/store/useToastStore';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export function ToastProvider() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 md:bottom-4 md:right-4 md:left-auto md:translate-x-0 z-50 flex flex-col gap-2 w-full max-w-sm px-4 md:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 p-4 rounded-lg shadow-lg border transition-all animate-in slide-in-from-bottom-5 fade-in ${
            toast.type === 'error'
              ? 'bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
              : toast.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
              : 'bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
          }`}
        >
          {toast.type === 'error' && <AlertCircle className="h-5 w-5 shrink-0" />}
          {toast.type === 'success' && <CheckCircle className="h-5 w-5 shrink-0" />}
          {toast.type === 'info' && <Info className="h-5 w-5 shrink-0" />}
          
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 p-1 rounded-md opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
