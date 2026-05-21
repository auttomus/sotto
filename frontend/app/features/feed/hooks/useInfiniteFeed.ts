import { useState, useCallback } from "react";
import { useGetFeedQuery, type GetFeedQuery } from "~/core/apollo/generated";

const PAGE_SIZE = 10;

export type FeedPost = GetFeedQuery["feed"][0];

/**
 * Hook for infinite feed loading.
 * Backend feed(limit) returns first N posts.
 * "Load more" increases limit by PAGE_SIZE.
 */
export function useInfiniteFeed() {
  const [limit, setLimit] = useState(PAGE_SIZE);

  const { data, loading, error, refetch } = useGetFeedQuery({
    variables: { limit },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const posts: FeedPost[] = data?.feed ?? [];
  const hasMore = posts.length >= limit;
  const isInitialLoad = loading && posts.length === 0;
  const isLoadingMore = loading && posts.length > 0;

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setLimit((prev) => prev + PAGE_SIZE);
    }
  }, [loading, hasMore]);

  const refresh = useCallback(() => {
    setLimit(PAGE_SIZE);
    return refetch({ limit: PAGE_SIZE });
  }, [refetch]);

  return {
    posts,
    loading,
    isInitialLoad,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}
