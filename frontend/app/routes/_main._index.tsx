import { Plus, Loader2 } from "lucide-react";
import { PostCard } from "../features/feed/components/PostCard";
import { Link } from "react-router";
import { useGetFeedQuery } from "~/core/apollo/generated";

export default function FeedTimelineRoute() {
  const { data, loading, error } = useGetFeedQuery({
    variables: { limit: 20 },
    fetchPolicy: "cache-and-network",
  });

  if (loading && !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>Gagal memuat feed: {error.message}</p>
      </div>
    );
  }

  const posts = data?.feed || [];

  return (
    <div className="pb-20 relative min-h-screen">
      {/* List of Posts */}
      <div className="flex flex-col">
        {posts.length === 0 ? (
          <div className="text-center p-8 text-gray-500">Belum ada postingan</div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.postId} post={post} />
          ))
        )}
      </div>

      {/* Floating Action Button for Create Post */}
      <Link
        to="/workspace/create"
        className="fixed bottom-20 right-4 md:hidden z-40 bg-indigo-600 text-white h-14 w-14 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all"
        aria-label="Buat Postingan Baru"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
}
