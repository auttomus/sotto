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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Avatar } from "~/components/ui/Avatar";
import { useDialogStore } from "~/core/store/useDialogStore";
import { cn } from "~/core/utils/cn";
import { ThreadAncestors } from "./ThreadAncestors";

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
  isThreadParent?: boolean;
  hideAncestors?: boolean;
  preloadedListing?: any;
}

// 1. Reusable Dropdown Menu Component
interface PostDropdownMenuProps {
  showMenu: boolean;
  setShowMenu: (val: boolean) => void;
  setIsEditing: (val: boolean) => void;
  onDelete: () => void;
}

function PostDropdownMenu({
  showMenu,
  setShowMenu,
  setIsEditing,
  onDelete
}: PostDropdownMenuProps) {
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors cursor-pointer animate-fade-in"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {showMenu && (
        <div className="absolute right-0 mt-1 z-30 bg-popover text-popover-foreground border border-border rounded-sm shadow-lg p-1.5 min-w-[120px] flex flex-col gap-0.5 animate-scale-in">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
              setShowMenu(false);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground rounded-lg text-left w-full cursor-pointer font-semibold"
          >
            <Pencil className="h-3.5 w-3.5" />
            Sunting
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              setShowMenu(false);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/10 rounded-lg text-left w-full cursor-pointer font-semibold"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Hapus
          </button>
        </div>
      )}
    </div>
  );
}

// 2. Reusable Content Block Component
interface PostCardContentProps {
  post: ExtendedPost;
  isEditing: boolean;
  editContent: string;
  setEditContent: (val: string) => void;
  setIsEditing: (val: boolean) => void;
  updatePost: any;
  listing: any;
  textSizeClass?: string;
}

function PostCardContent({
  post,
  isEditing,
  editContent,
  setEditContent,
  setIsEditing,
  updatePost,
  listing,
  textSizeClass = "text-[15px]"
}: PostCardContentProps) {
  return (
    <div className="mb-2">
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
          <p className={cn("text-foreground leading-relaxed mb-2 whitespace-pre-wrap line-clamp-6 font-medium", textSizeClass)}>
            {formatMentions(post.content)}
          </p>
        </Link>
      )}

      {/* Media Carousel */}
      {post.media && post.media.length > 0 && (
        <div onClick={(e) => e.stopPropagation()} className="mb-2">
          <PostMediaCarousel media={post.media} />
        </div>
      )}

      {/* Linked Listing Card */}
      {post.linkedServiceId && listing && (
        <div onClick={(e) => e.stopPropagation()} className="mb-2">
          <ListingCard listing={listing as any} isLink={true} className="mt-2" />
        </div>
      )}
    </div>
  );
}

export function PostCard({ post: rawPost, isThreadParent, hideAncestors, preloadedListing }: PostCardProps) {
  const post = rawPost as ExtendedPost;
  const navigate = useNavigate();
  const avatarUrl = resolveMediaUrl(post.authorAvatarObjectKey);

  const [liked, setLiked] = useState(post.likedByMe || false);
  const [count, setCount] = useState(post.likesCount || 0);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || "");
  const confirm = useDialogStore((s) => s.confirm);

  const { user } = useAuthStore();
  const addToast = useToastStore((s) => s.addToast);

  const isMine = post.authorId === user?.accountId;

  const { data: listingData } = useGetListingDetailQuery({
    variables: { id: post.linkedServiceId || "" },
    skip: !post.linkedServiceId || !!preloadedListing,
  });

  const listing = preloadedListing || listingData?.listing;

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

  const handleDelete = async () => {
    const isAccepted = await confirm({
      title: "Hapus Postingan",
      message: "Apakah Anda yakin ingin menghapus postingan ini? Tindakan ini tidak dapat dibatalkan.",
      confirmText: "Hapus",
      cancelText: "Batal",
      variant: "destructive",
      maxWidth: "sm",
    });
    if (isAccepted) {
      await deletePost({ variables: { postId: post.postId } });
    }
  };

  // CONDITIONAL RENDER: Thread Parent Layout
  if (isThreadParent) {
    return (
      <>
        <article
          onClick={handleCardClick}
          className="bg-card px-5 pt-4 pb-0 border-b-0 hover:bg-accent/5 transition-all duration-200 cursor-pointer flex gap-3 relative"
        >
          {/* Left Column: Avatar + Thread Connector Line */}
          <div className="flex flex-col items-center shrink-0 w-10 relative">
            <Link
              to={post.authorUsername ? ROUTES.PROFILE_PUBLIC(post.authorUsername) : "#"}
              className="group z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <Avatar src={avatarUrl || ""} alt={post.authorDisplayName || ""} size="md" />
            </Link>
            {/* Vertical line stretching downwards from avatar bottom to article bottom */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[52px] bottom-0 w-[2px] bg-border z-0" />
          </div>

          {/* Right Column: Content */}
          <div className="flex-1 min-w-0">
            <PostHeader
              post={post}
              avatarUrl={avatarUrl || ""}
              isMine={isMine}
              showMenu={showMenu}
              setShowMenu={setShowMenu}
              setIsEditing={setIsEditing}
              onDelete={handleDelete}
              hideAvatar={true}
            />

            {/* Content Block */}
            <PostCardContent
              post={post}
              isEditing={isEditing}
              editContent={editContent}
              setEditContent={setEditContent}
              setIsEditing={setIsEditing}
              updatePost={updatePost}
              listing={listing}
              textSizeClass="text-[14px]"
            />

            {/* Actions */}
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
          </div>
        </article>
      </>
    );
  }

  // DEFAULT RENDER: Standard Layout
  const card = (
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
        onDelete={handleDelete}
      />

      {/* Content Block */}
      <PostCardContent
        post={post}
        isEditing={isEditing}
        editContent={editContent}
        setEditContent={setEditContent}
        setIsEditing={setIsEditing}
        updatePost={updatePost}
        listing={listing}
        textSizeClass="text-[15px]"
      />

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

  // If this is a reply and not rendered as a thread parent, render its ancestors chain above it
  if (post.inReplyToPostId && !isThreadParent && !hideAncestors) {
    return (
      <div className="flex flex-col">
        <ThreadAncestors parentId={post.inReplyToPostId} />
        {card}
      </div>
    );
  }

  return card;
}
