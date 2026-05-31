import * as React from "react";
import { Dialog } from "./Dialog";
import { useDialogStore } from "~/core/store/useDialogStore";
import { cn } from "~/core/utils/cn";

export function DialogProvider() {
  const {
    isOpen,
    title,
    message,
    type,
    confirmText,
    cancelText,
    variant,
    maxWidth,
    onConfirm,
    onCancel,
  } = useDialogStore();

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    onConfirm();
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCancel();
  };

  // Determine standard Sotto classes for each variant
  const getConfirmButtonClass = () => {
    switch (variant) {
      case "destructive":
        return "bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-md shadow-destructive/25";
      case "success":
        return "bg-emerald-600 hover:bg-emerald-600/90 text-white shadow-md shadow-emerald-600/25";
      case "primary":
      default:
        return "bg-primary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/10";
    }
  };

  const footer = (
    <div className="flex gap-3 w-full">
      {type === "confirm" && (
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 font-bold text-xs py-2.5 rounded-sm border border-border text-foreground hover:bg-muted transition cursor-pointer"
        >
          {cancelText}
        </button>
      )}
      <button
        type="button"
        onClick={handleConfirm}
        className={cn(
          "flex-1 font-bold text-xs py-2.5 rounded-sm border-0 active:scale-[0.99] transition cursor-pointer flex items-center justify-center gap-1.5",
          getConfirmButtonClass()
        )}
      >
        {confirmText}
      </button>
    </div>
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      maxWidth={maxWidth}
      footer={footer}
    >
      <div className="text-xs font-semibold text-muted-foreground leading-relaxed whitespace-pre-wrap">
        {message}
      </div>
    </Dialog>
  );
}
