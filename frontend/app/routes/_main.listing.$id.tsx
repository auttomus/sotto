import * as React from "react";
import { useParams, useNavigate } from "react-router";
import { useGetListingDetailQuery } from "~/core/apollo/generated";
import { ListingDetail } from "~/features/listings/components/ListingDetail";
import { ListingDetailSkeleton } from "~/components/ui/Skeleton";

export default function ListingRoute() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useGetListingDetailQuery({
    variables: { id: id as string },
    skip: !id,
    fetchPolicy: "cache-first",
  });

  if (loading) {
    return <ListingDetailSkeleton />;
  }

  if (error || !data?.listing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Penawaran tidak ditemukan</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Mungkin penawaran sudah dihapus atau link tidak valid.</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition"
        >
          Kembali
        </button>
      </div>
    );
  }

  return <ListingDetail listing={data.listing} />;
}
