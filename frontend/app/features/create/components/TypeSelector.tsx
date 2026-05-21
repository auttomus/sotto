import * as React from "react";
import { Link } from "react-router";
import { X, Image as ImageIcon, Briefcase, FileCode2, ChevronRight } from "lucide-react";
import { useCreateStore } from "../store/useCreateStore";

export function TypeSelector() {
  const setSelectedType = useCreateStore(s => s.setSelectedType);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 w-full max-w-lg mx-auto border-x border-gray-100 dark:border-gray-800 relative transition-colors duration-200">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 h-14 flex items-center justify-between sticky top-0 z-10">
        <h1 className="font-bold text-gray-900 dark:text-gray-100">Buat Baru</h1>
        <Link to="/" className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </Link>
      </header>
      
      <div className="p-4 space-y-3 mt-2">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 px-1">Apa yang ingin kamu bagikan?</h2>
        
        <button 
          onClick={() => setSelectedType("portfolio")}
          className="w-full bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-4 hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500/50 transition-all text-left shadow-sm group"
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
          onClick={() => setSelectedType("penawaran")}
          className="w-full bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-4 hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500/50 transition-all text-left shadow-sm group mt-3"
        >
          <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
            <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-gray-100">Penawaran & Produk</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Tawarkan jasa pengerjaan atau jual produk digital instan.</p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </button>

        <button 
          onClick={() => setSelectedType("pengalaman")}
          className="w-full bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-4 hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500/50 transition-all text-left shadow-sm group mt-3"
        >
          <div className="h-12 w-12 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
            <FileCode2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-gray-100">Berbagi Pengalaman</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ceritakan perjalanan karir, pengalaman project, atau tips.</p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
        </button>
      </div>
    </div>
  );
}
