import * as React from "react";
import { useNavigate } from "react-router";
import { Loader2, Send } from "lucide-react";
import { Avatar } from "~/components/ui/Avatar";
import { PostCard } from "~/features/feed/components/PostCard";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import { PageHeader } from "~/components/layout/PageHeader";
import { MentionSuggestions } from "~/components/ui/MentionSuggestions";
import { useToastStore } from "~/core/store/useToastStore";

interface ThreadDetailProps {
  post: any;
  replies: any[];
  repliesLoading: boolean;
  replyText: string;
  setReplyText: (text: string) => void;
  submitting: boolean;
  handleReplySubmit: (e: React.FormEvent) => void;
  currentUser: any;
}

export function ThreadDetail({
  post,
  replies,
  repliesLoading,
  replyText,
  setReplyText,
  submitting,
  handleReplySubmit,
  currentUser,
}: ThreadDetailProps) {
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.addToast);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matches = replyText.match(/\B@[a-zA-Z0-9_]{3,30}\b/g) || [];
    if (matches.length > 5) {
      addToast("error", "Maksimal 5 tag orang diperbolehkan per postingan/pesan");
      return;
    }
    handleReplySubmit(e);
  };

  return (
    <div className="pb-20 bg-white dark:bg-gray-900 min-h-screen">
      <PageHeader title="Utasan" showBackButton />

      {/* Main Post Card */}
      <div className="border-b border-gray-100 dark:border-gray-800">
        <PostCard post={post} />
      </div>

      {/* Input reply (X-style) */}
      {currentUser && (
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/10">
          <form onSubmit={onSubmit} className="flex gap-3 items-start">
            <Avatar src={resolveMediaUrl(currentUser.avatarObjectKey)} size="sm" />
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Balas postingan ini..."
                rows={2}
                className="w-full bg-transparent border-0 resize-none text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-0 text-sm focus:outline-none font-medium leading-relaxed mb-1"
              />
              <MentionSuggestions
                value={replyText}
                onChange={setReplyText}
                inputRef={textareaRef}
              />
              <div className="flex justify-end border-t border-gray-100 dark:border-gray-800/85 pt-2.5 mt-1">
                <button
                  type="submit"
                  disabled={!replyText.trim() || submitting}
                  className="px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer active:scale-[0.97]"
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
              <PostCard post={reply} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
