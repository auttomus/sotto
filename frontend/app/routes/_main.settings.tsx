import * as React from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, User, ChevronRight } from "lucide-react";
import { useThemeStore } from "~/core/store/useThemeStore";
import { useAuthStore } from "~/core/store/useAuthStore";
import { ThemeSelector } from "~/features/settings/components/ThemeSelector";
import { LogoutButton } from "~/features/settings/components/LogoutButton";

export default function SettingsRoute() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-955">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-4 h-14 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
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
            <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-955/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg uppercase">
              {user.displayName[0]}
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-tight">{user.displayName}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">@{user.username}</p>
            </div>
          </div>
        )}

        {/* Theme Settings */}
        <ThemeSelector isDark={isDark} toggleTheme={toggleTheme} />

        {/* Menu Tautan */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Menu & Akun</h2>
          <div className="space-y-2">
            <button 
              onClick={() => navigate("/profile")} 
              className="w-full flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-900/10 hover:bg-gray-100 dark:hover:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-800/80 transition group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gray-150 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
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

        {/* Logout Button */}
        <LogoutButton />
      </div>
    </div>
  );
}
