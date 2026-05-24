import * as React from "react";
import { useState, useRef } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar } from "~/components/ui/Avatar";
import { Badge } from "~/components/ui/Badge";
import type { GetFeedQuery } from "~/core/apollo/generated";
import { formatDate } from "~/core/utils/formatDate";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import { Link } from "react-router";
import { ROUTES } from "~/core/constants/ROUTES";

type FeedPost = GetFeedQuery["feed"][0];

// Extended post type — fields available after codegen re-run
type ExtendedPost = FeedPost & {
  linkedServiceId?: string | null;
  inReplyToPostId?: string | null;
};

interface PostCardProps {
  post: FeedPost;
}

export function PostCard({ post: rawPost }: PostCardProps) {
  const post = rawPost as ExtendedPost;
  const avatarUrl = resolveMediaUrl(post.authorAvatarObjectKey);

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
              <span className="text-xs text-gray-500 dark:text-gray-400">
                · {formatDate(post.createdAt as string)}
              </span>
            </div>
            {post.authorSchoolName && (
              <Badge variant="secondary" className="mt-0.5 text-[10px]">
                {post.authorSchoolName}
              </Badge>
            )}
          </div>
        </Link>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <div className="mb-3">
        <p className="text-gray-800 dark:text-gray-100 text-[15px] leading-relaxed mb-3 whitespace-pre-wrap line-clamp-6">
          {post.content}
        </p>

        {/* Media Carousel */}
        {post.media && post.media.length > 0 && (
          <MediaCarousel media={post.media} />
        )}

        {/* Linked Listing Card */}
        {post.linkedServiceId && (
          <Link
            to={ROUTES.LISTING_DETAIL(post.linkedServiceId)}
            className="mt-3 flex items-center gap-3 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/25 hover:bg-gray-100/50 dark:hover:bg-gray-800/40 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200 group shadow-sm"
          >
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-500/15 dark:from-indigo-500/25 dark:to-purple-500/25 border border-indigo-100/50 dark:border-indigo-500/20 flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-indigo-600 dark:text-indigo-400 text-base">🛠</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Lihat Penawaran Terkait
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Klik untuk melihat detail</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
          </Link>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 mt-1">
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors group">
          <div className="p-1.5 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
            <Heart className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium">0</span>
        </button>
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors group">
          <div className="p-1.5 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
            <MessageCircle className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium">0</span>
        </button>
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

  if (total === 1) {
    const item = media[0];
    const url = resolveMediaUrl(item.url || (item as any).objectKey);
    return (
      <div className="rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mt-3">
        <img
          src={url || ""}
          alt={item.fileName || "Post media"}
          className="w-full h-auto object-cover max-h-80"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="relative mt-3 group">
      {/* Scrollable strip */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
      >
        {media.map((item, i) => {
          const url = resolveMediaUrl(item.url || (item as any).objectKey);
          return (
            <div key={item.id || i} className="w-full shrink-0 snap-center">
              <img
                src={url || ""}
                alt={item.fileName || `Media ${i + 1}`}
                className="w-full h-auto object-cover max-h-80"
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
  );
}
