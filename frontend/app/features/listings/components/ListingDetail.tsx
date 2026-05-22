import * as React from "react";
import { ArrowLeft, Share2, Heart, Star, ChevronLeft, ChevronRight, MessageCircle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Avatar } from "~/components/ui/Avatar";
import { Button } from "~/components/ui/Button";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import { ROUTES } from "~/core/constants/ROUTES";
import { useCreateOrderMutation, useCreateConversationMutation } from "~/core/apollo/generated";
import { useAuthStore } from "~/core/store/useAuthStore";
import { useToastStore } from "~/core/store/useToastStore";
import type { GetListingDetailQuery } from "~/core/apollo/generated";

type RawListingDetail = NonNullable<GetListingDetailQuery["listing"]>;

interface ListingDetailProps {
  listing: RawListingDetail;
}

export function ListingDetail({ listing }: ListingDetailProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const addToast = useToastStore(s => s.addToast);
  const [currentMedia, setCurrentMedia] = React.useState(0);
  
  const mediaList = listing.media || [];
  const hasMedia = mediaList.length > 0;
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
      navigate(ROUTES.WORKSPACE_CHAT(data.createConversation.id));
    },
    onError: (e: any) => addToast('error', e.message),
  });

  const handlePrevMedia = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentMedia(prev => (prev > 0 ? prev - 1 : mediaList.length - 1));
  };

  const handleNextMedia = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentMedia(prev => (prev < mediaList.length - 1 ? prev + 1 : 0));
  };

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
    // Create a direct conversation with the listing owner
    createConversation({
      variables: {
        input: {
          participantIds: [listing.accountId],
          type: "DIRECT",
        }
      }
    });
  };

  // Determine if seller is fully booked
  const isFullyBooked = !listing.isUnlimited && listing.status === 'PAUSED';
  const isActionLoading = orderLoading || chatLoading;

  return (
    <div className="pb-24 bg-white dark:bg-gray-950 min-h-screen relative">
      {/* Header Mobile / Navigation */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <ArrowLeft className="h-6 w-6 text-gray-900 dark:text-gray-100" />
        </button>
        <div className="flex gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-900 dark:text-gray-100">
            <Heart className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-900 dark:text-gray-100">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-14 w-full">
        {/* Media Gallery Carousel */}
        {hasMedia ? (
          <div className="relative w-full aspect-square md:aspect-video bg-gray-100 dark:bg-gray-900 overflow-hidden">
            <img 
              src={resolveMediaUrl(mediaList[currentMedia].url || (mediaList[currentMedia] as any).objectKey)} 
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            
            {/* Carousel Controls */}
            {mediaList.length > 1 && (
              <>
                <button 
                  onClick={handlePrevMedia}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-sm transition"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={handleNextMedia}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-sm transition"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm">
                  {mediaList.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all ${i === currentMedia ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
                    />
                  ))}
                </div>
              </>
            )}

            {isFullyBooked && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-red-500 text-white px-6 py-2 rounded-full font-bold text-lg rotate-[-5deg] shadow-xl border-2 border-white/20">
                  FULLY BOOKED
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full aspect-video bg-gradient-to-r from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
            <span className="text-4xl">📸</span>
          </div>
        )}

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
          
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="font-medium text-gray-900 dark:text-gray-100">5.0</span>
            <span>(0 ulasan)</span>
            <span>·</span>
            <span>0 Terjual</span>
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
          {listing.account && (
            <div className="py-6">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-lg">Tentang Penjual</h3>
              <Link to={listing.account.username ? ROUTES.PROFILE_PUBLIC(listing.account.username) : "#"} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                <div className="flex items-center gap-3">
                  <Avatar 
                    src={resolveMediaUrl((listing.account as any).avatarObjectKey)} 
                    alt={listing.account.displayName} 
                    size="lg" 
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                      {listing.account.displayName}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{listing.account.major || `@${listing.account.username}`}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs font-medium text-amber-600 dark:text-amber-500">
                      <Star className="h-3 w-3 fill-amber-500" />
                      {listing.account.trustScore.toFixed(1)} Trust Score
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 p-4 pb-safe flex items-center gap-3">
        <button 
          onClick={handleChat}
          disabled={isOwnListing || isActionLoading}
          className="h-12 w-12 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-900 dark:text-gray-100 disabled:opacity-50"
        >
          {chatLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <MessageCircle className="h-5 w-5" />}
        </button>
        {isFullyBooked ? (
          <Button variant="secondary" className="flex-1 h-12 text-base font-bold opacity-70" disabled>
            Sedang Penuh
          </Button>
        ) : isOwnListing ? (
          <Button variant="secondary" className="flex-1 h-12 text-base font-bold" disabled>
            Listing Milik Anda
          </Button>
        ) : (
          <Button 
            variant="primary" 
            className="flex-1 h-12 text-base font-bold shadow-lg shadow-indigo-500/20"
            onClick={handleOrder}
            disabled={isActionLoading}
          >
            {orderLoading ? (
              <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Memproses...</span>
            ) : (
              listing.type === 'DIGITAL_PRODUCT' ? 'Beli Sekarang' : 'Pesan Jasa'
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
