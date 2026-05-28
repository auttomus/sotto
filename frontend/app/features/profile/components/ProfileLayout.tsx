import * as React from "react";
import { Star, MapPin, Link as LinkIcon, Settings, Calendar, Briefcase, Loader2, X, Check, MessageCircle, Pencil, Trash2 } from "lucide-react";
import { Avatar } from "~/components/ui/Avatar";
import { Button } from "~/components/ui/Button";
import { Dialog } from "~/components/ui/Dialog";
import { 
  type GetMyProfileQuery, 
  type GetListingsByAccountQuery, 
  useCreateConversationMutation, 
  useUpdateListingMutation, 
  useDeleteListingMutation,
  useGetPostsByAccountQuery,
  useGetRepliesByAccountQuery,
  useGetLikedListingsQuery,
  useGetLikedPostsQuery
} from "~/core/apollo/generated";
import { formatDate } from "~/core/utils/formatDate";
import { useNavigate, Link } from "react-router";
import { EditProfileForm } from "./EditProfileForm";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import { useProfileLayout } from "~/features/profile/hooks/useProfileLayout";
import { useAuthStore } from "~/core/store/useAuthStore";
import { useToastStore } from "~/core/store/useToastStore";
import { ROUTES } from "~/core/constants/ROUTES";
import { PostCard } from "~/features/feed/components/PostCard";
import { ListingCard } from "~/features/listings/components/ListingCard";

interface ProfileLayoutProps {
  profile: any; // Using any or extended type since it can be myProfile or userProfile
  listings: GetListingsByAccountQuery['listingsByAccount'];
  isOwnProfile?: boolean;
}

export function ProfileLayout({ profile, listings, isOwnProfile = false }: ProfileLayoutProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const addToast = useToastStore(s => s.addToast);

  const [editingListing, setEditingListing] = React.useState<any | null>(null);
  const [deletingListingId, setDeletingListingId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [editDescription, setEditDescription] = React.useState("");
  const [editPrice, setEditPrice] = React.useState(0);
  const [editDeliveryTime, setEditDeliveryTime] = React.useState<number | null>(null);

  const [updateListing, { loading: isUpdatingListing }] = useUpdateListingMutation({
    refetchQueries: ["GetListingsByAccount"],
    onCompleted: () => {
      addToast("success", "Penawaran berhasil diperbarui");
      setEditingListing(null);
    },
    onError: (err) => {
      addToast("error", err.message);
    }
  });

  const [deleteListing, { loading: isDeletingListing }] = useDeleteListingMutation({
    refetchQueries: ["GetListingsByAccount"],
    onCompleted: () => {
      addToast("success", "Penawaran berhasil dihapus");
      setDeletingListingId(null);
    },
    onError: (err) => {
      addToast("error", err.message);
    }
  });

  const handleEditListing = (item: any) => {
    setEditingListing(item);
    setEditTitle(item.title);
    setEditDescription(item.description);
    setEditPrice(item.price);
    setEditDeliveryTime(item.deliveryTimeDays);
  };

  const {
    activeTab,
    setActiveTab,
    isEditing,
    setIsEditing,
    handleFollowToggle,
    isFollowLoading
  } = useProfileLayout({ profile });

  const { data: likedListingsData, loading: likedListingsLoading } = useGetLikedListingsQuery({
    skip: !isOwnProfile,
    fetchPolicy: "network-only"
  });

  const { data: likedPostsData, loading: likedPostsLoading } = useGetLikedPostsQuery({
    skip: !isOwnProfile,
    fetchPolicy: "network-only"
  });

  const [likesSubTab, setLikesSubTab] = React.useState<"posts" | "listings">("posts");

  const [createConversation, { loading: chatLoading }] = useCreateConversationMutation({
    onCompleted: (data: any) => {
      navigate(ROUTES.WORKSPACE_CHAT(data.createConversation.id));
    },
    onError: (e: any) => addToast('error', e.message),
  });

  const handleChat = () => {
    if (!user) {
      navigate(ROUTES.LOGIN);
      return;
    }
    createConversation({
      variables: {
        input: {
          participantIds: [profile.id],
          type: "DIRECT",
        }
      }
    });
  };

  const { data: postsData, loading: postsLoading } = useGetPostsByAccountQuery({
    variables: { accountId: profile.id },
    skip: !profile.id,
    fetchPolicy: "cache-and-network",
  });

  const { data: repliesData, loading: repliesLoading } = useGetRepliesByAccountQuery({
    variables: { accountId: profile.id },
    skip: !profile.id,
    fetchPolicy: "cache-and-network",
  });

  return (
    <div className="pb-20 relative bg-background min-h-screen">
      {/* Header Mobile */}
      <div className="sticky top-0 z-10 bg-card/85 backdrop-blur-md px-4 py-3 border-b border-border md:hidden flex justify-between items-center">
        <div>
          <h2 className="font-bold text-foreground text-lg leading-none">{profile.displayName}</h2>
          <p className="text-xs text-muted-foreground">{listings.length} Penawaran</p>
        </div>
        {isOwnProfile && (
          <button 
            onClick={() => navigate("/settings")} 
            className="p-2 -mr-2 rounded-full hover:bg-muted transition"
          >
            <Settings className="h-5 w-5 text-foreground" />
          </button>
        )}
      </div>

      {/* Cover Section */}
      <div className="relative">
        <div className="h-32 md:h-48 w-full overflow-hidden bg-gradient-to-r from-primary to-purple-600/80">
          {/* Default cover gradient */}
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="px-4 relative">
        <div className="flex justify-between items-start">
          {!isEditing && (
            <div className="relative -mt-12 md:-mt-16 mb-3">
              <div className="rounded-full border-4 border-background inline-block bg-card">
                <Avatar 
                  src={resolveMediaUrl(profile.avatarObjectKey)} 
                  alt={profile.displayName} 
                  size="xl" 
                  className="w-20 h-20 md:w-28 md:h-28"
                />
              </div>
            </div>
          )}
          <div className="mt-3 flex gap-2 w-full justify-end relative items-center">
            {isOwnProfile ? (
              !isEditing && (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    className="font-bold px-4 rounded-full text-xs h-9"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profil
                  </Button>
                  <button 
                    onClick={() => navigate("/settings")} 
                    className="p-2 border border-border rounded-full hover:bg-muted transition h-9 w-9 flex items-center justify-center shrink-0"
                  >
                    <Settings className="h-4 w-4 text-foreground" />
                  </button>
                </div>
              )
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleChat}
                  disabled={chatLoading}
                  className="p-2 border border-border rounded-full hover:bg-muted transition h-9 w-9 flex items-center justify-center shrink-0 text-foreground disabled:opacity-50"
                  title="Kirim Pesan"
                >
                  {chatLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : (
                    <MessageCircle className="h-4 w-4" />
                  )}
                </button>
                <Button 
                  variant={profile.isFollowing ? "outline" : "primary"} 
                  className="font-bold px-5 rounded-full shadow-md shadow-primary/20 h-9 text-xs"
                  onClick={handleFollowToggle}
                  disabled={isFollowLoading}
                >
                  {isFollowLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (profile.isFollowing ? "Mengikuti" : "Ikuti")}
                </Button>
              </div>
            )}
          </div>
        </div>

        {isEditing ? (
          <EditProfileForm 
            profile={profile} 
            onCancel={() => setIsEditing(false)} 
            onSuccess={() => setIsEditing(false)} 
          />
        ) : (
          <>
            <div className="mt-1">
              <h1 className="text-xl md:text-2xl font-bold text-foreground">{profile.displayName}</h1>
              <p className="text-muted-foreground">@{profile.username}</p>
            </div>
            <p className="text-sm md:text-base text-foreground mt-3 leading-relaxed">
              {profile.note || "Belum ada bio."}
            </p>
          </>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-sm text-muted-foreground">
          {profile.schoolName && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {profile.schoolName}
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 text-warning" />
            <span className="text-foreground font-medium">{profile.trustScore.toFixed(1)}</span> Trust Score
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 text-sm">
          <div className="flex gap-1 hover:underline cursor-pointer">
            <span className="font-bold text-foreground">{profile.followingCount ?? 0}</span>
            <span className="text-muted-foreground">Mengikuti</span>
          </div>
          <div className="flex gap-1 hover:underline cursor-pointer">
            <span className="font-bold text-foreground">{profile.followersCount ?? 0}</span>
            <span className="text-muted-foreground">Pengikut</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center mt-4 border-b border-border px-4 md:px-0">
        <button
          onClick={() => setActiveTab("posts")}
          className="flex-1 hover:bg-muted transition-colors relative"
        >
          <div className={`py-3.5 text-sm font-bold w-fit mx-auto relative ${activeTab === "posts" ? "text-foreground" : "text-muted-foreground"}`}>
            Postingan
            {activeTab === "posts" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full"></div>
            )}
          </div>
        </button>
        <button
          onClick={() => setActiveTab("listings")}
          className="flex-1 hover:bg-muted transition-colors relative"
        >
          <div className={`py-3.5 text-sm font-bold w-fit mx-auto relative ${activeTab === "listings" ? "text-foreground" : "text-muted-foreground"}`}>
            Penawaran
            {activeTab === "listings" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full"></div>
            )}
          </div>
        </button>
        <button
          onClick={() => setActiveTab("replies")}
          className="flex-1 hover:bg-muted transition-colors relative"
        >
          <div className={`py-3.5 text-sm font-bold w-fit mx-auto relative ${activeTab === "replies" ? "text-foreground" : "text-muted-foreground"}`}>
            Balasan
            {activeTab === "replies" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full"></div>
            )}
          </div>
        </button>
        {isOwnProfile && (
          <button
            onClick={() => setActiveTab("likes")}
            className="flex-1 hover:bg-muted transition-colors relative"
          >
            <div className={`py-3.5 text-sm font-bold w-fit mx-auto relative ${activeTab === "likes" ? "text-foreground" : "text-muted-foreground"}`}>
              Disukai
              {activeTab === "likes" && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full"></div>
              )}
            </div>
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="w-full">
        {activeTab === "posts" && (
          <div className="flex flex-col">
            {postsLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !postsData?.postsByAccount || postsData.postsByAccount.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">Belum ada postingan.</div>
            ) : (
              postsData.postsByAccount.map((post: any) => (
                <PostCard key={post.postId} post={post} />
              ))
            )}
          </div>
        )}

        {activeTab === "listings" && (
          <div className="flex flex-col gap-4 p-4">
            {listings.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">Belum ada penawaran.</div>
            ) : (
              listings.map((item) => (
                <div key={item.id} className="flex flex-col gap-3 p-4 bg-card border border-border rounded-sm hover:shadow-sm transition">
                  <ListingCard listing={item as any} isLink={true} className="border-0 p-0 shadow-none hover:shadow-none bg-transparent" />
                  {isOwnProfile && (
                    <div className="flex gap-2 pl-2 border-t border-border pt-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEditListing(item);
                        }}
                        className="px-3 py-1.5 text-[11px] font-bold bg-muted text-foreground rounded-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-1 transition cursor-pointer"
                      >
                        <Pencil className="h-3 w-3" />
                        Sunting
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeletingListingId(item.id);
                        }}
                        className="px-3 py-1.5 text-[11px] font-bold bg-destructive/10 text-destructive rounded-sm hover:bg-destructive/20 flex items-center gap-1 transition cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        Hapus
                      </button>
                      {item.updatedAt && new Date(item.updatedAt).getTime() > new Date(item.createdAt || 0).getTime() + 1000 && (
                        <span className="text-[10px] italic text-muted-foreground font-medium ml-auto self-center">
                          (diperbarui)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "replies" && (
          <div className="flex flex-col">
            {repliesLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !repliesData?.repliesByAccount || repliesData.repliesByAccount.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">Belum ada balasan.</div>
            ) : (
              repliesData.repliesByAccount.map((post: any) => (
                <PostCard key={post.postId} post={post} />
              ))
            )}
          </div>
        )}

        {activeTab === "likes" && isOwnProfile && (
          <div className="flex flex-col p-4 gap-4">
            {/* Sub Tabs Pills */}
            <div className="flex gap-2 border-b border-border pb-3">
              <button
                onClick={() => setLikesSubTab("posts")}
                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  likesSubTab === "posts"
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                Postingan
              </button>
              <button
                onClick={() => setLikesSubTab("listings")}
                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  likesSubTab === "listings"
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                Penawaran
              </button>
            </div>

            {/* Sub Tab Content */}
            {likesSubTab === "posts" ? (
              <div className="flex flex-col">
                {likedPostsLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : !likedPostsData?.likedPosts || likedPostsData.likedPosts.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground">Belum ada postingan disukai.</div>
                ) : (
                  likedPostsData.likedPosts.map((post: any) => (
                    <PostCard key={post.postId} post={post} />
                  ))
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {likedListingsLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : !likedListingsData?.likedListings || likedListingsData.likedListings.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground">Belum ada penawaran disukai.</div>
                ) : (
                  likedListingsData.likedListings.map((item: any) => (
                    <ListingCard key={item.id} listing={item} isLink={true} className="bg-card shadow-none hover:shadow-sm" />
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Listing Dialog */}
      <Dialog
        isOpen={!!editingListing}
        onClose={() => setEditingListing(null)}
        title={
          <span className="flex items-center gap-2">
            <Pencil className="h-5 w-5 text-primary" />
            Sunting Penawaran
          </span>
        }
        maxWidth="md"
        footer={
          <>
            <button
              onClick={() => setEditingListing(null)}
              className="flex-1 py-2.5 text-center text-xs font-bold text-muted-foreground border border-border hover:bg-muted rounded-sm transition cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={async () => {
                if (!editTitle.trim() || !editDescription.trim() || editPrice <= 0) {
                  addToast("error", "Judul, deskripsi, dan harga harus valid!");
                  return;
                }
                await updateListing({
                  variables: {
                    id: editingListing.id,
                    input: {
                      title: editTitle.trim(),
                      description: editDescription.trim(),
                      basePrice: editPrice,
                      deliveryTimeDays: editDeliveryTime ? Number(editDeliveryTime) : null,
                    }
                  }
                });
              }}
              disabled={isUpdatingListing}
              className="flex-[2] py-2.5 text-center text-xs font-bold bg-primary hover:opacity-90 text-primary-foreground rounded-sm shadow-md shadow-primary/10 active:scale-[0.99] transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isUpdatingListing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Judul Penawaran</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full text-sm bg-muted text-foreground rounded-sm p-3 border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring font-medium"
              placeholder="Contoh: Jasa Pembuatan Website Portfolio"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Deskripsi</label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full text-sm bg-muted text-foreground rounded-sm p-3 border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring font-medium resize-none"
              rows={4}
              placeholder="Jelaskan secara detail tentang penawaran Anda..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Harga (Rp)</label>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(Number(e.target.value))}
                className="w-full text-sm bg-muted text-foreground rounded-sm p-3 border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Estimasi (Hari)</label>
              <input
                type="number"
                value={editDeliveryTime || ""}
                onChange={(e) => setEditDeliveryTime(e.target.value ? Number(e.target.value) : null)}
                className="w-full text-sm bg-muted text-foreground rounded-sm p-3 border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring font-bold"
                placeholder="Instan / N/A"
              />
            </div>
          </div>
        </div>
      </Dialog>

      {/* Delete Listing Dialog */}
      <Dialog
        isOpen={!!deletingListingId}
        onClose={() => setDeletingListingId(null)}
        title={
          <span className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Hapus Penawaran
          </span>
        }
        maxWidth="sm"
        footer={
          <>
            <button
              onClick={() => setDeletingListingId(null)}
              className="flex-1 py-2.5 text-center text-xs font-bold text-muted-foreground border border-border hover:bg-muted rounded-sm transition cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={async () => {
                if (!deletingListingId) return;
                await deleteListing({
                  variables: { id: deletingListingId }
                });
              }}
              disabled={isDeletingListing}
              className="flex-1 py-2.5 text-center text-xs font-bold bg-destructive hover:opacity-90 text-destructive-foreground rounded-sm shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isDeletingListing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </button>
          </>
        }
      >
        <p className="text-muted-foreground font-medium">
          Apakah Anda yakin ingin menghapus penawaran ini? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
        </p>
      </Dialog>
    </div>
  );
}
