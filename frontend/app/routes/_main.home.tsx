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
