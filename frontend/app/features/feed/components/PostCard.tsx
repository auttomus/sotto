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
      toggleLikePost: !post.likedByMe,
    },
    update(cache: any) {
      cache.modify({
        id: cache.identify(post),
        fields: {
          likedByMe(existing: boolean) {
            return !existing;
          },
          likesCount(existing: number) {
            return post.likedByMe ? Math.max(0, existing - 1) : existing + 1;
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
  };

  return (
    <article className="bg-white dark:bg-gray-900 p-5 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/30 dark:hover:bg-gray-800/10 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <Link
          to={post.authorUsername ? ROUTES.PROFILE_PUBLIC(post.authorUsername) : "#"}
          className="flex items-center gap-3 group"
        >
          <Avatar
            src={avatarUrl}
            alt={post.authorDisplayName || post.authorUsername || ""}
            size="md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm group-hover:underline">
                {post.authorDisplayName || post.authorUsername}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                · {formatDate(post.createdAt as string)}
                {post.editedAt && (
                  <span className="text-[10px] italic text-indigo-500 dark:text-indigo-400 font-medium ml-1">
                    (diedit)
                  </span>
                )}
              </span>
            </div>
            {post.authorSchoolName && (
              <Badge variant="secondary" className="mt-0.5 text-[10px]">
                {post.authorSchoolName}
              </Badge>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {post.tags.map((tag: any) => (
                  <span
                    key={tag.id}
                    className="text-[10px] font-semibold bg-indigo-50/80 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-100/50 dark:border-indigo-500/10"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
        {isMine && (
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 z-30 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl shadow-lg p-1.5 min-w-[120px] flex flex-col gap-0.5 animate-scale-in">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-left w-full cursor-pointer font-semibold"
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
                  className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-left w-full cursor-pointer font-semibold"
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
          <div className="bg-gray-50 dark:bg-gray-950 p-3 rounded-2xl border border-gray-100 dark:border-gray-800/80 mb-3 flex flex-col gap-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full text-[14px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-3 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none font-medium leading-relaxed"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(post.content || "");
                }}
                className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition cursor-pointer"
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
                className="px-4 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98] transition cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </div>
        ) : (
          <Link to={ROUTES.POST_DETAIL(post.postId)} className="block group/content hover:opacity-95 transition-opacity">
            <p className="text-gray-800 dark:text-gray-100 text-[15px] leading-relaxed mb-3 whitespace-pre-wrap line-clamp-6 font-medium">
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
            className="mt-3 bg-gray-50/50 dark:bg-gray-800/10 hover:bg-gray-100/50 dark:hover:bg-gray-800/20 border-gray-100 dark:border-gray-800" 
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
              : "text-gray-500 hover:text-rose-500 dark:hover:text-rose-400"
          )}
        >
          <div className={cn(
            "p-1.5 rounded-full transition-colors",
            liked
              ? "bg-rose-50/50 dark:bg-rose-950/20"
              : "group-hover:bg-rose-50 dark:group-hover:bg-rose-900/20"
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
          className="flex items-center gap-1.5 text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors group"
        >
          <div className="p-1.5 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
            <MessageCircle className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium">{post.repliesCount ?? 0}</span>
        </Link>
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-green-500 dark:hover:text-green-400 transition-colors group ml-auto">
          <div className="p-1.5 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
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
        <div className="rounded-2xl overflow-hidden bg-gray-50/80 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/80 mt-3 shadow-sm flex items-center justify-center max-h-[512px] w-full cursor-zoom-in group/media">
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
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 aspect-video w-full"
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
