import * as React from "react";
import { LogOut, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/Button";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/core/store/useAuthStore";
import { useToastStore } from "~/core/store/useToastStore";

export function LogoutButton() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
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
    <section className="pt-4">
      <Button 
        variant="danger" 
        className="w-full h-12 rounded-sm flex items-center justify-center gap-2 font-bold shadow-lg shadow-destructive/10 text-xs cursor-pointer active:scale-[0.98]"
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
  );
}
