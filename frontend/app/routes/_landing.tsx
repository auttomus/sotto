import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ROUTES } from "~/core/constants/ROUTES";
import { useAuthStore } from "~/core/store/useAuthStore";
import { useThemeStore } from "~/core/store/useThemeStore";

// Komponen Asli Sotto
import { PostCard } from "~/features/feed/components/PostCard";
import { MessageBubble } from "~/features/chat/components/MessageBubble";
import { CustomOfferCard } from "~/features/chat/components/message/CustomOfferCard";
import { ListingCard } from "~/features/listings/components/ListingCard";
import { OrderProgressTracker } from "~/features/orders/components/OrderProgressTracker";
import { OrderStatus } from "~/core/apollo/base-types";

// Mock Data Autentik
const MOCK_POST = {
  id: "mock-post-1",
  content: "Akhirnya selesai juga project 3D Modeling Maskot untuk tim E-Sport lokal! 🎮✨\n\nFull proses dikerjakan menggunakan Blender dan dirender dengan Cycles. Sangat puas dengan hasilnya. Jika ada yang butuh jasa pembuatan 3D karakter atau maskot serupa, langsung klik tautan jasaku di bawah ini ya! 👇",
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  author: {
    accountId: "author-1",
    displayName: "Budi Studio (Vokasi 3D)",
    username: "budistudio",
    avatarObjectKey: null,
  },
  likesCount: 142,
  likedByMe: true,
  repliesCount: 18,
  tags: [{ id: "t1", name: "3dmodeling" }, { id: "t2", name: "freelance" }],
  linkedServiceId: "listing-1",
};

const MOCK_CHAT_1 = {
  messageId: "msg-1",
  senderId: "buyer-1",
  content: "Halo kak Budi! Aku lihat postingan 3D maskot E-Sport nya keren banget. Kira-kira bisa buatkan maskot untuk tim Valorant aku ga ya?",
  createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
};

const MOCK_CHAT_2 = {
  messageId: "msg-2",
  senderId: "author-1",
  content: "Halo! Terima kasih banyak kak. Tentu bisa banget, nanti untuk detail referensi karakternya boleh dikirim ya biar aku buatkan penawaran custom-nya.",
  createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
};

const MOCK_OFFER_MSG = {
  messageId: "msg-offer",
  senderId: "author-1",
  isCustomOffer: true,
  createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  offerData: {
    id: "offer-1",
    sellerAccountId: "author-1",
    status: "PENDING",
    description: "Pembuatan 3D Maskot Tim E-Sport (Valorant)\n- 3 Revisi Minor\n- Termasuk file .Blend dan Render resolusi tinggi\n- Waktu pengerjaan maksimal",
    proposedPrice: 850000,
    deliveryTimeDays: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  }
};

const MOCK_LISTING = {
  id: "listing-1",
  title: "Aset 3D Lingkungan Kota Cyberpunk (Blender)",
  description: "Aset 3D premium siap pakai untuk mempercepat pembuatan scene animasi atau game Anda.",
  price: 150000,
  type: "DIGITAL_PRODUCT",
  media: [],
};

export default function LandingRoute() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { initTheme } = useThemeStore();

  const { scrollYProgress } = useScroll();

  // Mapping pergerakan Orb 1 (Kiri Atas ke Kanan ke Kiri ke Bawah Tengah)
  const orb1Y = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], ["0vh", "70vh", "150vh", "220vh"]);
  const orb1X = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], ["0vw", "30vw", "-20vw", "0vw"]);

  // Mapping pergerakan Orb 2 (Kanan Bawah ke Kiri ke Kanan Atas)
  const orb2Y = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], ["0vh", "-50vh", "-120vh", "-180vh"]);
  const orb2X = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], ["0vw", "-30vw", "20vw", "0vw"]);
  const orb2Rotate = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], ["0deg", "90deg", "180deg", "360deg"]);

  useEffect(() => {
    initTheme();
    if (isAuthenticated) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isAuthenticated, navigate, initTheme]);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden relative selection:bg-primary/20">
      
      {/* Abstract Sotto Ornaments (Premium Feel + Scroll Animation) */}
      <motion.div 
        style={{ y: orb1Y, x: orb1X }}
        className="fixed top-0 left-0 w-[800px] h-[800px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0" 
      />
      <motion.div 
        style={{ y: orb2Y, x: orb2X, rotate: orb2Rotate }}
        className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3 z-0" 
      />

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/30 transition-all duration-300">
        <div className="container mx-auto px-6 h-[72px] flex justify-between items-center max-w-6xl">
          <Link to="/" className="text-2xl font-bold tracking-tight text-primary font-serif italic">
            Sotto
          </Link>
          <div className="flex gap-4 items-center">
            <Link
              to={ROUTES.LOGIN}
              className="px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              Masuk
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className="px-5 py-2.5 text-sm font-bold bg-foreground text-background rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full overflow-hidden">
        
        {/* HERO SECTION */}
        <section className="container mx-auto px-6 max-w-6xl pt-48 pb-32 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight mb-8 max-w-5xl leading-[1.05]">
            Mulai Karir Profesionalmu <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-500 to-emerald-400">
              Sejak di Bangku Sekolah.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-12 font-medium leading-relaxed">
            Sotto adalah wadah bagi siswa vokasi dan kreator muda. Bangun portofolio, temukan klien pertamamu, dan jual karya digital dengan aman dalam satu platform terintegrasi.
          </p>

          <Link
            to={ROUTES.REGISTER}
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/25"
          >
            Mulai Sekarang, Gratis
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>

        {/* SECTION 1: SOSIAL MEDIA / POSTINGAN (Kiri Teks, Kanan Visual) */}
        <section className="container mx-auto px-6 max-w-6xl py-32 border-t border-border/30">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                Karyamu Layak <br className="hidden lg:block"/> Dilihat Dunia.
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Bagikan hasil kerjamu, ceritakan proses di baliknya, dan tawarkan jasa secara langsung kepada siapa saja yang melihat potensimu di linimasa.
              </p>
            </div>

            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent blur-3xl -z-10 rounded-full" />
              
              <div className="bg-card rounded-2xl border border-border shadow-2xl overflow-hidden transform lg:rotate-1 hover:rotate-0 transition-all duration-500 relative">
                <div className="p-0 pointer-events-none opacity-95">
                  <PostCard post={MOCK_POST as any} isThreadParent={true} hideAncestors={true} preloadedListing={MOCK_LISTING} />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2: CHAT & PENAWARAN (Kanan Teks, Kiri Visual) */}
        <section className="container mx-auto px-6 max-w-6xl py-32 border-t border-border/30">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24">
            
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent blur-3xl -z-10 rounded-full" />
              
              {/* Wadah Chat Interaktif */}
              <div className="bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl relative overflow-hidden flex flex-col h-[500px]">
               
                <div className="flex-1 overflow-hidden flex flex-col justify-end p-4 space-y-4 pointer-events-none">
                  {/* Chat dari pembeli (Kita simulasikan userAccountId = buyer-1 agar chat pembeli ada di kanan) */}
                  <MessageBubble msg={MOCK_CHAT_1} userAccountId="buyer-1" />
                  
                  {/* Balasan dari penjual (Di kiri) */}
                  <MessageBubble msg={MOCK_CHAT_2} userAccountId="buyer-1" />
                  
                  {/* Penawaran Custom dari penjual (Di kiri) */}
                  <div className="w-full flex justify-start">
                    <div className="w-full max-w-[85%]">
                      <CustomOfferCard 
                        msg={MOCK_OFFER_MSG} 
                        userAccountId="buyer-1" 
                        actionLoading={false} 
                        acceptOffer={() => {}} 
                        rejectOffer={() => {}} 
                        withdrawOffer={() => {}} 
                        navigate={() => {}} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-8 text-center lg:text-left">
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                Kesepakatan Dimulai <br className="hidden lg:block"/> Dari Obrolan.
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Tertarik dengan sebuah portofolio? Langsung diskusikan detail proyek, kirim referensi, dan berikan penawaran harga khusus (Custom Offer) tanpa perlu meninggalkan aplikasi.
              </p>
            </div>

          </div>
        </section>

        {/* SECTION 3: ORDER, PEMBAYARAN, & COMMERCE (Tengah) */}
        <section className="container mx-auto px-6 max-w-4xl py-32 border-t border-border/30 text-center flex flex-col items-center">
          
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-8">
            Transaksi Lancar, <br /> Pembayaran Terlindungi.
          </h2>
          
          <p className="text-xl text-muted-foreground leading-relaxed mb-20 max-w-3xl">
            Sistem menahan pembayaran klien dengan aman dan baru meneruskannya ke dompetmu setelah pekerjaan selesai. Atau, jual produk digitalmu dan biarkan pembeli mengunduhnya secara instan.
          </p>

          <div className="w-full flex flex-col md:flex-row gap-8 items-stretch justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent blur-3xl -z-10 rounded-full" />
            
            {/* Listing Card Showcase */}
            <div className="flex-1 pointer-events-none transform hover:-translate-y-1 transition-transform duration-500">
              <div className="h-full bg-card rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col text-left">
                <div className="px-5 py-3 border-b border-border bg-muted/20">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Produk Digital Instan</p>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-center">
                  <ListingCard listing={MOCK_LISTING as any} isLink={false} />
                </div>
              </div>
            </div>

            {/* Order Tracker Showcase */}
            <div className="flex-1 pointer-events-none transform hover:-translate-y-1 transition-transform duration-500 delay-100">
              <div className="h-full bg-card rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col text-left">
                <div className="px-5 py-3 border-b border-border bg-muted/20">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pelacakan Pesanan</p>
                </div>
                <div className="flex-1 flex items-center justify-center bg-card">
                  <div className="w-full">
                    {/* Wadah yang benar untuk tracker agar ukurannya pas */}
                    <OrderProgressTracker status={OrderStatus.InProgress} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* FOOTER CTA SECTION */}
        <section className="container mx-auto px-6 max-w-5xl py-32 mb-16">
          <div className="bg-foreground rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/30 blur-[100px] rounded-full pointer-events-none" />
            
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-background mb-8 relative z-10 leading-tight">
              Siap Memulai Langkah Pertamamu?
            </h2>
            <p className="text-lg md:text-xl text-background/70 mb-12 max-w-2xl mx-auto relative z-10">
              Bergabunglah dengan ratusan kreator vokasi lainnya dan mulai hasilkan pendapatan dari keahlianmu sekarang.
            </p>
            <Link
              to={ROUTES.REGISTER}
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-background text-foreground rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl relative z-10"
            >
              Daftar Sekarang, Gratis
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
