import { useEffect } from "react";
import { useNavigate } from "react-router";
import RegisterWizard from "~/features/auth/components/RegisterWizard";
import { useAuthStore } from "~/core/store/useAuthStore";
import { useThemeStore } from "~/core/store/useThemeStore";
import { ROUTES } from "~/core/constants/ROUTES";

export default function RegisterRoute() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
    if (isAuthenticated) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isAuthenticated, navigate, initTheme]);

  return <RegisterWizard />;
}
