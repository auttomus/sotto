import * as React from "react";
import { Loader2 } from "lucide-react";
import { useGetMyProfileQuery, useGetListingsByAccountQuery } from "~/core/apollo/generated";
import { ProfileLayout } from "~/features/profile/components/ProfileLayout";

export default function ProfileRoute() {
  const { data: profileData, loading: profileLoading, error: profileError } = useGetMyProfileQuery({
    fetchPolicy: "cache-and-network",
  });

  const { data: listingsData, loading: listingsLoading } = useGetListingsByAccountQuery({
    variables: { accountId: profileData?.myProfile?.id || "" },
    skip: !profileData?.myProfile?.id,
    fetchPolicy: "cache-and-network",
  });

  if (profileLoading && !profileData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (profileError || !profileData?.myProfile) {
    return (
      <div className="p-4 text-center text-red-500 mt-10">
        <p>Gagal memuat profil: {profileError?.message || "Profil tidak ditemukan"}</p>
      </div>
    );
  }

  return (
    <ProfileLayout 
      profile={profileData.myProfile} 
      listings={listingsData?.listingsByAccount || []} 
      isOwnProfile={true} 
    />
  );
}
