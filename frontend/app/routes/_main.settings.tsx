import * as React from "react";
import { useNavigate } from "react-router";
import { User, ChevronRight } from "lucide-react";
import { useThemeStore } from "~/core/store/useThemeStore";
import { useAuthStore } from "~/core/store/useAuthStore";
import { ThemeSelector } from "~/features/settings/components/ThemeSelector";
import { LogoutButton } from "~/features/settings/components/LogoutButton";
import { PageHeader } from "~/components/layout/PageHeader";

export default function SettingsRoute() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader title="Pengaturan & Lainnya" showBackButton />

      {/* Content */}
      <div className="p-4 space-y-6 max-w-lg mx-auto w-full">
        {/* Profile Card Summary */}
        {user && (
          <div className="flex items-center gap-3 p-4 bg-card rounded-md border border-border">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg uppercase">
              {user.displayName[0]}
            </div>
            <div>
              <h2 className="font-bold text-foreground text-sm leading-tight">{user.displayName}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">@{user.username}</p>
            </div>
          </div>
        )}

        {/* Theme Settings */}
        <ThemeSelector isDark={isDark} toggleTheme={toggleTheme} />

        {/* Menu Tautan */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Menu & Akun</h2>
          <div className="space-y-2">
            <button 
              onClick={() => navigate("/profile")} 
              className="w-full flex items-center justify-between p-4 bg-card hover:bg-accent/5 rounded-md border border-border transition group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-muted text-foreground">
                  <User className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-xs text-foreground">Edit Profil</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Ganti avatar, bio, atau nama tampilan</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </section>

        {/* Logout Button */}
        <LogoutButton />
      </div>
    </div>
  );
}
