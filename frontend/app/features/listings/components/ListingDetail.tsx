import * as React from "react";
import { Heart, Share2 } from "lucide-react";
import { useNavigate } from "react-router";
import { ROUTES } from "~/core/constants/ROUTES";
import { useCreateOrderMutation, useCreateConversationMutation, useToggleLikeListingMutation } from "~/core/apollo/generated";
import { useAuthStore } from "~/core/store/useAuthStore";
import { useToastStore } from "~/core/store/useToastStore";
import { shareObject } from "~/core/utils/share";
import type { GetListingDetailQuery } from "~/core/apollo/generated";
import { PageHeader } from "~/components/layout/PageHeader";
import { ListingMediaGallery } from "./detail/ListingMediaGallery";
import { ListingSellerCard } from "./detail/ListingSellerCard";
import { ListingActionBar } from "./detail/ListingActionBar";

type RawListingDetail = NonNullable<GetListingDetailQuery["listing"]>;

interface ListingDetailProps {
  listing: RawListingDetail;
}

export function ListingDetail({ listing }: ListingDetailProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const addToast = useToastStore(s => s.addToast);
  const [isLiked, setIsLiked] = React.useState(listing.isLikedByMe || false);

  const [toggleLike] = useToggleLikeListingMutation({
    variables: { id: listing.id },
    onCompleted: (data) => {
      setIsLiked(data.toggleLikeListing);
    },
    onError: (err) => {
      setIsLiked(listing.isLikedByMe || false);
      addToast("error", err.message);
    }
  });

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      navigate(ROUTES.LOGIN);
      return;
    }
    setIsLiked(prev => !prev);
    toggleLike({ variables: { id: listing.id } });
  };
  
  const mediaList = listing.media || [];
  const isOwnListing = listing.accountId === user?.accountId;

  const [createOrder, { loading: orderLoading }] = useCreateOrderMutation({
    onCompleted: (data: any) => {
      addToast('success', 'Order berhasil dibuat!');
      navigate(ROUTES.WORKSPACE_ORDER(data.createOrder.id));
    },
    onError: (e: any) => addToast('error', e.message),
  });

  const [createConversation, { loading: chatLoading }] = useCreateConversationMutation({
    onCompleted: (data: any) => {
      navigate(ROUTES.WORKSPACE_CHAT(data.createConversation.id), {
        state: {
          mentionListing: {
            id: listing.id,
            title: listing.title,
            price: listing.price,
          }
        }
      });
    },
    onError: (e: any) => addToast('error', e.message),
  });

  const handleOrder = () => {
    if (!user) {
      navigate(ROUTES.LOGIN);
      return;
    }
    createOrder({
      variables: {
        input: {
          listingId: listing.id,
          agreedPrice: listing.price,
        }
      }
    });
  };

  const handleChat = () => {
    if (!user) {
      navigate(ROUTES.LOGIN);
      return;
    }
    createConversation({
      variables: {
        input: {
          participantIds: [listing.accountId],
          type: "DIRECT",
        }
      }
    });
  };

  const isFullyBooked = !listing.isUnlimited && listing.status === 'PAUSED';
  const isActionLoading = orderLoading || chatLoading;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-white dark:bg-gray-950 relative text-gray-900 dark:text-gray-100">
      <PageHeader
        title=""
        showBackButton
        rightAction={
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={handleLike}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-900 dark:text-gray-100 cursor-pointer"
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-red-500 scale-110' : ''} transition-all duration-200`} />
            </button>
            <button 
              type="button"
              onClick={() => shareObject({
                title: listing.title,
                text: listing.description || undefined,
                url: `/listing/${listing.id}`
              })}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-900 dark:text-gray-100 cursor-pointer"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        }
      />

      {/* Main Content */}
      <div className="flex-grow w-full">
        {/* Media Gallery Carousel */}
        <ListingMediaGallery
          media={mediaList}
          title={listing.title}
          isFullyBooked={isFullyBooked}
        />

        {/* Listing Info */}
        <div className="p-4 md:p-6">
          <div className="mb-2">
            <span className="inline-block px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              {listing.type === 'DIGITAL_PRODUCT' ? 'Produk Digital' : 'Jasa'}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              {listing.title}
            </h1>
          </div>

          <div className="flex flex-col gap-1 pb-6 border-b border-gray-100 dark:border-gray-800">
            <span className="text-sm text-gray-500 dark:text-gray-400">Harga</span>
            <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
              Rp {listing.price.toLocaleString("id-ID")}
            </span>
          </div>

          {/* Description */}
          <div className="py-6 border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-lg">Deskripsi</h3>
            <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {listing.description}
            </div>
          </div>

          {/* Seller Profile */}
          <ListingSellerCard account={listing.account} />
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <ListingActionBar
        isOwnListing={isOwnListing}
        isFullyBooked={isFullyBooked}
        isActionLoading={isActionLoading}
        chatLoading={chatLoading}
        orderLoading={orderLoading}
        listingType={listing.type}
        handleChat={handleChat}
        handleOrder={handleOrder}
      />
    </div>
  );
}
