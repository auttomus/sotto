import * as React from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Link } from "react-router";
import { ROUTES } from "~/core/constants/ROUTES";
import { cn } from "~/core/utils/cn";

interface PostActionsProps {
  postId: string;
  isLiked: boolean;
  likesCount: number;
  repliesCount: number;
  onLike: (e: React.MouseEvent) => void;
  onShare: () => void;
}

export function PostActions({
  postId,
  isLiked,
  likesCount,
  repliesCount,
  onLike,
  onShare,
}: PostActionsProps) {
  return (
    <div 
      className="flex items-center gap-6 mt-1" 
      onClick={(e) => e.stopPropagation()} // Mencegah klik menyebar ke artikel
    >
      <button
        type="button"
        onClick={onLike}
        className={cn(
          "flex items-center gap-1.5 transition-colors group cursor-pointer",
          isLiked
            ? "text-rose-500 hover:text-rose-600 animate-pulse-once"
            : "text-muted-foreground hover:text-rose-500"
        )}
      >
        <div className={cn(
          "p-1.5 rounded-full transition-colors",
          isLiked
            ? "bg-rose-500/10"
            : "group-hover:bg-rose-500/10"
        )}>
          <Heart
            className={cn("h-5 w-5 transition-transform group-active:scale-125", isLiked && "fill-current")}
            strokeWidth={isLiked ? 0 : 2}
          />
        </div>
        <span className="text-xs font-semibold">{likesCount}</span>
      </button>

      <Link
        to={ROUTES.POST_DETAIL(postId)}
        className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group"
      >
        <div className="p-1.5 rounded-full group-hover:bg-primary/10 transition-colors">
          <MessageCircle className="h-5 w-5" />
        </div>
        <span className="text-xs font-medium">{repliesCount}</span>
      </Link>

      <button 
        type="button"
        onClick={onShare}
        className="flex items-center gap-1.5 text-muted-foreground hover:text-success transition-colors group ml-auto cursor-pointer"
      >
        <div className="p-1.5 rounded-full group-hover:bg-success/10 transition-colors">
          <Share2 className="h-5 w-5" />
        </div>
      </button>
    </div>
  );
}
