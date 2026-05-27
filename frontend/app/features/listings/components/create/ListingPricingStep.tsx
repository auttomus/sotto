import * as React from "react";
import { useCreateStore } from "../../../create/store/useCreateStore";

export function ListingPricingStep() {
  const { listingData, updateListingData } = useCreateStore();

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Harga & Pengiriman</h2>
        <p className="text-sm text-muted-foreground">Atur harga yang sesuai untuk penawaranmu.</p>
      </div>

      <div className="space-y-5 pt-2">
        <div>
          <label className="form-label mb-1.5 block">Harga (Rp)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">Rp</span>
            <input 
              type="number" 
              value={listingData.price || ''}
              onChange={(e) => updateListingData({ price: parseInt(e.target.value) || 0 })}
              placeholder="0"
              min="0"
              className="form-input w-full p-3.5 pl-12 text-lg font-bold"
            />
          </div>
        </div>

        {listingData.type === 'SERVICE' && (
          <div>
            <label className="form-label mb-1.5 block">Estimasi Pengerjaan (Hari)</label>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                value={listingData.deliveryTimeDays || ''}
                onChange={(e) => updateListingData({ deliveryTimeDays: parseInt(e.target.value) || 1 })}
                min="1"
                className="form-input w-24 p-3.5 text-center font-bold"
              />
              <span className="text-muted-foreground font-medium">Hari Kerja</span>
            </div>
          </div>
        )}

        <div className="pt-2">
          <label className="flex items-center justify-between p-4 border border-border bg-card rounded-xl cursor-pointer hover:bg-muted transition">
            <div>
              <h4 className="font-bold text-foreground">Ketersediaan Tanpa Batas</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Bisa menerima banyak orderan sekaligus</p>
            </div>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={listingData.isUnlimited}
                onChange={(e) => updateListingData({ isUnlimited: e.target.checked })}
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${listingData.isUnlimited ? 'bg-primary' : 'bg-muted-foreground/30'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${listingData.isUnlimited ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>
        </div>

        {!listingData.isUnlimited && (
          <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <label className="form-label mb-1.5 block">Batas Order Aktif</label>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                value={listingData.maxActiveOrders || ''}
                onChange={(e) => updateListingData({ maxActiveOrders: parseInt(e.target.value) || 1 })}
                min="1"
                className="form-input w-24 p-3.5 text-center font-bold"
              />
              <span className="text-xs text-muted-foreground font-medium">Batas maksimal pesanan aktif yang dapat dikerjakan secara bersamaan.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
