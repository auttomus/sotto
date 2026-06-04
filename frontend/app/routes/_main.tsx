import { Outlet, useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import TopHeader from "../components/layout/TopHeader";
import BottomNav from "../components/layout/BottomNav";
import DesktopSidebar from "../components/layout/DesktopSidebar";
import { useThemeStore } from "~/core/store/useThemeStore";
import { useAuthStore } from "~/core/store/useAuthStore";
import { useLayoutStore } from "~/core/store/useLayoutStore";
import { ROUTES } from "~/core/constants/ROUTES";
import { cn } from "~/core/utils/cn";
import { useGetMyProfileLazyQuery } from "~/core/apollo/generated";
import { Loader2 } from "lucide-react";

export default function MainLayout() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const initTheme = useThemeStore((s) => s.initTheme);
  const token = useAuthStore((s) => s.token);
  const { logout, setUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { isSidebarCollapsed, setSidebarCollapsed } = useLayoutStore();

  const [fetchProfile] = useGetMyProfileLazyQuery({
    fetchPolicy: "network-only",
  });

  // 1. Wait for hydration of the auth store
  useEffect(() => {
    setIsHydrated(useAuthStore.persist.hasHydrated());
    const unsubHydrate = useAuthStore.persist.onHydrate(() => setIsHydrated(false));
    const unsubFinish = useAuthStore.persist.onFinishHydration(() => setIsHydrated(true));
    return () => {
      unsubHydrate();
      unsubFinish();
    };
  }, []);

  // 2. Validate session once hydrated
  useEffect(() => {
    initTheme();

    if (!isHydrated) return;

    if (!token) {
      navigate(ROUTES.LOGIN, { replace: true });
      return;
    }

    if (hasChecked) return;

    setIsCheckingSession(true);
    fetchProfile()
      .then(({ data, error }) => {
        if (error) {
          const apolloErr = error as any;
          const isNetworkError = !!apolloErr.networkError;
          const isUnauthorized = Array.isArray(apolloErr.graphQLErrors) && apolloErr.graphQLErrors.some(
            (ge: any) =>
              ge.message === "Unauthorized" ||
              ge.extensions?.code === "UNAUTHORIZED" ||
              ge.extensions?.code === "UNAUTHENTICATED"
          );

          if (isUnauthorized) {
            logout();
            navigate(ROUTES.LOGIN, { replace: true });
          } else if (isNetworkError) {
            // Network issue, preserve session
            setHasChecked(true);
          } else {
            // Other GraphQL errors, keep session just in case it's a backend glitch
            setHasChecked(true);
          }
        } else if (!data?.myProfile) {
          logout();
          navigate(ROUTES.LOGIN, { replace: true });
        } else {
          setUser({
            id: data.myProfile.id,
            accountId: data.myProfile.id,
            username: data.myProfile.username,
            displayName: data.myProfile.displayName,
            avatarObjectKey: data.myProfile.avatarObjectKey ?? undefined,
          });
          setHasChecked(true);
        }
        setIsCheckingSession(false);
      })
      .catch((err) => {
        const isNetworkError = err && (err.networkError || (err.message && (
          err.message.toLowerCase().includes("failed to fetch") || 
          err.message.toLowerCase().includes("network")
        )));
        if (!isNetworkError) {
          logout();
          navigate(ROUTES.LOGIN, { replace: true });
        } else {
          setHasChecked(true);
        }
        setIsCheckingSession(false);
      });
  }, [isHydrated, token, hasChecked, fetchProfile, logout, setUser, navigate, initTheme]);

  // Automate sidebar collapse and BottomNav visibility based on route
  const collapsedRoutes = ["/chats", "/workspace/chat", "/orders", "/workspace/order"];
  const hideBottomNavRoutes = ["/workspace/chat", "/workspace/order"];

  const shouldCollapseSidebar = collapsedRoutes.some(route => location.pathname.startsWith(route));
  const shouldHideBottomNav = hideBottomNavRoutes.some(route => location.pathname.startsWith(route));

  useEffect(() => {
    setSidebarCollapsed(shouldCollapseSidebar);
  }, [location.pathname, shouldCollapseSidebar, setSidebarCollapsed]);

  const user = useAuthStore((s) => s.user);
  const isBlocking = !isHydrated || (token && !user && isCheckingSession);

  if (isBlocking) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse font-medium">
            Memuat sesi Anda...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <div className={cn(
        "mx-auto flex w-full relative min-h-screen transition-all duration-300",
        isSidebarCollapsed ? "max-w-[1200px]" : "max-w-[960px]"
      )}>
        <DesktopSidebar />

        <div className="flex-1 flex flex-col transition-all w-full min-w-0">

          <main className={cn(
            "flex-1 w-full bg-card shadow-sm min-h-screen border-x border-border md:border-l-0 relative pb-16 md:pb-0 transition-colors duration-300",
            isSidebarCollapsed ? "border-r-0" : ""
          )}>
            <Outlet />
          </main>

          {!shouldHideBottomNav && (
            <div className="md:hidden">
              <BottomNav />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
