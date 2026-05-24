import { useEffect, useRef, useCallback } from "react";
import { Plus, Loader2 } from "lucide-react";
import { PostCard } from "~/features/feed/components/PostCard";
import { FeedEmptyState } from "~/features/feed/components/FeedEmptyState";
import { Link } from "react-router";
import { PostCardSkeleton } from "~/components/ui/Skeleton";
import { useToastStore } from "~/core/store/useToastStore";
import { useInfiniteFeed } from "~/features/feed/hooks/useInfiniteFeed";
import { ROUTES } from "~/core/constants/ROUTES";

export default function FeedTimelineRoute() {
  const {
    posts,
    isInitialLoad,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
  } = useInfiniteFeed();

  const addToast = useToastStore((s) => s.addToast);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Error toast
  useEffect(() => {
    if (error) {
      addToast("error", `Gagal memuat feed: ${error.message}`);
    }
  }, [error, addToast]);

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoadingMore) {
        loadMore();
      }
    },
    [hasMore, isLoadingMore, loadMore]
  );

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "200px",
    });
    observer.observe(node);

    return () => observer.disconnect();
  }, [handleObserver]);

  // Initial skeleton
  if (isInitialLoad) {
    return (
      <div className="flex flex-col pb-20">
        {[1, 2, 3].map((i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="pb-20 relative min-h-screen">
      {/* Sticky Premium Header */}
      <header className="sticky top-16 md:top-0 z-30 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="flex flex-col">
          <div className="hidden md:flex items-center justify-between px-6 pt-4 pb-2">
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
              Beranda
            </h1>
            <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sinergi Aktif
            </div>
          </div>
          
          {/* Tabs selector */}
          <div className="flex w-full border-t border-gray-50 dark:border-gray-800/40 md:border-t-0">
            <button className="flex-1 py-3.5 text-center text-sm font-bold text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 transition-colors">
              Untuk Anda
            </button>
            <button className="flex-1 py-3.5 text-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-all duration-200">
              Mengikuti
            </button>
          </div>
        </div>
      </header>

      {/* Posts */}
      <div className="flex flex-col">
        {posts.length === 0 ? (
          <FeedEmptyState />
        ) : (
          <>
            {posts.map((post) => (
              <PostCard key={post.postId} post={post} />
            ))}

            {/* Load more sentinel */}
            <div ref={sentinelRef} className="h-1" />

            {/* Loading more indicator */}
            {isLoadingMore && (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
              </div>
            )}

            {/* End of feed */}
            {!hasMore && posts.length > 0 && (
              <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">
                Sudah di ujung linimasa
              </div>
            )}
          </>
        )}
      </div>

      {/* FAB — Create Post */}
      <Link
        to={ROUTES.WORKSPACE_CREATE}
        className="fixed bottom-20 right-4 md:hidden z-40 bg-indigo-600 text-white h-14 w-14 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all"
        aria-label="Buat Postingan Baru"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
}
