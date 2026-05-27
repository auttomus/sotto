import * as React from "react";
import { Link, useNavigate } from "react-router";
import { X, Image as ImageIcon, Briefcase, FileCode2, ChevronRight } from "lucide-react";
import { useCreateStore } from "../store/useCreateStore";

export function TypeSelector() {
  const setSelectedType = useCreateStore(s => s.setSelectedType);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground w-full max-w-lg mx-auto border-x border-border relative transition-colors duration-200">
      <header className="bg-card/85 backdrop-blur-md border-b border-border px-4 h-14 flex items-center justify-between sticky top-0 z-10">
        <h1 className="font-bold text-foreground">Buat Baru</h1>
        <button onClick={() => navigate(-1)} className="p-2 -mr-2 rounded-full hover:bg-muted transition">
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </header>
      
      <div className="p-4 space-y-3 mt-2">
        <h2 className="text-lg font-bold text-foreground mb-4 px-1">Apa yang ingin kamu bagikan?</h2>
        
        <button 
          onClick={() => setSelectedType("portfolio")}
          className="w-full bg-card p-4 rounded-md border border-border flex items-center gap-4 hover:border-primary hover:ring-1 hover:ring-primary/50 transition-all text-left shadow-sm group"
        >
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <ImageIcon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground">Karya, Portofolio & Pengalaman</h3>
            <p className="text-xs text-muted-foreground mt-1">Unggah hasil kerjamu, desain, screenshot kode, atau ceritakan perjalanan karir & tips.</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>
        
        <button 
          onClick={() => setSelectedType("penawaran")}
          className="w-full bg-card p-4 rounded-md border border-border flex items-center gap-4 hover:border-primary hover:ring-1 hover:ring-primary/50 transition-all text-left shadow-sm group mt-3"
        >
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground">Penawaran & Produk</h3>
            <p className="text-xs text-muted-foreground mt-1">Tawarkan jasa pengerjaan atau jual produk digital instan.</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>
      </div>
    </div>
  );
}
