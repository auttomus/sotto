import * as React from "react";
import { useNavigate } from "react-router";
import { User } from "lucide-react";
import { useThemeStore } from "~/core/store/useThemeStore";
import { useAuthStore } from "~/core/store/useAuthStore";
import { ThemeSelector } from "~/features/settings/components/ThemeSelector";
import { LogoutButton } from "~/features/settings/components/LogoutButton";
import { AboutCard } from "~/features/settings/components/AboutCard";
import { SupportCard } from "~/features/settings/components/SupportCard";
import { PageHeader } from "~/components/layout/PageHeader";
import { Avatar } from "~/components/ui/Avatar";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";

export default function SettingsRoute() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = React.useState<"umum" | "info">("umum");

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <PageHeader 
        title="Pengaturan & Lainnya" 
        showBackButton 
        tabs={
          <div className="flex w-full border-t border-border bg-card">
            <button
              onClick={() => setActiveTab("umum")}
              className={`flex-1 py-3 text-center text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "umum"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Umum
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`flex-1 py-3 text-center text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "info"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Tentang & Bantuan
            </button>
          </div>
        }
      />

      {/* Content */}
      <div className="p-4 space-y-6 max-w-lg mx-auto w-full">
        {activeTab === "umum" ? (
          <>
            {/* Profile Card Summary */}
            {user && (
              <div className="flex items-center justify-between p-4 bg-card rounded-sm border border-border">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar 
                    src={resolveMediaUrl(user.avatarObjectKey)} 
                    alt={user.displayName} 
                    size="md" 
                    className="h-12 w-12 text-lg uppercase font-bold shrink-0" 
                  />
                  <div className="min-w-0">
                    <h2 className="font-bold text-foreground text-sm leading-tight truncate">{user.displayName}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">@{user.username}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate("/profile?edit=true", { state: { edit: true } })} 
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-border hover:bg-accent rounded-sm text-foreground transition cursor-pointer active:scale-95 shrink-0"
                >
                  <User className="h-3.5 w-3.5" />
                  Edit Profil
                </button>
              </div>
            )}

            {/* Theme Settings */}
            <ThemeSelector isDark={isDark} toggleTheme={toggleTheme} />

            {/* Logout Button */}
            <LogoutButton />
          </>
        ) : (
          <>
            {/* Tentang Aplikasi */}
            <AboutCard />

            {/* Hubungi Dukungan & Saran */}
            <SupportCard />
          </>
        )}
      </div>
    </div>
  );
}

