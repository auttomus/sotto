import * as React from "react";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router";
import { useGetUserProfileQuery, useGetListingsByAccountQuery } from "~/core/apollo/generated";
import { ProfileLayout } from "~/features/profile/components/ProfileLayout";
import { useAuthStore } from "~/core/store/useAuthStore";
import { Navigate } from "react-router";

export default function UserProfileRoute() {
  const { username } = useParams<{ username: string }>();
  const currentUser = useAuthStore((state) => state.user);
  
  // If viewing own profile by username, redirect to /profile
  if (currentUser && currentUser.username === username) {
    return <Navigate to="/profile" replace />;
  }

  const { data: profileData, loading: profileLoading, error: profileError } = useGetUserProfileQuery({
    variables: { username: username || "" },
    skip: !username,
    fetchPolicy: "cache-and-network",
  });

  const { data: listingsData, loading: listingsLoading } = useGetListingsByAccountQuery({
    variables: { accountId: profileData?.profile?.id || "" },
    skip: !profileData?.profile?.id,
    fetchPolicy: "cache-and-network",
  });

  if (profileLoading && !profileData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (profileError || !profileData?.profile) {
    return (
      <div className="p-4 text-center text-destructive mt-10">
        <p>Gagal memuat profil: {profileError?.message || "Profil tidak ditemukan"}</p>
      </div>
    );
  }

  // Ensure type compatibility with GetMyProfileQuery 
  // GetMyProfileQuery and GetUserProfileQuery have slightly different fields based on GraphQL schema.
  // ProfileLayout expects GetMyProfileQuery shape. We'll map it to avoid TS errors.
  const profileForLayout = {
    ...profileData.profile,
  };

  return (
    <ProfileLayout 
      profile={profileForLayout} 
      listings={listingsData?.listingsByAccount || []} 
      isOwnProfile={false} 
    />
  );
}
