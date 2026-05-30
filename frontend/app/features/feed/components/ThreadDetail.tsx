import * as React from "react";
import { Loader2 } from "lucide-react";
import { PostCard } from "~/features/feed/components/PostCard";
import { PageHeader } from "~/components/layout/PageHeader";
import { useToastStore } from "~/core/store/useToastStore";
import { useGetMyProfileQuery, useGetListingsByAccountQuery } from "~/core/apollo/generated";
import { ReplyInputForm } from "./threaddetail/ReplyInputForm";
import { ListingSelectorDrawer } from "./threaddetail/ListingSelectorDrawer";

interface ThreadDetailProps {
  post: any;
  parentPost?: any;
  parentLoading?: boolean;
  replies: any[];
  repliesLoading: boolean;
  replyText: string;
  setReplyText: (text: string) => void;
  replyFiles: File[];
  setReplyFiles: (files: File[]) => void;
  replyListingId: string | null;
  setReplyListingId: (id: string | null) => void;
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
  replyFiles,
  setReplyFiles,
  replyListingId,
  setReplyListingId,
  submitting,
  handleReplySubmit,
  currentUser,
}: ThreadDetailProps) {
  const addToast = useToastStore((s) => s.addToast);
  const [showListingSelector, setShowListingSelector] = React.useState(false);

  // Fetch current user listings for the offer selector drawer
  const { data: profileData } = useGetMyProfileQuery({ skip: !currentUser });
  const accountId = profileData?.myProfile?.id;

  const { data: listingsData, loading: listingsLoading } = useGetListingsByAccountQuery({
    variables: { accountId: accountId || "" },
    skip: !accountId || !showListingSelector,
  });

  const activeListings = listingsData?.listingsByAccount?.filter((l: any) => l.status === "ACTIVE") || [];
  const selectedListing = activeListings.find((l: any) => l.id === replyListingId);

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
    <div className="pb-20 bg-background min-h-screen">
      <PageHeader title="Utasan" showBackButton />

      {/* Main Post Card */}
      <div className="border-b border-border bg-card relative z-10">
        <PostCard post={post} />
      </div>

      {/* Input reply form editor */}
      {currentUser && (
        <ReplyInputForm
          currentUser={currentUser}
          replyText={replyText}
          setReplyText={setReplyText}
          replyFiles={replyFiles}
          setReplyFiles={setReplyFiles}
          selectedListing={selectedListing}
          setReplyListingId={setReplyListingId}
          submitting={submitting}
          onSubmit={onSubmit}
          setShowListingSelector={setShowListingSelector}
        />
      )}

      {/* Replies Header */}
      {replies.length > 0 && (
        <div className="px-4 py-3 bg-background border-b border-border text-xs font-semibold text-muted-foreground tracking-wider">
          BALASAN ({replies.length})
        </div>
      )}

      {/* Replies List */}
      <div className="divide-y divide-border">
        {repliesLoading ? (
          <div className="p-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : replies.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Belum ada balasan. Jadilah yang pertama membalas!
          </div>
        ) : (
          replies.map((reply) => (
            <div key={reply.postId} className="hover:bg-gray-50/10 transition duration-150">
              <PostCard post={reply} hideAncestors={true} />
            </div>
          ))
        )}
      </div>

      {/* Offer/Listing Selector Popover Drawer */}
      <ListingSelectorDrawer
        isOpen={showListingSelector}
        onClose={() => setShowListingSelector(false)}
        listingsLoading={listingsLoading}
        activeListings={activeListings}
        replyListingId={replyListingId}
        setReplyListingId={setReplyListingId}
      />
    </div>
  );
}
