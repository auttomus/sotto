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
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tampilan</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Light Mode */}
        <button 
          onClick={() => isDark && toggleTheme()}
          className={cn(
            "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all relative overflow-hidden group cursor-pointer",
            !isDark 
              ? "bg-primary/5 border-primary shadow-md shadow-primary/5" 
              : "bg-card border-border hover:border-accent"
          )}
        >
          <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center mb-3 text-warning transition-transform group-hover:scale-110">
            <Sun className="h-5 w-5" />
          </div>
          <span className="font-bold text-xs text-foreground">Mode Terang</span>
          <span className="text-[10px] text-muted-foreground mt-1">Warna cerah</span>
          {!isDark && (
            <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary text-white flex items-center justify-center">
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
              ? "bg-primary/5 border-primary shadow-md shadow-primary/5" 
              : "bg-card border-border hover:border-accent"
          )}
        >
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary transition-transform group-hover:scale-110">
            <Moon className="h-5 w-5" />
          </div>
          <span className="font-bold text-xs text-foreground">Mode Gelap</span>
          <span className="text-[10px] text-muted-foreground mt-1">Nyaman di mata</span>
          {isDark && (
            <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary text-white flex items-center justify-center">
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </div>
          )}
        </button>
      </div>
    </section>
  );
}
