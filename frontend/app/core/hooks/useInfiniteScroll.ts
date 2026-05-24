import { useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollProps {
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
}

export function useInfiniteScroll({
  hasMore,
  isLoadingMore,
  onLoadMore,
  rootMargin = "200px"
}: UseInfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoadingMore) {
        onLoadMore();
      }
    },
    [hasMore, isLoadingMore, onLoadMore]
  );

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin,
    });
    observer.observe(node);

    return () => observer.disconnect();
  }, [handleObserver, rootMargin]);

  return { sentinelRef };
}
