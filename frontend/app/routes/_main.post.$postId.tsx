import * as React from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, MessageSquare, Heart, Share2, Loader2 } from "lucide-react";
import { Avatar } from "~/components/ui/Avatar";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import { useGetFeedQuery } from "~/core/apollo/generated";
import { ROUTES } from "~/core/constants/ROUTES";
import { Link } from "react-router";

export default function PostDetailRoute() {
  const { postId } = useParams();
  const navigate = useNavigate();
  
  const { data, loading } = useGetFeedQuery({
    variables: { limit: 50 },
    fetchPolicy: 'cache-first'
  });

  const post = data?.feed?.find((p: any) => p.postId === postId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 gap-4">
        <p className="text-gray-500">Post tidak ditemukan.</p>
        <button onClick={() => navigate('/')} className="text-indigo-500 font-medium hover:underline">
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-white dark:bg-gray-950 min-h-screen">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <ArrowLeft className="h-5 w-5 text-gray-900 dark:text-gray-100" />
        </button>
        <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-none">Post</h2>
      </div>
      
      <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-800">
        <Link to={ROUTES.PROFILE_PUBLIC(post.authorUsername ?? "")} className="flex items-start gap-3 mb-4 hover:opacity-80 transition cursor-pointer">
          <Avatar src={resolveMediaUrl(post.authorAvatarObjectKey)} size="md" />
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-gray-100">{post.authorDisplayName}</h3>
            <p className="text-sm text-gray-500">@{post.authorUsername} • {new Date(post.createdAt).toLocaleDateString('id-ID')}</p>
          </div>
        </Link>
        
        <p className="text-gray-800 dark:text-gray-200 text-base md:text-lg whitespace-pre-wrap mb-4">
          {post.content}
        </p>
        
        {post.media && post.media.length > 0 && (
          <div className="w-full bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden mb-4">
            <img src={resolveMediaUrl(post.media[0].objectKey || post.media[0].url)} alt="post media" className="w-full object-cover" />
          </div>
        )}
        
        <div className="flex items-center gap-6 mt-4">
          <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition group">
            <div className="p-2 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition">
              <MessageSquare className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">0</span>
          </button>
          
          <button className="flex items-center gap-2 text-gray-500 hover:text-pink-600 transition group">
            <div className="p-2 rounded-full group-hover:bg-pink-50 dark:group-hover:bg-pink-900/30 transition">
              <Heart className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">0</span>
          </button>

          <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition group ml-auto">
            <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition">
              <Share2 className="h-5 w-5" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
