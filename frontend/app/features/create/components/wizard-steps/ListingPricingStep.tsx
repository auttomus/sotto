import * as React from "react";
import { useCreateStore } from "../../store/useCreateStore";

export function ListingPricingStep() {
  const { listingData, updateListingData } = useCreateStore();

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Harga & Pengiriman</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Atur harga yang sesuai untuk penawaranmu.</p>
      </div>

      <div className="space-y-5 pt-2">
        <div>
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">Harga (Rp)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
            <input 
              type="number" 
              value={listingData.price || ''}
              onChange={(e) => updateListingData({ price: parseInt(e.target.value) || 0 })}
              placeholder="0"
              min="0"
              className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3.5 pl-12 text-lg font-bold focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        {listingData.type === 'SERVICE' && (
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">Estimasi Pengerjaan (Hari)</label>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                value={listingData.deliveryTimeDays || ''}
                onChange={(e) => updateListingData({ deliveryTimeDays: parseInt(e.target.value) || 1 })}
                min="1"
                className="w-24 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3.5 text-center font-bold focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
              <span className="text-gray-500 font-medium">Hari Kerja</span>
            </div>
          </div>
        )}

        <div className="pt-2">
          <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-gray-100">Ketersediaan Tanpa Batas</h4>
              <p className="text-xs text-gray-500 mt-0.5">Bisa menerima banyak orderan sekaligus</p>
            </div>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={listingData.isUnlimited}
                onChange={(e) => updateListingData({ isUnlimited: e.target.checked })}
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${listingData.isUnlimited ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${listingData.isUnlimited ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
