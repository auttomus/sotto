import { ArrowLeft, MoreVertical, Paperclip, Send, Check } from "lucide-react";
import { Link } from "react-router";
import { Avatar } from "../components/ui/Avatar";

export default function ChatRoute() {
  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50 dark:bg-gray-950 w-full max-w-lg mx-auto border-x border-gray-100 dark:border-gray-800 relative">
      {/* Header */}
      <header className="shrink-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10 px-3 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Avatar src="https://i.pravatar.cc/150?u=kadek" size="sm" />
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-none">Kadek Agus</span>
              <span className="text-[11px] text-green-600 dark:text-green-400 mt-1 font-medium">Sedang Online</span>
            </div>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <MoreVertical className="h-5 w-5 text-gray-500" />
        </button>
      </header>

      {/* Contextual Banner */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 flex items-center gap-2 border-b border-indigo-100 dark:border-indigo-900/30 shrink-0 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition">
        <div className="h-8 w-8 rounded overflow-hidden shrink-0">
          <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=100" alt="Context" className="h-full w-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">Menanyakan tentang</p>
          <p className="text-xs text-gray-900 dark:text-gray-100 font-medium truncate">Jasa Pembuatan Web Company Profile MVP</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
        {/* Date Divider */}
        <div className="flex justify-center my-2">
          <span className="text-[10px] font-medium bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full">
            Hari ini
          </span>
        </div>

        {/* Their Message */}
        <div className="flex gap-2 max-w-[85%]">
          <Avatar src="https://i.pravatar.cc/150?u=kadek" size="sm" className="mt-auto shrink-0 h-6 w-6" />
          <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 dark:border-gray-700/50">
            <p className="text-sm text-gray-800 dark:text-gray-200">
              Halo! Terima kasih sudah tertarik dengan jasa saya. Ada kebutuhan khusus untuk website MVP-nya?
            </p>
            <span className="text-[10px] text-gray-400 mt-1 block text-right">09:41</span>
          </div>
        </div>

        {/* My Message */}
        <div className="flex gap-2 max-w-[85%] self-end">
          <div className="bg-indigo-600 p-3 rounded-2xl rounded-br-sm shadow-sm">
            <p className="text-sm text-white">
              Iya Bli, saya butuh web landing page sederhana untuk jualan kopi. Paling cuma 3 halaman aja. Kira-kira bisa kelar 3 hari nggak ya?
            </p>
            <div className="flex items-center justify-end gap-1 mt-1">
              <span className="text-[10px] text-indigo-200">09:45</span>
              <Check className="h-3 w-3 text-white" />
            </div>
          </div>
        </div>

        {/* Custom Offer Card */}
        <div className="flex gap-2 w-full max-w-sm mx-auto mt-4 mb-2">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900/50 shadow-md w-full relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">PENAWARAN KHUSUS</div>
            <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm mt-2">Landing Page Kopi (Eksplres)</h4>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">Rp 250.000</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-600 dark:text-gray-400 font-medium bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
              <div className="flex-1 flex flex-col items-center border-r border-gray-200 dark:border-gray-700">
                <span className="text-gray-400 dark:text-gray-500 text-[10px]">Waktu</span>
                <span className="text-gray-900 dark:text-gray-100">3 Hari</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <span className="text-gray-400 dark:text-gray-500 text-[10px]">Revisi</span>
                <span className="text-gray-900 dark:text-gray-100">2x</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 border-t border-gray-100 dark:border-gray-800 pt-2">
              Harga disesuaikan karena permintaan pengerjaan dipercepat menjadi 3 hari.
            </p>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 py-2 text-sm font-semibold rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                Tolak
              </button>
              <button className="flex-1 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition">
                Terima & Bayar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="shrink-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-3 pb-safe">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full pr-1.5 pl-3 py-1.5">
          <button className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition shrink-0">
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            type="text"
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 outline-none"
            placeholder="Ketik pesan..."
          />
          <button className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition shrink-0 shadow-sm disabled:opacity-50">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
