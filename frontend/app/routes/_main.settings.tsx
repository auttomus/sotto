import * as React from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Sun, Moon, Check, User, ChevronRight, LogOut, Loader2 } from "lucide-react";
import { useThemeStore } from "~/core/store/useThemeStore";
import { useAuthStore } from "~/core/store/useAuthStore";
import { Button } from "~/components/ui/Button";
import { cn } from "~/core/utils/cn";
import { useToastStore } from "~/core/store/useToastStore";

export default function SettingsRoute() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useThemeStore();
  const { logout, user } = useAuthStore();
  const addToast = useToastStore((s) => s.addToast);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Simulate slight delay for premium feedback
      await new Promise((resolve) => setTimeout(resolve, 500));
      logout();
      addToast("success", "Berhasil keluar dari akun");
      navigate("/login");
    } catch (error) {
      addToast("error", "Gagal melakukan logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-4 h-14 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-tight">Pengaturan & Lainnya</h1>
      </header>

      {/* Content */}
      <div className="p-4 space-y-6 max-w-lg mx-auto w-full">
        {/* Profile Card Summary */}
        {user && (
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-800/80">
            <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg uppercase">
              {user.displayName[0]}
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-tight">{user.displayName}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">@{user.username}</p>
            </div>
          </div>
        )}

        {/* Theme Settings */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Tampilan</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Light Mode */}
            <button 
              onClick={() => isDark && toggleTheme()}
              className={cn(
                "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all relative overflow-hidden group",
                !isDark 
                  ? "bg-indigo-50/20 border-indigo-600 dark:border-indigo-500 shadow-md shadow-indigo-500/5" 
                  : "bg-gray-50/50 dark:bg-gray-900/20 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
              )}
            >
              <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center mb-3 text-amber-500 transition-transform group-hover:scale-110">
                <Sun className="h-5 w-5" />
              </div>
              <span className="font-bold text-xs text-gray-900 dark:text-gray-50">Mode Terang</span>
              <span className="text-[10px] text-gray-500 mt-1">Warna cerah</span>
              {!isDark && (
                <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </div>
              )}
            </button>

            {/* Dark Mode */}
            <button 
              onClick={() => !isDark && toggleTheme()}
              className={cn(
                "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all relative overflow-hidden group",
                isDark 
                  ? "bg-indigo-950/10 border-indigo-500 dark:border-indigo-500 shadow-md shadow-indigo-500/5" 
                  : "bg-gray-50/50 dark:bg-gray-900/20 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
              )}
            >
              <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center mb-3 text-indigo-500 transition-transform group-hover:scale-110">
                <Moon className="h-5 w-5" />
              </div>
              <span className="font-bold text-xs text-gray-900 dark:text-gray-50">Mode Gelap</span>
              <span className="text-[10px] text-gray-500 mt-1">Nyaman di mata</span>
              {isDark && (
                <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </div>
              )}
            </button>
          </div>
        </section>

        {/* Menu Tautan */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Menu & Akun</h2>
          <div className="space-y-2">
            <button 
              onClick={() => navigate("/profile")} 
              className="w-full flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-900/10 hover:bg-gray-100 dark:hover:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-800/80 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  <User className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-xs text-gray-900 dark:text-gray-100">Edit Profil</h3>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Ganti avatar, bio, atau nama tampilan</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </section>

        {/* Logout Section */}
        <section className="pt-4">
          <Button 
            variant="danger" 
            className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-red-500/10 text-xs"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Keluar...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" /> Keluar dari Akun
              </>
            )}
          </Button>
        </section>
      </div>
    </div>
  );
}
