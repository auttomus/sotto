import { useState } from "react";
import { 
  useGetPostQuery, 
  useGetRepliesQuery, 
  useCreatePostMutation 
} from "~/core/apollo/generated";
import { useAuthStore } from "~/core/store/useAuthStore";
import { useUpload } from "~/core/hooks/useUpload";

interface UsePostDetailProps {
  postId?: string;
}

export function usePostDetail({ postId }: UsePostDetailProps) {
  const currentUser = useAuthStore((s) => s.user);
  const { uploadFile } = useUpload();
  const [replyText, setReplyText] = useState("");
  const [replyFiles, setReplyFiles] = useState<File[]>([]);
  const [replyListingId, setReplyListingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch active post
  const { data: postData, loading: postLoading, refetch: refetchPost } = useGetPostQuery({
    variables: { postId: postId ?? "" },
    skip: !postId,
    fetchPolicy: "cache-and-network",
  });

  const post = postData?.post;
  const parentId = post?.inReplyToPostId;

  // Fetch parent post if active post is a reply itself
  const { data: parentData, loading: parentLoading } = useGetPostQuery({
    variables: { postId: parentId ?? "" },
    skip: !parentId,
    fetchPolicy: "cache-and-network",
  });

  // Fetch comments/replies
  const { data: repliesData, loading: repliesLoading, refetch: refetchReplies } = useGetRepliesQuery({
    variables: { postId: postId ?? "" },
    skip: !postId,
    fetchPolicy: "cache-and-network",
  });

  const [createReply] = useCreatePostMutation();

  const parentPost = parentData?.post;
  const replies = repliesData?.replies ?? [];

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!replyText.trim() && replyFiles.length === 0) || submitting || !postId) return;

    setSubmitting(true);
    try {
      const mediaIds: string[] = [];
      for (const file of replyFiles) {
        const result = await uploadFile(file, 'ScyllaPost');
        mediaIds.push(result.id);
      }

      await createReply({
        variables: {
          input: {
            content: replyText.trim(),
            inReplyToPostId: postId,
            mediaIds: mediaIds.length > 0 ? mediaIds : undefined,
            linkedServiceId: replyListingId || undefined,
          },
        },
      });

      setReplyText("");
      setReplyFiles([]);
      setReplyListingId(null);

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
    parentPost,
    parentLoading: parentLoading && !!parentId,
    replies,
    postLoading,
    repliesLoading,
    replyText,
    setReplyText,
    replyFiles,
    setReplyFiles,
    replyListingId,
    setReplyListingId,
    submitting,
    handleReplySubmit,
    currentUser,
    refetchPost,
    refetchReplies
  };
}
