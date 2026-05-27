import * as React from "react";
import { Sun, Moon, Check } from "lucide-react";
import { cn } from "~/core/utils/cn";

interface ThemeSelectorProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export function ThemeSelector({ isDark, toggleTheme }: ThemeSelectorProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Tampilan</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Light Mode */}
        <button 
          onClick={() => isDark && toggleTheme()}
          className={cn(
            "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all relative overflow-hidden group cursor-pointer",
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
            "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all relative overflow-hidden group cursor-pointer",
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
  );
}
