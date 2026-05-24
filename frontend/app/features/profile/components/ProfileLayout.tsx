import * as React from "react";
import { Star, MapPin, Link as LinkIcon, Settings, Calendar, Briefcase, Loader2, X, Check, MessageCircle } from "lucide-react";
import { Avatar } from "~/components/ui/Avatar";
import { Button } from "~/components/ui/Button";
import { type GetMyProfileQuery, type GetListingsByAccountQuery, useCreateConversationMutation } from "~/core/apollo/generated";
import { formatDate } from "~/core/utils/formatDate";
import { useNavigate } from "react-router";
import { EditProfileForm } from "./EditProfileForm";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import { useProfileLayout } from "~/features/profile/hooks/useProfileLayout";
import { useAuthStore } from "~/core/store/useAuthStore";
import { useToastStore } from "~/core/store/useToastStore";
import { ROUTES } from "~/core/constants/ROUTES";
import { gql } from "@apollo/client";
import * as ApolloReactHooks from "@apollo/client/react";
import { PostCard } from "~/features/feed/components/PostCard";

const GET_POSTS_BY_ACCOUNT = gql`
  query GetPostsByAccount($accountId: String!) {
    postsByAccount(accountId: $accountId) {
      postId
      content
      createdAt
      authorId
      authorDisplayName
      authorUsername
      authorAvatarObjectKey
      authorSchoolName
      linkedServiceId
      inReplyToPostId
      likesCount
      repliesCount
      likedByMe
      tags {
        id
        name
      }
      media {
        id
        fileName
        contentType
        url
        objectKey
      }
    }
  }
`;

const GET_REPLIES_BY_ACCOUNT = gql`
  query GetRepliesByAccount($accountId: String!) {
    repliesByAccount(accountId: $accountId) {
      postId
      content
      createdAt
      authorId
      authorDisplayName
      authorUsername
      authorAvatarObjectKey
      authorSchoolName
      linkedServiceId
      inReplyToPostId
      likesCount
      repliesCount
      likedByMe
      tags {
        id
        name
      }
      media {
        id
        fileName
        contentType
        url
        objectKey
      }
    }
  }
`;

interface ProfileLayoutProps {
  profile: any; // Using any or extended type since it can be myProfile or userProfile
  listings: GetListingsByAccountQuery['listingsByAccount'];
  isOwnProfile?: boolean;
}

export function ProfileLayout({ profile, listings, isOwnProfile = false }: ProfileLayoutProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const addToast = useToastStore(s => s.addToast);

  const {
    activeTab,
    setActiveTab,
    isEditing,
    setIsEditing,
    handleFollowToggle,
    isFollowLoading
  } = useProfileLayout({ profile });

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

  const { data: postsData, loading: postsLoading } = ApolloReactHooks.useQuery<any>(GET_POSTS_BY_ACCOUNT, {
    variables: { accountId: profile.id },
    skip: !profile.id,
    fetchPolicy: "cache-and-network",
  });

  const { data: repliesData, loading: repliesLoading } = ApolloReactHooks.useQuery<any>(GET_REPLIES_BY_ACCOUNT, {
    variables: { accountId: profile.id },
    skip: !profile.id,
    fetchPolicy: "cache-and-network",
  });

  return (
    <div className="pb-20 relative bg-white dark:bg-gray-950 min-h-screen">
      {/* Header Mobile */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-4 py-3 border-b border-gray-100 dark:border-gray-800 md:hidden flex justify-between items-center">
        <div>
          <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-none">{profile.displayName}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">{listings.length} Penawaran</p>
        </div>
        {isOwnProfile && (
          <button 
            onClick={() => navigate("/settings")} 
            className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Settings className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
        )}
      </div>

      {/* Cover Section */}
      <div className="relative">
        <div className="h-32 md:h-48 w-full overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600">
          {/* Default cover gradient for now */}
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="px-4 relative">
        <div className="flex justify-between items-start">
          {!isEditing && (
            <div className="relative -mt-12 md:-mt-16 mb-3">
              <div className="rounded-full border-4 border-white dark:border-gray-950 inline-block bg-white dark:bg-gray-900">
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
                    className="p-2 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition h-9 w-9 flex items-center justify-center shrink-0"
                  >
                    <Settings className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>
              )
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleChat}
                  disabled={chatLoading}
                  className="p-2 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition h-9 w-9 flex items-center justify-center shrink-0 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                  title="Kirim Pesan"
                >
                  {chatLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                  ) : (
                    <MessageCircle className="h-4 w-4" />
                  )}
                </button>
                <Button 
                  variant={profile.isFollowing ? "outline" : "primary"} 
                  className="font-bold px-5 rounded-full shadow-md shadow-indigo-500/20 h-9 text-xs"
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
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">{profile.displayName}</h1>
              <p className="text-gray-500 dark:text-gray-400">@{profile.username}</p>
            </div>
            <p className="text-sm md:text-base text-gray-900 dark:text-gray-100 mt-3 leading-relaxed">
              {profile.note || "Belum ada bio."}
            </p>
          </>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
          {profile.schoolName && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {profile.schoolName}
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 text-amber-500" />
            <span className="text-gray-900 dark:text-gray-100 font-medium">{profile.trustScore.toFixed(1)}</span> Trust Score
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 text-sm">
          <div className="flex gap-1 hover:underline cursor-pointer">
            <span className="font-bold text-gray-900 dark:text-gray-100">{profile.followingCount ?? 0}</span>
            <span className="text-gray-500 dark:text-gray-400">Mengikuti</span>
          </div>
          <div className="flex gap-1 hover:underline cursor-pointer">
            <span className="font-bold text-gray-900 dark:text-gray-100">{profile.followersCount ?? 0}</span>
            <span className="text-gray-500 dark:text-gray-400">Pengikut</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center mt-4 border-b border-gray-200 dark:border-gray-800 px-4 md:px-0">
        <button
          onClick={() => setActiveTab("posts")}
          className="flex-1 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors relative"
        >
          <div className={`py-3.5 text-sm font-bold w-fit mx-auto relative ${activeTab === "posts" ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}`}>
            Postingan
            {activeTab === "posts" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>
            )}
          </div>
        </button>
        <button
          onClick={() => setActiveTab("listings")}
          className="flex-1 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors relative"
        >
          <div className={`py-3.5 text-sm font-bold w-fit mx-auto relative ${activeTab === "listings" ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}`}>
            Penawaran
            {activeTab === "listings" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>
            )}
          </div>
        </button>
        <button
          onClick={() => setActiveTab("replies")}
          className="flex-1 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors relative"
        >
          <div className={`py-3.5 text-sm font-bold w-fit mx-auto relative ${activeTab === "replies" ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}`}>
            Balasan
            {activeTab === "replies" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>
            )}
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="w-full">
        {activeTab === "posts" && (
          <div className="flex flex-col">
            {postsLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              </div>
            ) : !postsData?.postsByAccount || postsData.postsByAccount.length === 0 ? (
              <div className="text-center p-8 text-gray-500 dark:text-gray-400">Belum ada postingan.</div>
            ) : (
              postsData.postsByAccount.map((post: any) => (
                <PostCard key={post.postId} post={post} />
              ))
            )}
          </div>
        )}

        {activeTab === "listings" && (
          <div className="flex flex-col">
            {listings.length === 0 ? (
              <div className="text-center p-8 text-gray-500 dark:text-gray-400">Belum ada penawaran.</div>
            ) : (
              listings.map((item) => (
                <div key={item.id} className="p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition cursor-pointer flex gap-4">
                  <Avatar src={resolveMediaUrl(profile.avatarObjectKey)} size="sm" className="hidden sm:block shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 hidden sm:flex">
                      <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">{profile.displayName}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">@{profile.username}</span>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mt-1 group">
                      {item.media && item.media.length > 0 && (
                        <div className="h-40 sm:h-48 w-full overflow-hidden relative">
                          <img src={resolveMediaUrl(item.media[0].url || (item.media[0] as any).objectKey)} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                          <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                            {item.type === 'SERVICE' ? 'Jasa' : 'Produk Digital'}
                          </div>
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">{item.description}</p>
                        
                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3">
                          <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">Harga</span>
                            <span className="font-black text-indigo-600 dark:text-indigo-400 text-base">Rp {item.price.toLocaleString("id-ID")}</span>
                          </div>
                          {item.type === 'DIGITAL_PRODUCT' ? (
                            <div className="text-right">
                              <span className="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">Akses Instan</span>
                            </div>
                          ) : (
                            <div className="text-right">
                              <span className="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">Estimasi</span>
                              <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{item.deliveryTimeDays} Hari</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "replies" && (
          <div className="flex flex-col">
            {repliesLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              </div>
            ) : !repliesData?.repliesByAccount || repliesData.repliesByAccount.length === 0 ? (
              <div className="text-center p-8 text-gray-500 dark:text-gray-400">Belum ada balasan.</div>
            ) : (
              repliesData.repliesByAccount.map((post: any) => (
                <PostCard key={post.postId} post={post} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
