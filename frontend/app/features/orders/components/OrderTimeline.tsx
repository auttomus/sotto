import * as React from "react";
import { Link } from "react-router";
import { CheckCircle2, Clock, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { formatDate } from "~/core/utils/formatDate";
import { type OrderRole } from "~/features/orders/hooks/useMyOrders";
import { PageHeader } from "~/components/layout/PageHeader";
import { LabelBadge } from "~/components/ui/LabelBadge";

interface OrderTimelineProps {
  role: OrderRole;
  setRole: (role: OrderRole) => void;
  orders: any[];
  loading: boolean;
  error: any;
  user: any;
  activeOrderId?: string;
}

export function OrderTimeline({
  role,
  setRole,
  orders,
  loading,
  error,
  user,
  activeOrderId,
}: OrderTimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED": return <CheckCircle2 className="h-3.5 w-3.5" />;
      case "IN_PROGRESS": return <Clock className="h-3.5 w-3.5" />;
      case "PENDING_PAYMENT": return <CheckCircle className="h-3.5 w-3.5" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background w-full relative">
      <PageHeader
        title="Daftar Order"
        tabs={
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setRole("ALL")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 cursor-pointer transition-all duration-200 ${
                role === "ALL"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setRole("BUYER")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 cursor-pointer transition-all duration-200 ${
                role === "BUYER"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              Pembelian
            </button>
            <button
              onClick={() => setRole("SELLER")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 cursor-pointer transition-all duration-200 ${
                role === "SELLER"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              Penjualan
            </button>
          </div>
        }
      />
      
      <div className="p-4">

        <div className="space-y-4">
          {error ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <AlertCircle className="h-10 w-10 text-destructive mb-3" />
              <h3 className="text-lg font-bold text-foreground">Gagal memuat order</h3>
              <p className="text-sm text-muted-foreground mt-1">Terjadi kesalahan saat menghubungi server. Silakan coba beberapa saat lagi.</p>
            </div>
          ) : loading && orders.length === 0 ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">Tidak ada order.</div>
          ) : (
            orders.map((order: any) => {
              const isBuyer = order.buyerAccountId === user?.accountId;
              const isActiveOrder = order.id === activeOrderId;
              
              return (
                <Link 
                  key={order.id} 
                  to={`/workspace/order/${order.id}`} 
                  className={`block bg-card p-4 rounded-sm border shadow-sm hover:shadow-md transition group cursor-pointer ${
                    isActiveOrder
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <LabelBadge
                        variant="order-status"
                        value={order.status}
                        icon={getStatusIcon(order.status) || undefined}
                      />
                      <span className="text-xs text-muted-foreground font-medium">
                        {isBuyer ? "Pembelian" : "Penjualan"} 
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">{formatDate(order.createdAt)}</span>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col flex-1">
                      <h4 className="font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition">
                        Order #{order.id.slice(0, 8)}
                      </h4>
                      <div className="mt-auto flex justify-between items-end">
                        <span className="text-xs text-muted-foreground">Listing: {order.listingId?.slice(0, 8)}...</span>
                        <p className="font-bold text-primary">Rp {order.agreedPrice?.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
