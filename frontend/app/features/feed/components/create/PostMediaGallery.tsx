import * as React from "react";
import { Image as ImageIcon, X } from "lucide-react";

interface PostMediaGalleryProps {
  files: File[];
  removeFile: (index: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function PostMediaGallery({ files, removeFile, fileInputRef }: PostMediaGalleryProps) {
  if (files.length === 0) {
    return (
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="w-full aspect-video bg-muted rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-muted/70 transition group mb-5"
      >
        <div className="p-4 bg-card rounded-full shadow-sm group-hover:scale-105 transition-transform">
          <ImageIcon className="h-8 w-8 text-primary" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground text-sm">Pilih Gambar atau Video</p>
          <p className="text-xs text-muted-foreground mt-1">Maks 5 file, ukuran total 20MB</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
      {files.map((file, i) => (
        <div key={i} className="relative w-32 h-32 shrink-0 rounded-xl overflow-hidden border border-border group">
          <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
          <button 
            type="button"
            onClick={() => removeFile(i)}
            className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black text-white rounded-full transition"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      {files.length < 5 && (
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-32 h-32 shrink-0 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center hover:bg-muted transition"
        >
          <ImageIcon className="h-6 w-6 text-muted-foreground mb-1" />
          <span className="text-xs text-muted-foreground font-medium">Tambah</span>
        </button>
      )}
    </div>
  );
}
