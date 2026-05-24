import * as React from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { Avatar } from "~/components/ui/Avatar";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import {
  useGetPostQuery,
  useGetRepliesQuery,
  useCreatePostMutation,
} from "~/core/apollo/generated";
import { PostCard } from "~/features/feed/components/PostCard";
import { useAuthStore } from "~/core/store/useAuthStore";

export default function PostDetailRoute() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);

  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Ambil data post target
  const { data: postData, loading: postLoading, refetch: refetchPost } = useGetPostQuery({
    variables: { postId: postId ?? "" },
    skip: !postId,
    fetchPolicy: "cache-and-network",
  });

  // Ambil reply/komentar
  const { data: repliesData, loading: repliesLoading, refetch: refetchReplies } = useGetRepliesQuery({
    variables: { postId: postId ?? "" },
    skip: !postId,
    fetchPolicy: "cache-and-network",
  });

  const [createReply] = useCreatePostMutation();

  const post = postData?.post;
  const replies = repliesData?.replies ?? [];

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || submitting || !postId) return;

    setSubmitting(true);
    try {
      await createReply({
        variables: {
          input: {
            content: replyText.trim(),
            inReplyToPostId: postId,
          },
        },
      });
      setReplyText("");
      refetchReplies();
      refetchPost();
    } catch (err) {
      console.error("Gagal mengirim balasan:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (postLoading) {
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
        <button onClick={() => navigate("/")} className="text-indigo-500 font-medium hover:underline">
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-white dark:bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <ArrowLeft className="h-5 w-5 text-gray-900 dark:text-gray-100" />
        </button>
        <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-none">Thread</h2>
      </div>

      {/* Main Post Card */}
      <div className="border-b border-gray-100 dark:border-gray-800">
        <PostCard post={post as any} />
      </div>

      {/* Input reply (X-style) */}
      {currentUser && (
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/10">
          <form onSubmit={handleReplySubmit} className="flex gap-3 items-start">
            <Avatar src={resolveMediaUrl(currentUser.avatarObjectKey)} size="sm" />
            <div className="flex-1">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Balas postingan ini..."
                rows={2}
                className="w-full bg-transparent border-0 resize-none text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-0 text-sm focus:outline-none"
              />
              <div className="flex justify-end border-t border-gray-100 dark:border-gray-800/85 pt-2.5 mt-1">
                <button
                  type="submit"
                  disabled={!replyText.trim() || submitting}
                  className="px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs transition flex items-center gap-1.5"
                >
                  {submitting ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Send className="h-3 w-3" />
                  )}
                  Balas
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Replies Header */}
      {replies.length > 0 && (
        <div className="px-4 py-3 bg-gray-50/50 dark:bg-gray-900/20 border-b border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-500 tracking-wider">
          BALASAN ({replies.length})
        </div>
      )}

      {/* Replies List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {repliesLoading ? (
          <div className="p-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : replies.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            Belum ada balasan. Jadilah yang pertama membalas!
          </div>
        ) : (
          replies.map((reply) => (
            <div key={reply.postId} className="hover:bg-gray-50/10 transition duration-150">
              <PostCard post={reply as any} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
