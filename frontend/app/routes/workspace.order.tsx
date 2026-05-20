import { ArrowLeft, CheckCircle2, Clock, CheckCircle, Upload, AlertCircle } from "lucide-react";
import { Link } from "react-router";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";

const ORDER_STATUS = "review"; // "paid" | "working" | "review" | "completed"

export default function OrderRoute() {
  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50 dark:bg-gray-950 w-full max-w-lg mx-auto border-x border-gray-100 dark:border-gray-800 relative">
      {/* Header with Progress Tracker */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shrink-0 sticky top-0 z-10">
        <div className="px-3 h-16 flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </Link>
          <div className="flex items-center gap-3">
            <Avatar src="https://i.pravatar.cc/150?u=kadek" size="sm" />
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Pesanan #ORD-982</span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">Penjual: Kadek Agus</span>
            </div>
          </div>
        </div>

        {/* Progress Tracker Bar */}
        <div className="px-6 py-4 pb-5">
          <div className="relative flex items-center justify-between w-full">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-full z-0"></div>
            {/* Active Line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[66%] h-1 bg-indigo-500 rounded-full z-0 transition-all duration-500"></div>

            {/* Steps */}
            {[
              { id: "paid", label: "Dibayar", done: true },
              { id: "working", label: "Dikerjakan", done: true },
              { id: "review", label: "Review", done: false, active: true },
              { id: "completed", label: "Selesai", done: false },
            ].map((step, idx) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                  step.done 
                    ? "bg-indigo-500 border-indigo-500 text-white" 
                    : step.active 
                      ? "bg-white dark:bg-gray-900 border-indigo-500 text-indigo-500 ring-4 ring-indigo-500/20"
                      : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-300 dark:text-gray-700"
                }`}>
                  {step.done ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                </div>
                <span className={`absolute -bottom-5 text-[10px] font-semibold whitespace-nowrap ${
                  step.done || step.active ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500"
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Order Details Card */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-3">Detail Pesanan</h3>
          <div className="flex gap-3">
            <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shrink-0">
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col flex-1">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Jasa Pembuatan Web Company Profile MVP</h4>
              <p className="font-bold text-indigo-600 dark:text-indigo-400 text-sm mt-1">Rp 150.000</p>
            </div>
          </div>
        </div>

        {/* Action Board Status Content */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-4 mt-2">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold text-blue-900 dark:text-blue-100 text-sm">Menunggu Review Pembeli</h4>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 leading-relaxed">
                Penjual telah mengirimkan hasil kerja. Silakan periksa file yang dilampirkan atau link yang diberikan di ruang obrolan.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between mt-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Upload className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">hasil_web_mvp_final.zip</p>
              <p className="text-xs text-gray-500">14.2 MB • ZIP Archive</p>
            </div>
          </div>
          <Button variant="outline" size="sm">Unduh</Button>
        </div>
      </div>

      {/* Action Board (Sticky Bottom) */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 pb-safe shrink-0">
        <div className="flex items-start gap-2 mb-3 px-1 text-xs text-gray-500 dark:text-gray-400">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <p>Dengan menekan Pesanan Selesai, dana akan diteruskan ke penjual dan pesanan tidak dapat dibatalkan.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1 font-semibold">Minta Revisi</Button>
          <Button variant="primary" className="flex-1 font-semibold bg-green-600 hover:bg-green-700 text-white border-0 shadow-lg shadow-green-500/20">Pesanan Selesai</Button>
        </div>
      </div>
    </div>
  );
}
