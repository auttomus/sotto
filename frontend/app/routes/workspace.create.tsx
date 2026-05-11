import { X, Image as ImageIcon, Briefcase, FileCode2, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import * as React from "react";
import { Button } from "../components/ui/Button";

type CreateType = "post" | "jasa" | "produk" | null;

export default function CreateWizardRoute() {
  const [selectedType, setSelectedType] = React.useState<CreateType>(null);
  
  if (selectedType === null) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 w-full max-w-lg mx-auto border-x border-gray-100 dark:border-gray-800 relative">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 h-14 flex items-center justify-between sticky top-0">
          <h1 className="font-bold text-gray-900 dark:text-gray-100">Buat Baru</h1>
          <Link to="/" className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <X className="h-5 w-5 text-gray-500" />
          </Link>
        </header>
        
        <div className="p-4 space-y-3 mt-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 px-1">Apa yang ingin kamu bagikan?</h2>
          
          <button 
            onClick={() => setSelectedType("post")}
            className="w-full bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500/50 transition-all text-left shadow-sm group"
          >
            <div className="h-12 w-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
              <ImageIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Karya / Portofolio</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Unggah hasil kerjamu, desain, atau screenshot kode ke feed.</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
          </button>
          
          <button 
            onClick={() => setSelectedType("jasa")}
            className="w-full bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500/50 transition-all text-left shadow-sm group mt-2"
          >
            <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Tawarkan Jasa</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Buat penawaran jasa untuk dikerjakan sesuai pesanan.</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
          </button>

          <button 
            onClick={() => setSelectedType("produk")}
            className="w-full bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500/50 transition-all text-left shadow-sm group mt-2"
          >
            <div className="h-12 w-12 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center shrink-0">
              <FileCode2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Jual Produk Digital</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Jual source code, template, atau aset desain instan.</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors" />
          </button>
        </div>
      </div>
    );
  }

  // State for Create Post Wizard
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 w-full max-w-lg mx-auto border-x border-gray-100 dark:border-gray-800 relative">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 h-14 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedType(null)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Unggah Karya</h1>
        </div>
        <Button variant="primary" size="sm" className="h-8 rounded-lg px-4 shadow-md shadow-indigo-500/20">Bagikan</Button>
      </header>

      <div className="p-4 overflow-y-auto pb-20">
        {/* Media Uploader Box */}
        <div className="w-full aspect-video bg-gray-100 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition group mb-5">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm group-hover:scale-105 transition-transform">
            <ImageIcon className="h-8 w-8 text-indigo-500" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Pilih Gambar atau Video</p>
            <p className="text-xs text-gray-500 mt-1">Maks 5 file, ukuran total 20MB</p>
          </div>
        </div>

        {/* Text Area */}
        <div className="mb-4 relative">
          <textarea 
            className="w-full bg-transparent text-gray-900 dark:text-gray-100 text-lg placeholder-gray-400 focus:outline-none resize-none min-h-[120px]"
            placeholder="Ceritakan proses pembuatan karyamu..."
          />
          <span className="absolute bottom-2 right-2 text-xs text-gray-400 font-medium">0/500</span>
        </div>

        {/* Tags Input (Visual only) */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mb-4">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">Topik / Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1">
              #ReactJS <X className="h-3 w-3 cursor-pointer" />
            </span>
          </div>
          <input 
            type="text" 
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
            placeholder="Ketik topik (contoh: Design, Web, Backend)..."
          />
        </div>
      </div>
    </div>
  );
}
