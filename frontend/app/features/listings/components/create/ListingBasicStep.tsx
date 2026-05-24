import * as React from "react";
import { useCreateStore } from "../../../create/store/useCreateStore";

export function ListingBasicStep() {
  const { listingData, updateListingData } = useCreateStore();

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Informasi Dasar</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Pilih jenis penawaran dan isi detailnya.</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => updateListingData({ type: 'SERVICE' })}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            listingData.type === 'SERVICE' 
              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 shadow-sm' 
              : 'border-gray-200 dark:border-gray-800 hover:border-indigo-300'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 ${
            listingData.type === 'SERVICE' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
          }`}>🛠️</div>
          <h3 className={`font-bold ${listingData.type === 'SERVICE' ? 'text-indigo-900 dark:text-indigo-100' : 'text-gray-700 dark:text-gray-300'}`}>Jasa</h3>
          <p className="text-xs text-gray-500 mt-1">Pengerjaan project, desain, tugas, dll.</p>
        </button>
        
        <button 
          onClick={() => updateListingData({ type: 'DIGITAL_PRODUCT' })}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            listingData.type === 'DIGITAL_PRODUCT' 
              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 shadow-sm' 
              : 'border-gray-200 dark:border-gray-800 hover:border-indigo-300'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 ${
            listingData.type === 'DIGITAL_PRODUCT' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
          }`}>📦</div>
          <h3 className={`font-bold ${listingData.type === 'DIGITAL_PRODUCT' ? 'text-indigo-900 dark:text-indigo-100' : 'text-gray-700 dark:text-gray-300'}`}>Produk Digital</h3>
          <p className="text-xs text-gray-500 mt-1">E-book, template, source code, dll.</p>
        </button>
      </div>

      <div className="space-y-4 pt-2">
        <div>
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">Judul Penawaran</label>
          <input 
            type="text" 
            value={listingData.title}
            onChange={(e) => updateListingData({ title: e.target.value })}
            placeholder="Contoh: Jasa Pembuatan Website Company Profile"
            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
          />
        </div>
        
        <div>
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">Deskripsi</label>
          <textarea 
            value={listingData.description}
            onChange={(e) => updateListingData({ description: e.target.value })}
            placeholder="Jelaskan secara detail apa yang kamu tawarkan..."
            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3.5 text-sm min-h-[120px] focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-y"
          />
        </div>
      </div>
    </div>
  );
}
