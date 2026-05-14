import * as React from "react";
import { Link } from "react-router";
import { CheckCircle2, Clock, CheckCircle } from "lucide-react";

export default function OrdersListRoute() {
  const orders = [
    {
      id: "ORD-982",
      title: "Jasa Pembuatan Web Company Profile MVP",
      partner: "Kadek Agus",
      price: "Rp 150.000",
      status: "review",
      statusLabel: "Review",
      date: "13 May 2026",
      isBuyer: true,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: "ORD-951",
      title: "Desain Logo Startup E-Commerce",
      partner: "Dian Sastro",
      price: "Rp 350.000",
      status: "working",
      statusLabel: "Dikerjakan",
      date: "10 May 2026",
      isBuyer: false,
      image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: "ORD-820",
      title: "Konsultasi Backend Architecture",
      partner: "Ahmad Dani",
      price: "Rp 500.000",
      status: "completed",
      statusLabel: "Selesai",
      date: "01 May 2026",
      isBuyer: true,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=200"
    }
  ];

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
          <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-600 text-white">Semua</button>
          <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Pembelian</button>
          <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Penjualan</button>
        </div>
      </div>
      
      <div className="p-4">
        {/* Mobile Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 md:hidden hide-scrollbar">
          <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-600 text-white shrink-0">Semua</button>
          <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shrink-0">Pembelian</button>
          <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shrink-0">Penjualan</button>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <Link 
              key={order.id} 
              to="/workspace/order" 
              className="block bg-white dark:bg-gray-950 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 shadow-sm hover:shadow-md transition group"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.statusLabel}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {order.isBuyer ? "Pembelian dari" : "Penjualan ke"} <span className="font-bold text-gray-700 dark:text-gray-300">{order.partner}</span>
                  </span>
                </div>
                <span className="text-xs text-gray-400 font-medium">{order.date}</span>
              </div>

              <div className="flex gap-4">
                <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shrink-0">
                  <img src={order.image} alt={order.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {order.title}
                  </h4>
                  <div className="mt-auto flex justify-between items-end">
                    <span className="text-xs text-gray-500">{order.id}</span>
                    <p className="font-bold text-indigo-600 dark:text-indigo-400">{order.price}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
