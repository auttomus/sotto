import * as React from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Avatar } from "../../../components/ui/Avatar";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";

interface PostCardProps {
  author: {
    name: string;
    avatarUrl: string;
    school: string;
  };
  createdAt: string;
  content: string;
  tags: string[];
  media?: string[];
  attachedListing?: {
    thumbnailUrl: string;
    title: string;
    price: number;
  };
  stats: {
    likes: number;
    comments: number;
  };
}

export function PostCard({ author, createdAt, content, tags, media, attachedListing, stats }: PostCardProps) {
  return (
    <article className="bg-white dark:bg-gray-900 p-4 border-b border-gray-100 dark:border-gray-800 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar src={author.avatarUrl} alt={author.name} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{author.name}</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">· {createdAt}</span>
            </div>
            <Badge variant="secondary" className="mt-0.5 text-[10px]">{author.school}</Badge>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <div className="mb-3">
        <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed mb-2 whitespace-pre-wrap">
          {content}
        </p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.map((tag) => (
              <span key={tag} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Media */}
        {media && media.length > 0 && (
          <div className="rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <img src={media[0]} alt="Post media" className="w-full h-auto object-cover max-h-80" loading="lazy" />
          </div>
        )}
      </div>

      {/* Attachment / Listing */}
      {attachedListing && (
        <div className="mb-4 mt-2 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <img src={attachedListing.thumbnailUrl} alt="Listing thumbnail" className="h-12 w-12 rounded-lg object-cover bg-gray-200" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{attachedListing.title}</h4>
            <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
              Rp {attachedListing.price.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 mt-1">
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors group">
          <div className="p-1.5 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20">
            <Heart className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium">{stats.likes}</span>
        </button>
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors group">
          <div className="p-1.5 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20">
            <MessageCircle className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium">{stats.comments}</span>
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
