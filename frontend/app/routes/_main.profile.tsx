import { Star, MapPin, Link as LinkIcon, Settings, Calendar, Briefcase, ChevronRight } from "lucide-react";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import * as React from "react";

const PROFILE_DATA = {
  name: "Kadek Agus",
  username: "@kadekagus_",
  bio: "Fullstack Developer in making. Suka ngulik React, Next.js, dan Go. Menerima pembuatan web MVP untuk startup dan bisnis lokal.",
  location: "Denpasar, Bali",
  website: "sotto.io/kadekagus",
  joinedDate: "Bergabung sejak Mei 2024",
  coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
  avatarUrl: "https://i.pravatar.cc/150?u=kadek",
  trustScore: 4.8,
  followers: 1240,
  following: 85,
  offerings: [
    {
      id: "l1",
      type: "service",
      title: "Jasa Pembuatan Web Company Profile MVP",
      description: "Saya akan membuatkan website company profile atau MVP menggunakan Next.js dan Tailwind CSS dalam waktu singkat.",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
      price: 150000,
      estimatedTime: "3 Hari",
    },
    {
      id: "l2",
      type: "digital",
      title: "Template UI E-Commerce Lengkap (Figma)",
      description: "Design system dan komponen UI untuk aplikasi e-commerce. Siap pakai untuk developer dan designer.",
      thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=600",
      price: 50000,
      fileSize: "15 MB .FIG",
    }
  ],
  experiences: [
    {
      id: "e1",
      role: "Frontend Engineer",
      company: "Startup Teknologi Bali",
      period: "Jan 2023 - Sekarang",
      description: "Mengembangkan aplikasi web responsif menggunakan React dan Tailwind CSS. Meningkatkan performa website hingga 40%."
    },
    {
      id: "e2",
      role: "Freelance Web Developer",
      company: "Berbagai Klien",
      period: "2021 - 2023",
      description: "Membantu UMKM lokal di Bali untuk mendigitalkan bisnis mereka melalui website company profile dan e-commerce sederhana."
    }
  ]
};

export default function ProfileRoute() {
  const [activeTab, setActiveTab] = React.useState<"penawaran" | "pengalaman">("penawaran");

  return (
    <div className="pb-20 relative bg-white dark:bg-gray-950 min-h-screen">
      {/* Header Mobile - Only visible when scrolling down or on very top, but let's keep it simple */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-4 py-3 border-b border-gray-100 dark:border-gray-800 md:hidden">
        <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-none">{PROFILE_DATA.name}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">{PROFILE_DATA.offerings.length} Penawaran</p>
      </div>

      {/* Cover Section */}
      <div className="relative">
        <div className="h-32 md:h-48 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
          <img src={PROFILE_DATA.coverUrl} alt="Cover" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="px-4 relative">
        <div className="flex justify-between items-start">
          <div className="relative -mt-12 md:-mt-16 mb-3">
            <div className="rounded-full border-4 border-white dark:border-gray-950 inline-block bg-white dark:bg-gray-900">
              <Avatar 
                src={PROFILE_DATA.avatarUrl} 
                alt={PROFILE_DATA.name} 
                size="xl" 
                className="w-20 h-20 md:w-28 md:h-28"
              />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <Settings className="h-5 w-5 text-gray-900 dark:text-gray-100" />
            </button>
            <Button variant="primary" className="font-bold px-5 rounded-full shadow-md shadow-indigo-500/20">Ikuti</Button>
          </div>
        </div>

        <div className="mt-1">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">{PROFILE_DATA.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">{PROFILE_DATA.username}</p>
        </div>

        <p className="text-sm md:text-base text-gray-900 dark:text-gray-100 mt-3 leading-relaxed">
          {PROFILE_DATA.bio}
        </p>

        {/* X-style Metadata */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {PROFILE_DATA.location}
          </div>
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
            <LinkIcon className="h-4 w-4" />
            <a href="#" className="hover:underline">{PROFILE_DATA.website}</a>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {PROFILE_DATA.joinedDate}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 text-sm">
          <div className="flex gap-1 hover:underline cursor-pointer">
            <span className="font-bold text-gray-900 dark:text-gray-100">{PROFILE_DATA.following.toLocaleString()}</span>
            <span className="text-gray-500 dark:text-gray-400">Mengikuti</span>
          </div>
          <div className="flex gap-1 hover:underline cursor-pointer">
            <span className="font-bold text-gray-900 dark:text-gray-100">{PROFILE_DATA.followers.toLocaleString()}</span>
            <span className="text-gray-500 dark:text-gray-400">Pengikut</span>
          </div>
        </div>
      </div>

      {/* Tabs - X Style */}
      <div className="flex items-center mt-4 border-b border-gray-200 dark:border-gray-800 px-4 md:px-0">
        <button
          onClick={() => setActiveTab("penawaran")}
          className="flex-1 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors relative"
        >
          <div className="py-3.5 text-sm font-bold w-fit mx-auto relative text-gray-900 dark:text-gray-100">
            Penawaran & Produk
            {activeTab === "penawaran" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>
            )}
          </div>
        </button>
        <button
          onClick={() => setActiveTab("pengalaman")}
          className="flex-1 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors relative"
        >
          <div className="py-3.5 text-sm font-bold w-fit mx-auto relative text-gray-500 dark:text-gray-400">
            Pengalaman
            {activeTab === "pengalaman" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>
            )}
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="w-full">
        {activeTab === "penawaran" ? (
          <div className="flex flex-col">
            {PROFILE_DATA.offerings.map((item) => (
              <div key={item.id} className="p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition cursor-pointer flex gap-4">
                <Avatar src={PROFILE_DATA.avatarUrl} size="sm" className="hidden sm:block shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1 hidden sm:flex">
                    <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">{PROFILE_DATA.name}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{PROFILE_DATA.username}</span>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mt-1 group">
                    <div className="h-40 sm:h-48 w-full overflow-hidden relative">
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                        {item.type === 'service' ? 'Jasa' : 'Produk Digital'}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">{item.description}</p>
                      
                      <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3">
                        <div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">Harga</span>
                          <span className="font-black text-indigo-600 dark:text-indigo-400 text-base">Rp {item.price.toLocaleString("id-ID")}</span>
                        </div>
                        {item.type === 'digital' ? (
                          <div className="text-right">
                            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">Akses Instan</span>
                            <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{item.fileSize}</span>
                          </div>
                        ) : (
                          <div className="text-right">
                            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">Estimasi</span>
                            <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{item.estimatedTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 mt-3 text-gray-500 dark:text-gray-400 ml-1">
                    <button className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 group/btn transition">
                      <div className="p-1.5 rounded-full group-hover/btn:bg-indigo-50 dark:group-hover/btn:bg-indigo-900/30 transition">
                        <Star className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-medium">Simpan</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col">
            {PROFILE_DATA.experiences.map((exp) => (
              <div key={exp.id} className="p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition flex gap-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center shrink-0">
                  <Briefcase className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">{exp.role}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-medium mb-1.5">
                    <span>{exp.company}</span>
                    <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></span>
                    <span>{exp.period}</span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
