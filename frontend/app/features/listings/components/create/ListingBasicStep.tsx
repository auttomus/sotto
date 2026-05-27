import * as React from "react";
import { useCreateStore } from "../../../create/store/useCreateStore";

export function ListingBasicStep() {
  const { listingData, updateListingData } = useCreateStore();

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Informasi Dasar</h2>
        <p className="text-sm text-muted-foreground">Pilih jenis penawaran dan isi detailnya.</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => updateListingData({ type: 'SERVICE' })}
          className={`p-4 rounded-md border-2 text-left transition-all cursor-pointer ${
            listingData.type === 'SERVICE' 
              ? 'border-primary bg-primary/5 shadow-sm' 
              : 'border-border hover:border-primary/50'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 ${
            listingData.type === 'SERVICE' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
          }`}>🛠️</div>
          <h3 className={`font-bold ${listingData.type === 'SERVICE' ? 'text-primary' : 'text-foreground'}`}>Jasa</h3>
          <p className="text-xs text-muted-foreground mt-1">Pengerjaan project, desain, tugas, dll.</p>
        </button>
        
        <button 
          onClick={() => updateListingData({ type: 'DIGITAL_PRODUCT' })}
          className={`p-4 rounded-md border-2 text-left transition-all cursor-pointer ${
            listingData.type === 'DIGITAL_PRODUCT' 
              ? 'border-primary bg-primary/5 shadow-sm' 
              : 'border-border hover:border-primary/50'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 ${
            listingData.type === 'DIGITAL_PRODUCT' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
          }`}>📦</div>
          <h3 className={`font-bold ${listingData.type === 'DIGITAL_PRODUCT' ? 'text-primary' : 'text-foreground'}`}>Produk Digital</h3>
          <p className="text-xs text-muted-foreground mt-1">E-book, template, source code, dll.</p>
        </button>
      </div>

      <div className="space-y-4 pt-2">
        <div>
          <label className="form-label mb-1.5 block">Judul Penawaran</label>
          <input 
            type="text" 
            value={listingData.title}
            onChange={(e) => updateListingData({ title: e.target.value })}
            placeholder="Contoh: Jasa Pembuatan Website Company Profile"
            className="form-input w-full p-3.5 text-sm"
          />
        </div>
        
        <div>
          <label className="form-label mb-1.5 block">Deskripsi</label>
          <textarea 
            value={listingData.description}
            onChange={(e) => updateListingData({ description: e.target.value })}
            placeholder="Jelaskan secara detail apa yang kamu tawarkan..."
            className="form-input w-full p-3.5 text-sm min-h-[120px]"
          />
        </div>
      </div>
    </div>
  );
}
