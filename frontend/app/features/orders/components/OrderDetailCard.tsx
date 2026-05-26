import * as React from "react";
import { OrderStatus } from "~/core/apollo/base-types";

interface OrderDetailCardProps {
  order: {
    id: string;
    agreedPrice: number;
    status: OrderStatus;
    createdAt: string;
    listingId: string;
    listing?: {
      title: string;
    } | null;
  };
  isBuyer: boolean;
  getStatusLabel: (status: OrderStatus) => string;
}

export function OrderDetailCard({ order, isBuyer, getStatusLabel }: OrderDetailCardProps) {
  const formattedPrice = order.agreedPrice?.toLocaleString("id-ID");
  const formattedDate = new Date(order.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
      {order.listing && (
        <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">
            Produk / Jasa
          </span>
          <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm hover:text-indigo-600 transition">
            {order.listing.title}
          </h4>
        </div>
      )}

      <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-xs">
        <div>
          <span className="text-gray-400 dark:text-gray-550 block mb-0.5">Status Pesanan</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            {getStatusLabel(order.status)}
          </span>
        </div>

        <div>
          <span className="text-gray-400 dark:text-gray-550 block mb-0.5">Total Harga</span>
          <span className="font-extrabold text-gray-900 dark:text-gray-100">
            Rp {formattedPrice}
          </span>
        </div>

        <div>
          <span className="text-gray-400 dark:text-gray-550 block mb-0.5">Peran Anda</span>
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {isBuyer ? "Pembeli (Buyer)" : "Penjual (Seller)"}
          </span>
        </div>

        <div>
          <span className="text-gray-400 dark:text-gray-550 block mb-0.5">Tanggal Dibuat</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {formattedDate}
          </span>
        </div>

        <div className="col-span-2 border-t border-gray-50 dark:border-gray-850 pt-2.5 flex justify-between items-center">
          <span className="text-[10px] text-gray-400 dark:text-gray-500">ID Pesanan</span>
          <span className="font-mono text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-850 px-2 py-0.5 rounded">
            {order.id}
          </span>
        </div>
      </div>
    </div>
  );
}
