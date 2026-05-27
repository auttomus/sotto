import * as React from "react";
import { useParams, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { usePostDetail } from "~/features/feed/hooks/usePostDetail";
import { ThreadDetail } from "~/features/feed/components/ThreadDetail";

export default function PostDetailRoute() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const {
    post,
    replies,
    postLoading,
    repliesLoading,
    replyText,
    setReplyText,
    submitting,
    handleReplySubmit,
    currentUser
  } = usePostDetail({ postId });

  if (postLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 gap-4">
        <p className="text-gray-500">Post tidak ditemukan.</p>
        <button onClick={() => navigate("/")} className="text-indigo-500 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <ThreadDetail
      post={post}
      replies={replies}
      repliesLoading={repliesLoading}
      replyText={replyText}
      setReplyText={setReplyText}
      submitting={submitting}
      handleReplySubmit={handleReplySubmit}
      currentUser={currentUser}
    />
  );
}
