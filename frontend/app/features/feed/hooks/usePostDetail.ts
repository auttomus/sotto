import { useState } from "react";
import { 
  useGetPostQuery, 
  useGetRepliesQuery, 
  useCreatePostMutation 
} from "~/core/apollo/generated";
import { useAuthStore } from "~/core/store/useAuthStore";

interface UsePostDetailProps {
  postId?: string;
}

export function usePostDetail({ postId }: UsePostDetailProps) {
  const currentUser = useAuthStore((s) => s.user);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch parent post
  const { data: postData, loading: postLoading, refetch: refetchPost } = useGetPostQuery({
    variables: { postId: postId ?? "" },
    skip: !postId,
    fetchPolicy: "cache-and-network",
  });

  // Fetch comments/replies
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
      await Promise.all([
        refetchReplies(),
        refetchPost()
      ]);
    } catch (err) {
      console.error("Gagal mengirim balasan:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    post,
    replies,
    postLoading,
    repliesLoading,
    replyText,
    setReplyText,
    submitting,
    handleReplySubmit,
    currentUser,
    refetchPost,
    refetchReplies
  };
}
