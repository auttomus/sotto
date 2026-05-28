import * as React from "react";

interface PostEditorProps {
  editContent: string;
  setEditContent: (val: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export function PostEditor({
  editContent,
  setEditContent,
  onCancel,
  onSave,
}: PostEditorProps) {
  return (
    <div 
      className="bg-muted p-3 rounded-sm border border-border mb-3 flex flex-col gap-2"
      onClick={(e) => e.stopPropagation()} // Mencegah klik menyebar ke artikel
    >
      <textarea
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
        className="w-full text-[14px] bg-background text-foreground rounded-sm p-3 border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring resize-none font-medium leading-relaxed"
        rows={3}
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={onSave}
          className="px-4 py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded-sm hover:opacity-90 active:scale-[0.98] transition cursor-pointer"
        >
          Simpan
        </button>
      </div>
    </div>
  );
}
