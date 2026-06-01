import { useState } from "react";
import { Link, useOutlet, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { PostCard } from "~/features/feed/components/PostCard";

// Mock post untuk showcase di halaman login
const LOGIN_MOCK_POST = {
  id: "login-mock",
  content: "Bangga banget akhirnya bisa dapet project pertamaku dari klien luar negeri lewat Sotto! 🚀✨\nTerima kasih buat semua yang udah support portofolioku. Untuk teman-teman vokasi yang lain, semangat terus berkarya!",
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  author: {
    accountId: "author-login",
    displayName: "Siti Kreatif (Multimedia)",
    username: "sitikreatif",
    avatarObjectKey: null,
  },
  likesCount: 342,
  likedByMe: true,
  repliesCount: 45,
  tags: [{ id: "t1", name: "firstproject" }, { id: "t2", name: "vokasihebat" }],
};

// Mock post untuk showcase di halaman register
const REGISTER_MOCK_POST = {
  id: "register-mock",
  content: "Hari ini akhirnya berani upload portofolio desain UI/UX pertamaku di Sotto! 🎨✨\nDeg-degan banget tapi semoga ada klien yang tertarik. Wish me luck teman-teman!",
  createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  author: {
    accountId: "author-register",
    displayName: "Andi Desain (RPL)",
    username: "andidesign",
    avatarObjectKey: null,
  },
  likesCount: 128,
  likedByMe: false,
  repliesCount: 12,
  tags: [{ id: "t3", name: "uiux" }, { id: "t4", name: "kreatorbaru" }],
};

interface FrozenFormProps {
  isRegister: boolean;
  outlet: React.ReactNode;
}

function FrozenForm({ isRegister, outlet }: FrozenFormProps) {
  const [frozen] = useState({ isRegister, outlet });

  return (
    <motion.div
      initial={{ opacity: 0, x: frozen.isRegister ? 40 : -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: frozen.isRegister ? -40 : 40 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="w-full py-8"
    >
      {frozen.outlet}
    </motion.div>
  );
}

export default function AuthLayout() {
  const location = useLocation();
  const outlet = useOutlet();
  const isRegister = location.pathname.includes("/register");

  return (
    <div className="min-h-screen bg-background flex text-foreground font-sans selection:bg-primary/20 overflow-hidden">
      
      {/* PANEL KIRI: Visual & Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-950 overflow-hidden flex-col justify-between p-12 xl:p-16">
        
        {/* Orb 1: Shifting top-left (Login) to top-right (Register) */}
        <motion.div 
          layout
          key="auth-orb-1"
          className="absolute w-[800px] h-[800px] bg-primary/20 rounded-full blur-[130px] pointer-events-none" 
          style={{
            top: "-25%",
            left: isRegister ? "auto" : "-25%",
            right: isRegister ? "-25%" : "auto",
          }}
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ 
            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            scale: { duration: 30, repeat: Infinity, ease: "linear" },
            layout: { duration: 0.8, ease: "easeInOut" }
          }}
        />

        {/* Orb 2: Shifting bottom-right (Login) to bottom-left (Register) and changing color */}
        <motion.div 
          layout
          key="auth-orb-2"
          className="absolute w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none" 
          style={{
            bottom: "-25%",
            left: isRegister ? "-25%" : "auto",
            right: isRegister ? "auto" : "-25%",
          }}
          animate={{ 
            rotate: -360, 
            scale: [1, 1.2, 1],
            backgroundColor: isRegister ? "rgba(16, 185, 129, 0.2)" : "rgba(139, 92, 246, 0.2)" // Emerald vs Violet
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 25, repeat: Infinity, ease: "linear" },
            backgroundColor: { duration: 0.8, ease: "easeInOut" },
            layout: { duration: 0.8, ease: "easeInOut" }
          }}
        />

        {/* Branding Header */}
        <div className="relative z-10 flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold tracking-tight text-white font-serif italic hover:opacity-80 transition-opacity">
            Sotto
          </Link>
          <Link to="/" className="text-sm font-medium text-white/70 hover:text-white flex items-center gap-1 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Kembali
          </Link>
        </div>

        {/* Floating Post Showcase */}
        <motion.div 
          layout
          key="showcase-card-container"
          className="relative z-10 w-full max-w-md mx-auto"
          animate={{ rotate: isRegister ? 2 : -2 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
           <div className={`absolute inset-0 bg-gradient-to-tr blur-2xl rounded-full -z-10 transition-colors duration-700 ${
             isRegister ? "from-emerald-500/10 to-transparent" : "from-violet-500/10 to-transparent"
           }`} />
           
           {/* Glassmorphism Wrapper for PostCard */}
           <div className="bg-card/95 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden pointer-events-none">
             <div className="opacity-90">
               <AnimatePresence mode="wait">
                 <motion.div
                   key={isRegister ? "register-post" : "login-post"}
                   initial={{ opacity: 0, y: 15 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -15 }}
                   transition={{ duration: 0.35, ease: "easeOut" }}
                 >
                   <PostCard 
                     post={(isRegister ? REGISTER_MOCK_POST : LOGIN_MOCK_POST) as any} 
                     isThreadParent={true} 
                     hideAncestors={true} 
                   />
                 </motion.div>
               </AnimatePresence>
             </div>
           </div>
        </motion.div>

        {/* Inspirational Footer Quote */}
        <div className="relative z-10 h-28 flex flex-col justify-end">
          <AnimatePresence mode="wait">
            <motion.blockquote 
              key={isRegister ? "register-quote" : "login-quote"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-3"
            >
              <p className="text-xl font-medium text-white/90 leading-relaxed">
                {isRegister 
                  ? '"Platform terbaik untuk menjajakan keahlianmu. Temukan klien yang menghargai karyamu."'
                  : '"Sotto membantu saya membangun portofolio profesional dan memenangkan klien bahkan sebelum saya lulus. (anggap aja begitu) (masih belum ada review asli)"'}
              </p>
              <footer className="text-sm font-bold text-white/50 uppercase tracking-widest">
                {isRegister ? "Ekosistem Kreator Vokasi" : "Siti, Siswi SMK Multimedia"}
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
      </div>

      {/* PANEL KANAN: Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center relative bg-background min-h-screen">
        
        {/* Mobile Header (Hanya tampil di layar kecil) */}
        <div className="absolute top-0 inset-x-0 p-6 flex items-center justify-between lg:hidden z-20">
          <Link to="/" className="text-2xl font-bold tracking-tight text-primary font-serif italic">
            Sotto
          </Link>
          <Link to="/" className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Form Container (Clean, Symmetrical & Animated) */}
        <div className="w-full px-6 py-12 sm:px-12 xl:px-24 relative z-10 overflow-y-auto max-h-screen flex flex-col justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <FrozenForm
              key={location.pathname}
              isRegister={isRegister}
              outlet={outlet}
            />
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
