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

  if (error || !data?.listing || data.listing.status === "ARCHIVED") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <h2 className="text-xl font-bold text-foreground mb-2">Penawaran tidak ditemukan atau telah dihapus</h2>
        <p className="text-muted-foreground mb-6">Mungkin penawaran sudah dihapus atau dinonaktifkan.</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition"
        >
          Kembali
        </button>
      </div>
    );
  }

  return <ListingDetail listing={data.listing} />;
}
