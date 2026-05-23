import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Layout } from "lucide-react";
import { ROUTES } from "~/core/constants/ROUTES";
import { useAuthStore } from "~/core/store/useAuthStore";
import { useThemeStore } from "~/core/store/useThemeStore";

export default function LandingRoute() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
    if (isAuthenticated) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isAuthenticated, navigate, initTheme]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 overflow-hidden relative">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 dark:opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <header className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 font-serif italic">
          Sotto
        </Link>
        <div className="flex gap-4">
          <Link
            to={ROUTES.LOGIN}
            className="px-5 py-2.5 text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Masuk
          </Link>
          <Link
            to={ROUTES.REGISTER}
            className="px-5 py-2.5 text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            Daftar Sekarang
          </Link>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-8 ring-1 ring-indigo-500/20">
          <Sparkles className="h-4 w-4" />
          <span>Platform Inkubator & Gig Economy Siswa</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl leading-[1.1]">
          Tampilkan <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Karya Terbaikmu</span>. Jual Keahlian Nyatamu.
        </h1>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-12">
          Sotto adalah panggung pameran portofolio sekaligus pasar keahlian mandiri untuk siswa vokasi dan sekolah menengah. Tunjukkan keahlian nyata lewat karya, tawarkan jasa profesional, dan jual produk digital secara instan.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            to={ROUTES.REGISTER}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-600/20"
          >
            Mulai Sekarang
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to={ROUTES.EXPLORE}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-full font-semibold text-lg transition-all ring-1 ring-gray-200 dark:ring-gray-800 hover:ring-gray-300 dark:hover:ring-gray-700"
          >
            Jelajahi Karya & Jasa
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 text-left max-w-5xl">
          <div className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Layout className="w-32 h-32" />
            </div>
            <div className="bg-amber-100 dark:bg-amber-500/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
              <Layout className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Linimasa Portofolio</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Pamerkan bukti nyata keahlianmu. Unggah karya, ceritakan proses pembuatannya, dan bangun reputasimu sejak di bangku sekolah.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck className="w-32 h-32" />
            </div>
            <div className="bg-emerald-100 dark:bg-emerald-500/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Escrow Jasa Aman</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Transaksi jasa kustomisasi dikawal dengan Brankas Aman (Escrow). Pembayaran terproteksi aman dan baru diteruskan setelah pekerjaan disetujui.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap className="w-32 h-32" />
            </div>
            <div className="bg-blue-100 dark:bg-blue-500/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Beli Produk Instan</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Jual-beli template, e-book, atau kode aplikasi buatanmu secara instan. Pembeli dapat langsung membayar dan mengunduh file detik itu juga.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
