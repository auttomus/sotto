import * as React from "react";
import { Link } from "react-router";
import { Loader2, MessageSquare } from "lucide-react";
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
      <div className="mt-2 p-3 bg-muted/50 rounded-md border border-border flex items-center justify-center min-h-[80px] w-full">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  const post = data?.post;
  if (!post) return null;

  const avatarUrl = resolveMediaUrl(post.authorAvatarObjectKey);
  const mediaUrl = post.media?.[0] ? resolveMediaUrl(post.media[0].objectKey || post.media[0].url) : null;

  return (
    <Link
      to={`/post/${post.postId}`}
      className="mt-2 block w-full bg-muted hover:bg-muted border border-border rounded-md p-3 text-left transition-all duration-200 group max-w-sm shadow-none cursor-pointer"
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

      {/* Body Content & Image thumbnail side-by-side if present */}
      <div className="flex gap-3 items-start">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-foreground/90 font-medium leading-relaxed line-clamp-3 whitespace-pre-wrap break-words">
            {post.content}
          </p>
        </div>
        {mediaUrl && (
          <div className="h-14 w-14 rounded-md overflow-hidden shrink-0 border border-border/40 bg-muted">
            <img
              src={mediaUrl}
              alt="Post preview"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300 select-none"
            />
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border/30 text-[9px] text-muted-foreground">
        <span>
          {new Date(post.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
          })}
        </span>
        <div className="flex items-center gap-1 font-bold">
          <MessageSquare className="h-3 w-3" />
          <span>{post.repliesCount || 0} Balasan</span>
        </div>
      </div>
    </Link>
  );
}
