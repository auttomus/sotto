import * as React from "react";
import { Link } from "react-router";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Avatar } from "~/components/ui/Avatar";
import { LabelBadge } from "~/components/ui/LabelBadge";
import { formatDate } from "~/core/utils/formatDate";
import { ROUTES } from "~/core/constants/ROUTES";

interface PostHeaderProps {
  post: any;
  avatarUrl: string;
  isMine: boolean;
  showMenu: boolean;
  setShowMenu: (show: boolean) => void;
  setIsEditing: (editing: boolean) => void;
  onDelete: () => void;
}

export function PostHeader({
  post,
  avatarUrl,
  isMine,
  showMenu,
  setShowMenu,
  setIsEditing,
  onDelete,
}: PostHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-start gap-3">
        <Link
          to={post.authorUsername ? ROUTES.PROFILE_PUBLIC(post.authorUsername) : "#"}
          className="shrink-0 group"
          onClick={(e) => e.stopPropagation()}
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
              onClick={(e) => e.stopPropagation()}
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
            <span className="text-xs text-muted-foreground mt-0.5 block">
              {post.authorSchoolName}
            </span>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {post.tags.map((tag: any) => (
                <Link
                  key={tag.id}
                  to={`/explore?query=${encodeURIComponent(tag.name)}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      {isMine && (
        <div className="relative">
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors cursor-pointer"
          >
            <MoreHorizontal className="h-5 w-5" />
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
      )}
    </div>
  );
}
