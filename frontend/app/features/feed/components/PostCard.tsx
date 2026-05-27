import * as React from "react";
import { useState, useRef } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal, ChevronLeft, ChevronRight, X, Pencil, Trash2 } from "lucide-react";
import { Avatar } from "~/components/ui/Avatar";
import { Badge } from "~/components/ui/Badge";
import type { GetFeedQuery } from "~/core/apollo/generated";
import { formatDate } from "~/core/utils/formatDate";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import { Link } from "react-router";
import { ROUTES } from "~/core/constants/ROUTES";
import { cn } from "~/core/utils/cn";
import * as Generated from "~/core/apollo/generated";
import { ListingCard } from "~/features/listings/components/ListingCard";
import { useAuthStore } from "~/core/store/useAuthStore";
import { useToastStore } from "~/core/store/useToastStore";
import { shareObject } from "~/core/utils/share";
import { LabelBadge } from "~/components/ui/LabelBadge";

const useToggleLikePostMutation = (Generated as any).useToggleLikePostMutation || (() => [() => Promise.resolve()]);
const useGetListingDetailQuery = (Generated as any).useGetListingDetailQuery || (() => ({ data: null, loading: false }));

type FeedPost = GetFeedQuery["feed"][0];

// Extended post type — fields available after codegen re-run
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

  const handleLike = () => {
    const nextLiked = !liked;
    const nextCount = nextLiked ? count + 1 : Math.max(0, count - 1);
    setLiked(nextLiked);
    setCount(nextCount);

    toggleLike().catch(() => {
      setLiked(!nextLiked);
      setCount(liked ? count : Math.max(0, count - 1));
    });
  };  return (
    <article className="bg-card p-5 border-b border-border hover:bg-accent/5 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <Link
            to={post.authorUsername ? ROUTES.PROFILE_PUBLIC(post.authorUsername) : "#"}
            className="shrink-0 group"
          >
            <Avatar
              src={avatarUrl}
              alt={post.authorDisplayName || post.authorUsername || ""}
              size="md"
            />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link
                to={post.authorUsername ? ROUTES.PROFILE_PUBLIC(post.authorUsername) : "#"}
                className="font-semibold text-foreground text-sm hover:text-primary transition-colors"
              >
                {post.authorDisplayName || post.authorUsername}
              </Link>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                · {formatDate(post.createdAt as string)}
                {post.editedAt && (
                  <span className="text-[10px] italic text-primary font-medium ml-1">
                    (diedit)
                  </span>
                )}
              </span>
            </div>
            {post.authorSchoolName && (
              <div className="mt-0.5">
                <Link to={post.authorUsername ? ROUTES.PROFILE_PUBLIC(post.authorUsername) : "#"}>
                  <LabelBadge variant="school" value={post.authorSchoolName} />
                </Link>
              </div>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {post.tags.map((tag: any) => (
                  <Link
                    key={tag.id}
                    to={`/explore?query=${encodeURIComponent(tag.name)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="hover:-translate-y-0.5 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <LabelBadge
                      variant="tag"
                      value={tag.name}
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        {isMine && (
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors cursor-pointer"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 z-30 bg-popover text-popover-foreground border border-border rounded-xl shadow-lg p-1.5 min-w-[120px] flex flex-col gap-0.5 animate-scale-in">
                <button
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
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (confirm("Apakah Anda yakin ingin menghapus postingan ini?")) {
                      await deletePost({ variables: { postId: post.postId } });
                    }
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
        )}
      </div>

      {/* Body */}
      <div className="mb-3">
        {isEditing ? (
          <div className="bg-muted p-3 rounded-2xl border border-border mb-3 flex flex-col gap-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full text-[14px] bg-background text-foreground rounded-xl p-3 border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring resize-none font-medium leading-relaxed"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(post.content || "");
                }}
                className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={async () => {
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
                className="px-4 py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded-xl hover:opacity-90 active:scale-[0.98] transition cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </div>
        ) : (
          <Link to={ROUTES.POST_DETAIL(post.postId)} className="block group/content hover:opacity-95 transition-opacity">
            <p className="text-foreground text-[15px] leading-relaxed mb-3 whitespace-pre-wrap line-clamp-6 font-medium">
              {post.content}
            </p>
          </Link>
        )}

        {/* Media Carousel */}
        {post.media && post.media.length > 0 && (
          <MediaCarousel media={post.media} />
        )}

        {/* Linked Listing Card */}
        {post.linkedServiceId && listing && (
          <ListingCard 
            listing={listing as any} 
            isLink={true} 
            className="mt-3 bg-muted/50 hover:bg-muted border border-border" 
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 mt-1">
        <button
          onClick={handleLike}
          className={cn(
            "flex items-center gap-1.5 transition-colors group",
            liked
              ? "text-rose-500 hover:text-rose-600 animate-pulse-once"
              : "text-muted-foreground hover:text-rose-500"
          )}
        >
          <div className={cn(
            "p-1.5 rounded-full transition-colors",
            liked
              ? "bg-rose-500/10"
              : "group-hover:bg-rose-500/10"
          )}>
            <Heart
              className={cn("h-5 w-5 transition-transform group-active:scale-125", liked && "fill-current")}
              strokeWidth={liked ? 0 : 2}
            />
          </div>
          <span className="text-xs font-semibold">{count}</span>
        </button>
        <Link
          to={ROUTES.POST_DETAIL(post.postId)}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group"
        >
          <div className="p-1.5 rounded-full group-hover:bg-primary/10 transition-colors">
            <MessageCircle className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium">{post.repliesCount ?? 0}</span>
        </Link>
        <button 
          onClick={() => shareObject({
            title: `Karya dari ${post.authorDisplayName || post.authorUsername}`,
            text: post.content,
            url: ROUTES.POST_DETAIL(post.postId)
          })}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-success transition-colors group ml-auto cursor-pointer"
        >
          <div className="p-1.5 rounded-full group-hover:bg-success/10 transition-colors">
            <Share2 className="h-5 w-5" />
          </div>
        </button>
      </div>
    </article>
  );
}

/* ─── Media Carousel ─── */

type MediaItem = NonNullable<FeedPost["media"]>[0];

function MediaCarousel({ media }: { media: MediaItem[] }) {
  const [current, setCurrent] = useState(0);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const total = media.length;

  const scrollTo = (idx: number) => {
    const clamped = Math.max(0, Math.min(idx, total - 1));
    setCurrent(clamped);
    scrollRef.current?.children[clamped]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.offsetWidth;
    const newIndex = Math.round(scrollLeft / itemWidth);
    if (newIndex !== current) setCurrent(newIndex);
  };

  React.useEffect(() => {
    if (lightboxUrl) {
      document.body.style.overflow = "hidden";
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") setLightboxUrl(null);
      };
      window.addEventListener("keydown", handleEscape);
      return () => {
        window.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [lightboxUrl]);

  if (total === 0) return null;

  if (total === 1) {
    const item = media[0];
    const url = resolveMediaUrl(item.url || (item as any).objectKey);
    return (
      <>
        <div className="rounded-2xl overflow-hidden bg-muted border border-border mt-3 shadow-sm flex items-center justify-center max-h-[512px] w-full cursor-zoom-in group/media">
          <img
            src={url || ""}
            alt={item.fileName || "Post media"}
            className="w-full h-auto max-h-[512px] object-contain rounded-2xl select-none group-hover/media:brightness-95 transition-all duration-200"
            onClick={() => setLightboxUrl(url ?? null)}
            loading="lazy"
          />
        </div>

        {lightboxUrl && (
          <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center transition-all animate-fade-in duration-200"
            onClick={() => setLightboxUrl(null)}
          >
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 active:scale-95 z-55"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="max-w-[95vw] max-h-[95vh] flex items-center justify-center p-4">
              <img
                src={lightboxUrl}
                alt="Enlarged media"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-zoom-in select-none"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="relative mt-3 group">
        {/* Scrollable strip */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar rounded-2xl border border-border bg-muted aspect-video w-full"
        >
          {media.map((item, i) => {
            const url = resolveMediaUrl(item.url || (item as any).objectKey);
            return (
              <div key={item.id || i} className="w-full shrink-0 snap-center relative h-full cursor-zoom-in group/item">
                <img
                  src={url || ""}
                  alt={item.fileName || `Media ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover group-hover/item:brightness-95 transition-all duration-200"
                  onClick={() => setLightboxUrl(url ?? null)}
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>

        {/* Prev / Next */}
        {current > 0 && (
          <button
            onClick={() => scrollTo(current - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        {current < total - 1 && (
          <button
            onClick={() => scrollTo(current + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {/* Dots indicator */}
        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {media.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === current
                    ? "w-4 bg-white"
                    : "w-1.5 bg-white/50"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center transition-all animate-fade-in duration-200"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 active:scale-95 z-55"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="max-w-[95vw] max-h-[95vh] flex items-center justify-center p-4">
            <img
              src={lightboxUrl}
              alt="Enlarged media"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-zoom-in select-none"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}
