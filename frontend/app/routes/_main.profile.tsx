import { Star, MapPin, Link as LinkIcon, Settings } from "lucide-react";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import * as React from "react";

const PROFILE_DATA = {
  name: "Kadek Agus",
  username: "@kadekagus_",
  bio: "Fullstack Developer in making. Suka ngulik React, Next.js, dan Go. Menerima jasa pembuatan web dan tugas akhir.",
  location: "Denpasar, Bali",
  website: "sotto.io/kadekagus",
  coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
  avatarUrl: "https://i.pravatar.cc/150?u=kadek",
  trustScore: 4.8,
  followers: 1240,
  following: 85,
  portfolios: [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1618477247222-ac60c6218515?auto=format&fit=crop&q=80&w=400",
  ],
  listings: [
    {
      id: "l1",
      title: "Jasa Pembuatan Web Company Profile MVP",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=200",
      price: 150000,
      estimatedTime: "3 Hari",
      isDigitalProduct: false,
    },
    {
      id: "l2",
      title: "Template UI E-Commerce Lengkap (Figma)",
      thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=200",
      price: 50000,
      isDigitalProduct: true,
      fileSize: "15 MB .FIG",
    }
  ]
};

export default function ProfileRoute() {
  const [activeTab, setActiveTab] = React.useState<"portfolio" | "etalase">("portfolio");

  return (
    <div className="pb-20 relative bg-white dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-40 w-full overflow-hidden">
          <img src={PROFILE_DATA.coverUrl} alt="Cover" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-4 right-4">
          <button className="p-2 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50 transition">
            <Settings className="h-5 w-5" />
          </button>
        </div>
        <div className="px-4 relative -mt-16">
          <Avatar 
            src={PROFILE_DATA.avatarUrl} 
            alt={PROFILE_DATA.name} 
            size="xl" 
            className="border-4 border-white dark:border-gray-900 shadow-sm bg-white dark:bg-gray-900"
          />
        </div>
      </div>

      {/* Bio Section */}
      <div className="px-4 mt-3">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{PROFILE_DATA.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{PROFILE_DATA.username}</p>
          </div>
          <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-lg">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-bold">{PROFILE_DATA.trustScore}</span>
          </div>
        </div>

        <p className="text-sm text-gray-800 dark:text-gray-200 mt-4 leading-relaxed">
          {PROFILE_DATA.bio}
        </p>

        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {PROFILE_DATA.location}
          </div>
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
            <LinkIcon className="h-4 w-4" />
            <a href="#" className="hover:underline">{PROFILE_DATA.website}</a>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 text-sm">
          <div>
            <span className="font-bold text-gray-900 dark:text-gray-100">{PROFILE_DATA.followers.toLocaleString()}</span>{" "}
            <span className="text-gray-500 dark:text-gray-400">Pengikut</span>
          </div>
          <div>
            <span className="font-bold text-gray-900 dark:text-gray-100">{PROFILE_DATA.following.toLocaleString()}</span>{" "}
            <span className="text-gray-500 dark:text-gray-400">Mengikuti</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button variant="primary" className="w-full shadow-md shadow-indigo-500/20">Ikuti</Button>
          <Button variant="outline" className="w-full">Pesan</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center mt-6 border-b border-gray-200 dark:border-gray-800 px-4">
        <button
          onClick={() => setActiveTab("portfolio")}
          className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "portfolio"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          Portofolio
        </button>
        <button
          onClick={() => setActiveTab("etalase")}
          className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "etalase"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          Etalase Jasa
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "portfolio" ? (
          <div className="grid grid-cols-3 gap-1.5">
            {PROFILE_DATA.portfolios.map((url, i) => (
              <div key={i} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition">
                <img src={url} alt={`Portfolio ${i}`} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {PROFILE_DATA.listings.map((listing) => (
              <div key={listing.id} className="flex gap-4 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition cursor-pointer group">
                <div className="h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                  <img src={listing.thumbnail} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                </div>
                <div className="flex flex-col flex-1 justify-center min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm line-clamp-2 leading-tight">
                    {listing.title}
                  </h3>
                  <p className="font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                    Rp {listing.price.toLocaleString("id-ID")}
                  </p>
                  <div className="mt-1.5">
                    {listing.isDigitalProduct ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Akses Instan · {listing.fileSize}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                        Estimasi {listing.estimatedTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
