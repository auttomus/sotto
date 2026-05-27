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
    <div className="bg-card p-4 rounded-3xl border border-border shadow-sm space-y-4">
      {order.listing && (
        <div className="border-b border-border pb-3">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
            Produk / Jasa
          </span>
          <h4 className="font-bold text-foreground text-sm hover:text-primary transition">
            {order.listing.title}
          </h4>
        </div>
      )}

      <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-xs">
        <div>
          <span className="text-muted-foreground block mb-0.5">Status Pesanan</span>
          <span className="font-bold text-primary">
            {getStatusLabel(order.status)}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground block mb-0.5">Total Harga</span>
          <span className="font-extrabold text-foreground">
            Rp {formattedPrice}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground block mb-0.5">Peran Anda</span>
          <span className="font-semibold text-foreground">
            {isBuyer ? "Pembeli (Buyer)" : "Penjual (Seller)"}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground block mb-0.5">Tanggal Dibuat</span>
          <span className="font-medium text-foreground">
            {formattedDate}
          </span>
        </div>

        <div className="col-span-2 border-t border-border pt-2.5 flex justify-between items-center">
          <span className="text-[10px] text-muted-foreground">ID Pesanan</span>
          <span className="font-mono text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
            {order.id}
          </span>
        </div>
      </div>
    </div>
  );
}
