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
        className="w-full aspect-video bg-gray-100 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition group mb-5"
      >
        <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm group-hover:scale-105 transition-transform">
          <ImageIcon className="h-8 w-8 text-indigo-500" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Pilih Gambar atau Video</p>
          <p className="text-xs text-gray-500 mt-1">Maks 5 file, ukuran total 20MB</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
      {files.map((file, i) => (
        <div key={i} className="relative w-32 h-32 shrink-0 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 group">
          <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
          <button 
            onClick={() => removeFile(i)}
            className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black text-white rounded-full transition"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      {files.length < 5 && (
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-32 h-32 shrink-0 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <ImageIcon className="h-6 w-6 text-gray-400 mb-1" />
          <span className="text-xs text-gray-500 font-medium">Tambah</span>
        </button>
      )}
    </div>
  );
}
