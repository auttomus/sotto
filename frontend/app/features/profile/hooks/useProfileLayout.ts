import { useState } from "react";
import { useFollowAccountMutation, useUnfollowAccountMutation } from "~/core/apollo/generated";
import { useToastStore } from "~/core/store/useToastStore";

interface UseProfileLayoutOptions {
  profile: any;
}

export function useProfileLayout({ profile }: UseProfileLayoutOptions) {
  const [activeTab, setActiveTab] = useState<"posts" | "listings" | "replies">("posts");
  const [isEditing, setIsEditing] = useState(false);
  const addToast = useToastStore(s => s.addToast);

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

  return {
    activeTab,
    setActiveTab,
    isEditing,
    setIsEditing,
    handleFollowToggle,
    isFollowLoading
  };
}
