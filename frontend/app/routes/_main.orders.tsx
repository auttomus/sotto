import * as React from "react";
import { Link } from "react-router";
import { CheckCircle2, Clock, CheckCircle, Loader2 } from "lucide-react";
import { useGetMyOrdersQuery } from "~/core/apollo/generated";
import { useAuthStore } from "~/core/store/useAuthStore";
import { formatDate } from "~/core/utils/formatDate";

export default function OrdersListRoute() {
  const { user } = useAuthStore();
  const [role, setRole] = React.useState<"ALL" | "BUYER" | "SELLER">("ALL");

  const { data, loading, error } = useGetMyOrdersQuery({
    variables: { role },
    fetchPolicy: "cache-and-network"
  });

  const orders = data?.myOrders || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30";
      case "working": return "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/30";
      case "review": return "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30";
      default: return "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="h-3.5 w-3.5" />;
      case "working": return <Clock className="h-3.5 w-3.5" />;
      case "review": return <CheckCircle className="h-3.5 w-3.5" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 w-full relative">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-10 hidden md:flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Daftar Order</h1>
        <div className="flex gap-2">
          <button onClick={() => setRole("ALL")} className={`px-4 py-1.5 rounded-full text-sm font-medium ${role === "ALL" ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"}`}>Semua</button>
          <button onClick={() => setRole("BUYER")} className={`px-4 py-1.5 rounded-full text-sm font-medium ${role === "BUYER" ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"}`}>Pembelian</button>
          <button onClick={() => setRole("SELLER")} className={`px-4 py-1.5 rounded-full text-sm font-medium ${role === "SELLER" ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"}`}>Penjualan</button>
        </div>
      </div>
      
      <div className="p-4">
        {/* Mobile Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 md:hidden hide-scrollbar">
          <button onClick={() => setRole("ALL")} className={`px-4 py-1.5 rounded-full text-sm font-medium shrink-0 ${role === "ALL" ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"}`}>Semua</button>
          <button onClick={() => setRole("BUYER")} className={`px-4 py-1.5 rounded-full text-sm font-medium shrink-0 ${role === "BUYER" ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"}`}>Pembelian</button>
          <button onClick={() => setRole("SELLER")} className={`px-4 py-1.5 rounded-full text-sm font-medium shrink-0 ${role === "SELLER" ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"}`}>Penjualan</button>
        </div>

        <div className="space-y-4">
          {loading && orders.length === 0 ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center text-gray-500 py-10">Tidak ada order.</div>
          ) : (
            orders.map((order: any) => {
              const isBuyer = order.buyerAccountId === user?.id;
              
              return (
                <Link 
                  key={order.id} 
                  to={`/workspace/order/${order.id}`} 
                  className="block bg-white dark:bg-gray-950 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 shadow-sm hover:shadow-md transition group"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {isBuyer ? "Pembelian" : "Penjualan"} 
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{formatDate(order.createdAt)}</span>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        Order #{order.id.slice(0, 8)}
                      </h4>
                      <div className="mt-auto flex justify-between items-end">
                        <span className="text-xs text-gray-500">Listing: {order.listingId}</span>
                        <p className="font-bold text-indigo-600 dark:text-indigo-400">Rp {order.agreedPrice?.toLocaleString('id-ID')}</p>
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
