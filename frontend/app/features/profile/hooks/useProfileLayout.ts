import * as React from "react";
import { useState } from "react";
import { useLocation, useSearchParams } from "react-router";
import { 
  useFollowAccountMutation, 
  useUnfollowAccountMutation,
  useGetFollowersLazyQuery,
  useGetFollowingLazyQuery
} from "~/core/apollo/generated";
import { useToastStore } from "~/core/store/useToastStore";

interface UseProfileLayoutOptions {
  profile: any;
}

export function useProfileLayout({ profile }: UseProfileLayoutOptions) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get("view"); // "followers" or "following"

  const [activeTab, setActiveTab] = useState<"posts" | "listings" | "replies" | "likes">("posts");
  const [isEditing, setIsEditing] = useState(() => {
    if (location.state && typeof location.state === "object" && "edit" in location.state && location.state.edit) {
      return true;
    }
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("edit") === "true";
  });
  const addToast = useToastStore(s => s.addToast);

  // Profile-level follow actions
  const [followMutation, { loading: followLoading }] = useFollowAccountMutation({
    onCompleted: () => addToast('success', `Berhasil mengikuti ${profile.displayName}`),
    onError: (e: any) => addToast('error', e.message),
    update: (cache: any) => {
      cache.modify({
        id: cache.identify(profile),
        fields: {
          isFollowing: () => true,
          followersCount: (prev: any = "0") => String(Number(prev) + 1)
        }
      });
    }
  });

  const [unfollowMutation, { loading: unfollowLoading }] = useUnfollowAccountMutation({
    onCompleted: () => addToast('success', `Berhenti mengikuti ${profile.displayName}`),
    onError: (e: any) => addToast('error', e.message),
    update: (cache: any) => {
      cache.modify({
        id: cache.identify(profile),
        fields: {
          isFollowing: () => false,
          followersCount: (prev: any = "1") => String(Math.max(0, Number(prev) - 1))
        }
      });
    }
  });

  const handleFollowToggle = () => {
    if (profile.isFollowing) {
      unfollowMutation({ variables: { targetAccountId: profile.id } });
    } else {
      followMutation({ variables: { targetAccountId: profile.id } });
    }
  };

  const isFollowLoading = followLoading || unfollowLoading;

  // Followers / Following Lists States
  const [items, setItems] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  const [fetchFollowers, { loading: loadingFollowers }] = useGetFollowersLazyQuery({
    fetchPolicy: "network-only"
  });
  const [fetchFollowing, { loading: loadingFollowing }] = useGetFollowingLazyQuery({
    fetchPolicy: "network-only"
  });

  const [followItem] = useFollowAccountMutation();
  const [unfollowItem] = useUnfollowAccountMutation();

  const loadNextPage = async (isReset = false) => {
    if (!profile?.id) return;
    const currentCursor = isReset ? undefined : cursor;
    const take = 15;
    const variables = { accountId: profile.id, cursor: currentCursor, take };

    try {
      let newItems: any[] = [];
      if (view === "followers") {
        const res = await fetchFollowers({ variables });
        newItems = res.data?.followers || [];
      } else if (view === "following") {
        const res = await fetchFollowing({ variables });
        newItems = res.data?.following || [];
      }

      if (newItems.length < take) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (newItems.length > 0) {
        const lastItem = newItems[newItems.length - 1];
        setCursor(lastItem.id);

        setItems(prev => {
          const merged = isReset ? [...newItems] : [...prev, ...newItems];
          const unique = merged.filter((item, index, self) =>
            self.findIndex(t => t.id === item.id) === index
          );
          return unique;
        });
      } else {
        if (isReset) setItems([]);
        setHasMore(false);
      }
    } catch (err: any) {
      addToast("error", err.message || "Gagal memuat daftar");
    }
  };

  React.useEffect(() => {
    if (view && profile?.id) {
      setItems([]);
      setCursor(undefined);
      setHasMore(true);
      loadNextPage(true);
    }
  }, [view, profile?.id]);

  const sentinelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!view || !hasMore || loadingFollowers || loadingFollowing) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadNextPage(false);
      }
    }, { threshold: 0.1 });

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [sentinelRef, view, hasMore, cursor, loadingFollowers, loadingFollowing]);

  const handleItemFollowToggle = async (item: any) => {
    const originalState = item.isFollowing;
    const newState = !originalState;

    setItems(prev => prev.map(u => u.id === item.id ? { ...u, isFollowing: newState } : u));

    try {
      if (originalState) {
        await unfollowItem({ variables: { targetAccountId: item.id } });
        addToast("success", `Berhenti mengikuti ${item.displayName}`);
      } else {
        await followItem({ variables: { targetAccountId: item.id } });
        addToast("success", `Mengikuti ${item.displayName}`);
      }
    } catch (err: any) {
      setItems(prev => prev.map(u => u.id === item.id ? { ...u, isFollowing: originalState } : u));
      addToast("error", err.message || "Gagal memperbarui status ikuti");
    }
  };

  return {
    activeTab,
    setActiveTab,
    isEditing,
    setIsEditing,
    handleFollowToggle,
    isFollowLoading,
    
    // Followers / Following Lists
    searchParams,
    setSearchParams,
    view,
    items,
    loadingFollowers,
    loadingFollowing,
    hasMore,
    sentinelRef,
    handleItemFollowToggle
  };
}
