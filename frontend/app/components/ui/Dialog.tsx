import * as React from "react";
import { X } from "lucide-react";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function Dialog({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "md",
}: DialogProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  }[maxWidth];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={`bg-card text-foreground rounded-sm border border-border shadow-2xl w-full ${maxWidthClass} overflow-hidden relative transition-all duration-300 transform scale-100 animate-zoom-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-6 pb-2">
          <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 text-sm text-muted-foreground">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 pb-6 pt-2 flex gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
