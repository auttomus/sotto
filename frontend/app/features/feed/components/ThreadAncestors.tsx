import * as React from "react";
import { Loader2 } from "lucide-react";
import { useGetPostQuery } from "~/core/apollo/generated";
import { PostCard } from "./PostCard";

interface ThreadAncestorsProps {
  parentId: string;
}

export function ThreadAncestors({ parentId }: ThreadAncestorsProps) {
  const { data, loading, error } = useGetPostQuery({
    variables: { postId: parentId },
    skip: !parentId,
  });

  const parent = data?.post;

  if (loading) {
    return (
      <div className="flex items-center gap-3 px-5 py-4 bg-card relative">
        {/* Thread line mockup for visual continuity while loading parent */}
        <div className="flex flex-col items-center shrink-0 w-10 relative">
          <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          <div className="absolute left-1/2 -translate-x-1/2 top-10 bottom-0 w-[2px] bg-border/45 min-h-[30px]" />
        </div>
        <div className="flex-1 space-y-2 animate-pulse py-1">
          <div className="h-3 bg-muted rounded w-1/4" />
          <div className="h-3 bg-muted rounded w-3/4" />
        </div>
      </div>
    );
  }

  // Handle completely missing parent or query error
  if (error || !parent) {
    return (
      <div className="flex gap-3 px-5 py-4 bg-muted/5 relative border-b border-border/10">
        {/* Connector line for visual continuity */}
        <div className="flex flex-col items-center shrink-0 w-10 relative">
          <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground text-xs font-semibold select-none border border-border/20">
            ?
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-10 bottom-0 w-[2px] bg-border z-0" />
        </div>
        <div className="flex-1 py-1 flex items-center">
          <p className="text-sm italic text-muted-foreground">Postingan ini tidak tersedia atau telah dihapus</p>
        </div>
      </div>
    );
  }

  // Handle deleted post but present in database (soft-deleted)
  if (parent.deletedAt) {
    return (
      <>
        {parent.inReplyToPostId && (
          <ThreadAncestors parentId={parent.inReplyToPostId} />
        )}
        <div className="flex gap-3 px-5 py-4 bg-muted/5 relative border-b border-border/10">
          {/* Connector line for visual continuity */}
          <div className="flex flex-col items-center shrink-0 w-10 relative">
            <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground text-xs font-semibold select-none border border-border/20">
              ?
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-10 bottom-0 w-[2px] bg-border z-0" />
          </div>
          <div className="flex-1 py-1 flex items-center">
            <p className="text-sm italic text-muted-foreground">Postingan ini telah dihapus oleh penulisnya</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {parent.inReplyToPostId && (
        <ThreadAncestors parentId={parent.inReplyToPostId} />
      )}
      <PostCard post={parent} isThreadParent={true} />
    </>
  );
}
