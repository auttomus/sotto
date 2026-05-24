import * as React from "react";
import { Image as ImageIcon, X } from "lucide-react";
import { useCreateStore } from "../../../create/store/useCreateStore";

interface ListingMediaStepProps {
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
}

export function ListingMediaStep({ handleFileSelect, removeFile }: ListingMediaStepProps) {
  const { listingFiles: files } = useCreateStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Galeri Media</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Tambahkan foto penawaran agar lebih menarik.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        {files.map((file: File, i: number) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 group">
            <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
            <button 
              onClick={() => removeFile(i)}
              className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        
        {files.length < 5 && (
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-400 hover:text-indigo-500"
          >
            <ImageIcon className="h-8 w-8 mb-2" />
            <span className="text-sm font-medium">Tambah Foto</span>
            <span className="text-xs mt-1 opacity-70">{files.length}/5 diunggah</span>
          </button>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        multiple 
        accept="image/*,video/*"
        onChange={handleFileSelect}
      />
    </div>
  );
}
