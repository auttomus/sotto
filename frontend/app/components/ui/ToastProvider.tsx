import React from 'react';
import { useToastStore } from '~/core/store/useToastStore';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export function ToastProvider() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 md:top-4 md:right-4 md:left-auto md:translate-x-0 z-50 flex flex-col gap-2.5 w-full max-w-sm px-4 md:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-card border border-border shadow-2xl rounded-xl p-3 flex items-center gap-3 relative overflow-hidden transition-all duration-300 transform animate-in slide-in-from-top-2 fade-in w-full select-none"
        >
          {/* Status Color Accent Line */}
          <div 
            className={`absolute left-0 top-0 bottom-0 w-1 ${
              toast.type === 'error' 
                ? 'bg-destructive' 
                : toast.type === 'success' 
                ? 'bg-success' 
                : 'bg-primary'
            }`} 
          />
          
          {/* Status Badge Icon */}
          <div className={`p-1.5 rounded-lg shrink-0 ${
            toast.type === 'error' 
              ? 'bg-destructive/10 text-destructive' 
              : toast.type === 'success' 
              ? 'bg-success/10 text-success' 
              : 'bg-primary/10 text-primary'
          }`}>
            {toast.type === 'error' && <AlertCircle className="h-4 w-4 shrink-0" />}
            {toast.type === 'success' && <CheckCircle className="h-4 w-4 shrink-0" />}
            {toast.type === 'info' && <Info className="h-4 w-4 shrink-0" />}
          </div>
          
          {/* Message Text */}
          <p className="text-[11px] font-extrabold text-foreground leading-snug flex-1 pl-0.5">
            {toast.message}
          </p>
          
          {/* Dismiss Button */}
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
