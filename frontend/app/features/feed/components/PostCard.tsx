import * as React from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Avatar } from "../../../components/ui/Avatar";
import { Badge } from "../../../components/ui/Badge";
import type { GetFeedQuery } from "~/core/apollo/generated";
import { formatDate } from "~/core/utils/formatDate";

interface PostCardProps {
  post: GetFeedQuery["feed"][0];
}

export function PostCard({ post }: PostCardProps) {
  // Use VITE_MINIO_PUBLIC_URL for media if URL is relative or build full URL. 
  // We assume post.media[x].url is full or we rely on Avatar and img src to handle it.
  
  return (
    <article className="bg-white dark:bg-gray-900 p-4 border-b border-gray-100 dark:border-gray-800 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar src={post.authorAvatarObjectKey || ""} alt={post.authorDisplayName || post.authorUsername || ""} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                {post.authorDisplayName || post.authorUsername}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">· {formatDate(post.createdAt as string)}</span>
            </div>
            {post.authorSchoolName && (
              <Badge variant="secondary" className="mt-0.5 text-[10px]">{post.authorSchoolName}</Badge>
            )}
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <div className="mb-3">
        <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed mb-2 whitespace-pre-wrap">
          {post.content}
        </p>
        
        {/* Media */}
        {post.media && post.media.length > 0 && (
          <div className="rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mt-3">
            <img 
              src={post.media[0].url || ""} 
              alt="Post media" 
              className="w-full h-auto object-cover max-h-80" 
              loading="lazy" 
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 mt-1">
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors group">
          <div className="p-1.5 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20">
            <Heart className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium">0</span>
        </button>
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors group">
          <div className="p-1.5 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20">
            <MessageCircle className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium">0</span>
        </button>
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-green-500 dark:hover:text-green-400 transition-colors group ml-auto">
          <div className="p-1.5 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20">
            <Share2 className="h-5 w-5" />
          </div>
        </button>
      </div>
    </article>
  );
}
