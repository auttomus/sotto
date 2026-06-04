import * as React from "react";
import { Link } from "react-router";
import { Loader2, MessageSquare, Heart } from "lucide-react";
import { Avatar } from "~/components/ui/Avatar";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import { useGetPostQuery } from "~/core/apollo/generated";

interface ChatMessagePostProps {
  postId: string;
}

export function ChatMessagePost({ postId }: ChatMessagePostProps) {
  const { data, loading } = useGetPostQuery({
    variables: { postId },
    skip: !postId,
  });

  if (loading) {
    return (
      <div className="mt-2 p-3 bg-muted/50 rounded-sm border border-border flex items-center justify-center min-h-[80px] w-full">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  const post = data?.post;
  if (!post) return null;

  const avatarUrl = resolveMediaUrl(post.authorAvatarObjectKey);
  const firstMedia = post.media?.[0];
  const mediaUrl = firstMedia ? resolveMediaUrl(firstMedia.objectKey || firstMedia.url) : null;
  const isVideo = firstMedia
    ? firstMedia.contentType?.startsWith("video/") ||
      /\.(mp4|webm|ogg|mov)$/i.test(firstMedia.fileName || "")
    : false;

  if (post.deletedAt) {
    return (
      <div className="mt-2 block w-full bg-muted/65 border border-border/80 rounded-sm p-3 text-left max-w-md shadow-none opacity-80 select-none relative overflow-hidden">
        {/* Deleted badge */}
        <div className="absolute top-2 right-2 bg-destructive/10 text-destructive border border-destructive/25 rounded px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-wide">
          Dihapus
        </div>
        {/* Header */}
        <div className="flex items-center gap-2 mb-2 pr-16">
          <Avatar src={avatarUrl || ""} size="sm" className="h-6 w-6 text-[8px] shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-foreground/80 text-xs leading-none line-clamp-1">
              {post.authorDisplayName}
            </span>
            {post.authorSchoolName && (
              <span className="text-[9px] text-muted-foreground/80 line-clamp-1 leading-normal">
                {post.authorSchoolName}
              </span>
            )}
          </div>
        </div>

        {/* Description Content */}
        <div className="w-full mb-2">
          <p className="text-xs text-foreground/70 font-medium leading-relaxed whitespace-pre-wrap break-words italic line-clamp-3">
            {post.content}
          </p>
        </div>

        {/* Full-width media preview underneath if present */}
        {mediaUrl && (
          <div className="w-full aspect-[16/9] rounded-sm overflow-hidden border border-border/40 bg-muted/50 mb-2 grayscale opacity-50">
            <img
              src={mediaUrl}
              alt="Post preview"
              className="w-full h-full object-cover select-none"
            />
          </div>
        )}

        {/* Footer Info */}
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border/30 text-[9px] text-muted-foreground/60">
          <span>
            {new Date(post.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={`/post/${post.postId}`}
      className="mt-2 block w-full bg-muted hover:bg-muted border border-border rounded-sm p-3 text-left transition-all duration-200 group max-w-md shadow-none cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Avatar src={avatarUrl || ""} size="sm" className="h-6 w-6 text-[8px] shrink-0" />
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-foreground text-xs leading-none line-clamp-1">
            {post.authorDisplayName}
          </span>
          {post.authorSchoolName && (
            <span className="text-[9px] text-muted-foreground line-clamp-1 leading-normal">
              {post.authorSchoolName}
            </span>
          )}
        </div>
      </div>

      {/* Description Content on Top */}
      <div className="w-full mb-2">
        <p className="text-xs text-foreground/90 font-medium leading-relaxed whitespace-pre-wrap break-words">
          {post.content}
        </p>
      </div>

      {/* Full-width media preview underneath if present */}
      {mediaUrl && (
        <div className="w-full aspect-[16/9] rounded-sm overflow-hidden border border-border/40 bg-muted mb-2 shadow-inner">
          {isVideo ? (
            <video
              src={mediaUrl}
              controls
              className="w-full h-full object-contain bg-black select-none"
              preload="metadata"
              playsInline
              onClick={(e) => {
                // Prevent video interaction from navigating to the post
                e.stopPropagation();
              }}
            />
          ) : (
            <img
              src={mediaUrl}
              alt="Post preview"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-300 select-none"
            />
          )}
        </div>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border/30 text-[9px] text-muted-foreground">
        <span>
          {new Date(post.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
          })}
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-bold text-destructive">
            <Heart className="h-3 w-3 fill-current" />
            <span>{post.likesCount || 0}</span>
          </div>
          <div className="flex items-center gap-1 font-bold">
            <MessageSquare className="h-3 w-3" />
            <span>{post.repliesCount || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
