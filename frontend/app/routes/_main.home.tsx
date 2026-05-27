import { useEffect, useState } from "react";
import { Plus, Loader2, Bell } from "lucide-react";
import { PostCard } from "~/features/feed/components/PostCard";
import { FeedEmptyState } from "~/features/feed/components/FeedEmptyState";
import { Link } from "react-router";
import { PostCardSkeleton } from "~/components/ui/Skeleton";
import { useToastStore } from "~/core/store/useToastStore";
import { useInfiniteFeed } from "~/features/feed/hooks/useInfiniteFeed";
import { ROUTES } from "~/core/constants/ROUTES";
import { useScrollDirection } from "~/core/hooks/useScrollDirection";
import { useInfiniteScroll } from "~/core/hooks/useInfiniteScroll";
import { PageHeader } from "~/components/layout/PageHeader";

export default function FeedTimelineRoute() {
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("for-you");
  const { showHeader } = useScrollDirection();

  const {
    posts,
    isInitialLoad,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
  } = useInfiniteFeed(activeTab);

  const addToast = useToastStore((s) => s.addToast);

  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    isLoadingMore,
    onLoadMore: loadMore,
  });

  // Error toast
  useEffect(() => {
    if (error) {
      addToast("error", `Gagal memuat feed: ${error.message}`);
    }
  }, [error, addToast]);

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
      <PageHeader
        title={
          <>
            <span className="md:hidden text-xl font-bold tracking-tight text-primary font-serif italic">
              Sotto
            </span>
            <span className="hidden md:inline">Beranda</span>
          </>
        }
        rightAction={
          <button className="p-2 -mr-1 rounded-full hover:bg-muted transition relative md:hidden cursor-pointer">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
          </button>
        }
        tabs={
          <div className="flex w-full border-t border-border">
            <button
              onClick={() => setActiveTab("for-you")}
              className={`flex-1 py-3 text-center text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "for-you"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Untuk Anda
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={`flex-1 py-3 text-center text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "following"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mengikuti
            </button>
          </div>
        }
      />

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
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}

            {/* End of feed */}
            {!hasMore && posts.length > 0 && (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Sudah di ujung linimasa
              </div>
            )}
          </>
        )}
      </div>

      {/* FAB — Create Post */}
      <Link
        to={ROUTES.WORKSPACE_CREATE}
        className="fixed bottom-20 right-4 md:hidden z-40 bg-primary text-primary-foreground h-14 w-14 rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:opacity-90 hover:scale-105 active:scale-95 transition-all"
        aria-label="Buat Postingan Baru"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
}
