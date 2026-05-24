import { useState, useCallback, useEffect } from "react";
import { 
  useGetFeedQuery, 
  useGetGlobalFeedQuery, 
  type GetFeedQuery, 
  type GetGlobalFeedQuery 
} from "~/core/apollo/generated";

const PAGE_SIZE = 10;

export type FeedPost = GetFeedQuery["feed"][0];

/**
 * Hook for infinite feed loading.
 * Supports "for-you" (global posts) and "following" (followed accounts).
 */
export function useInfiniteFeed(type: "for-you" | "following" = "for-you") {
  const [limit, setLimit] = useState(PAGE_SIZE);

  // Reset limit when type changes
  useEffect(() => {
    setLimit(PAGE_SIZE);
  }, [type]);

  const followingResult = useGetFeedQuery({
    variables: { limit },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    skip: type !== "following",
  });

  const globalResult = useGetGlobalFeedQuery({
    variables: { limit },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    skip: type !== "for-you",
  });

  const activeResult = type === "following" ? followingResult : globalResult;
  const posts = (type === "following" ? followingResult.data?.feed : globalResult.data?.globalFeed) ?? [];

  const loading = activeResult.loading;
  const error = activeResult.error;
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
    return activeResult.refetch({ limit: PAGE_SIZE });
  }, [activeResult]);

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
