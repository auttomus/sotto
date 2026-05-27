import * as React from "react";
import { useState } from "react";
import type { GetFeedQuery } from "~/core/apollo/generated";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import { Link, useNavigate } from "react-router";
import { ROUTES } from "~/core/constants/ROUTES";
import { formatMentions } from "~/core/utils/formatMentions";
import * as Generated from "~/core/apollo/generated";
import { ListingCard } from "~/features/listings/components/ListingCard";
import { useAuthStore } from "~/core/store/useAuthStore";
import { useToastStore } from "~/core/store/useToastStore";
import { shareObject } from "~/core/utils/share";
import { PostHeader } from "./postcard/PostHeader";
import { PostEditor } from "./postcard/PostEditor";
import { PostMediaCarousel } from "./postcard/PostMediaCarousel";
import { PostActions } from "./postcard/PostActions";

const useToggleLikePostMutation = (Generated as any).useToggleLikePostMutation || (() => [() => Promise.resolve()]);
const useGetListingDetailQuery = (Generated as any).useGetListingDetailQuery || (() => ({ data: null, loading: false }));

type FeedPost = GetFeedQuery["feed"][0];

// Tipe data postingan yang diekstensi
type ExtendedPost = FeedPost & {
  linkedServiceId?: string | null;
  inReplyToPostId?: string | null;
  likesCount?: number | null;
  likedByMe?: boolean | null;
  tags?: { id: string; name: string }[] | null;
};

interface PostCardProps {
  post: FeedPost;
}

export function PostCard({ post: rawPost }: PostCardProps) {
  const post = rawPost as ExtendedPost;
  const navigate = useNavigate();
  const avatarUrl = resolveMediaUrl(post.authorAvatarObjectKey);

  const [liked, setLiked] = useState(post.likedByMe || false);
  const [count, setCount] = useState(post.likesCount || 0);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || "");

  const { user } = useAuthStore();
  const addToast = useToastStore((s) => s.addToast);

  const isMine = post.authorId === user?.accountId;

  const { data: listingData } = useGetListingDetailQuery({
    variables: { id: post.linkedServiceId || "" },
    skip: !post.linkedServiceId,
  });

  const listing = listingData?.listing;

  React.useEffect(() => {
    setLiked(post.likedByMe || false);
    setCount(post.likesCount || 0);
  }, [post.likedByMe, post.likesCount]);

  React.useEffect(() => {
    if (!showMenu) return;
    const handleClose = () => setShowMenu(false);
    window.addEventListener("click", handleClose);
    return () => window.removeEventListener("click", handleClose);
  }, [showMenu]);

  const [deletePost] = Generated.useDeletePostMutation({
    refetchQueries: ["GetFeed", "GetGlobalFeed"],
    onCompleted: () => {
      addToast("success", "Postingan berhasil dihapus");
    },
    onError: (err) => {
      addToast("error", err.message);
    }
  });

  const [updatePost] = Generated.useUpdatePostMutation({
    refetchQueries: ["GetFeed", "GetGlobalFeed"],
    onCompleted: () => {
      addToast("success", "Postingan berhasil diperbarui");
    },
    onError: (err) => {
      addToast("error", err.message);
    }
  });

  const [toggleLike] = useToggleLikePostMutation({
    variables: { postId: post.postId },
    optimisticResponse: {
      __typename: "Mutation",
      toggleLikePost: !liked,
    },
    update(cache: any, { data }: any) {
      const newLikedState = data && typeof data.toggleLikePost === "boolean"
        ? data.toggleLikePost
        : !liked;

      cache.modify({
        id: cache.identify(post),
        fields: {
          likedByMe() {
            return newLikedState;
          },
          likesCount(existing: number = 0) {
            return newLikedState ? existing + 1 : Math.max(0, existing - 1);
          },
        },
      });
    },
  });

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextLiked = !liked;
    const nextCount = nextLiked ? count + 1 : Math.max(0, count - 1);
    setLiked(nextLiked);
    setCount(nextCount);

    toggleLike().catch(() => {
      setLiked(!nextLiked);
      setCount(liked ? count : Math.max(0, count - 1));
    });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const interactiveElement = target.closest("a, button, textarea, input, [role='button']");
    if (interactiveElement) {
      return;
    }
    navigate(ROUTES.POST_DETAIL(post.postId));
  };

  return (
    <article 
      onClick={handleCardClick}
      className="bg-card p-5 border-b border-border hover:bg-accent/5 transition-all duration-200 cursor-pointer"
    >
      {/* Header */}
      <PostHeader
        post={post}
        avatarUrl={avatarUrl || ""}
        isMine={isMine}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        setIsEditing={setIsEditing}
        onDelete={async () => {
          if (confirm("Apakah Anda yakin ingin menghapus postingan ini?")) {
            await deletePost({ variables: { postId: post.postId } });
          }
        }}
      />

      {/* Body */}
      <div className="mb-3">
        {isEditing ? (
          <PostEditor
            editContent={editContent}
            setEditContent={setEditContent}
            onCancel={() => {
              setIsEditing(false);
              setEditContent(post.content || "");
            }}
            onSave={async () => {
              if (editContent.trim() && editContent.trim() !== post.content) {
                await updatePost({
                  variables: {
                    postId: post.postId,
                    input: { content: editContent.trim() }
                  }
                });
              }
              setIsEditing(false);
            }}
          />
        ) : (
          <Link to={ROUTES.POST_DETAIL(post.postId)} className="block group/content hover:opacity-95 transition-opacity">
            <p className="text-foreground text-[15px] leading-relaxed mb-3 whitespace-pre-wrap line-clamp-6 font-medium">
              {formatMentions(post.content)}
            </p>
          </Link>
        )}

        {/* Media Carousel */}
        {post.media && post.media.length > 0 && (
          <div onClick={(e) => e.stopPropagation()}>
            <PostMediaCarousel media={post.media} />
          </div>
        )}

        {/* Linked Listing Card */}
        {post.linkedServiceId && listing && (
          <div onClick={(e) => e.stopPropagation()}>
            <ListingCard 
              listing={listing as any} 
              isLink={true} 
              className="mt-3 bg-muted/50 hover:bg-muted border border-border" 
            />
          </div>
        )}
      </div>

      {/* Actions (Like, Comment, Share) */}
      <PostActions
        postId={post.postId}
        isLiked={liked}
        likesCount={count}
        repliesCount={post.repliesCount ?? 0}
        onLike={handleLike}
        onShare={() => shareObject({
          title: `Karya dari ${post.authorDisplayName || post.authorUsername}`,
          text: post.content,
          url: ROUTES.POST_DETAIL(post.postId)
        })}
      />
    </article>
  );
}
