import { Plus } from "lucide-react";
import { PostCard } from "../features/feed/components/PostCard";
import { Link } from "react-router";

// Mock Data for the Feed
const MOCK_POSTS = [
  {
    id: "1",
    author: {
      name: "Kadek Agus",
      avatarUrl: "https://i.pravatar.cc/150?u=kadek",
      school: "SMK Negeri 1 Denpasar - RPL",
    },
    createdAt: "2 jam yang lalu",
    content: "Akhirnya selesai nge-build UI untuk sistem POS kasir pakai React dan Tailwind CSS v4!🔥 Sangat smooth dan gampang dikustomisasi.",
    tags: ["React", "TailwindCSS", "Frontend"],
    media: ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800"],
    attachedListing: {
      thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=200",
      title: "Jasa Pembuatan Web MVP",
      price: 150000,
    },
    stats: {
      likes: 128,
      comments: 34,
    },
  },
  {
    id: "2",
    author: {
      name: "Melani Putri",
      avatarUrl: "https://i.pravatar.cc/150?u=melani",
      school: "SMK Dwijendra - DKV",
    },
    createdAt: "5 jam yang lalu",
    content: "Eksplorasi desain logo untuk startup coffee shop lokal di Bali. Gimana menurut kalian? Masih butuh sedikit revisi di bagian tipografinya sih 🤔",
    tags: ["LogoDesign", "Figma", "Branding"],
    media: ["https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800"],
    stats: {
      likes: 85,
      comments: 12,
    },
  },
  {
    id: "3",
    author: {
      name: "Wayan Surya",
      avatarUrl: "https://i.pravatar.cc/150?u=wayan",
      school: "SMK TI Bali Global",
    },
    createdAt: "1 hari yang lalu",
    content: "Sedang mengerjakan backend pakai NestJS + GraphQL. Bener-bener powerful buat handle relational data yang kompleks dibanding REST biasa.",
    tags: ["NestJS", "GraphQL", "Backend"],
    stats: {
      likes: 45,
      comments: 8,
    },
  }
];

export default function FeedTimelineRoute() {
  return (
    <div className="pb-20 relative min-h-screen">
      {/* List of Posts */}
      <div className="flex flex-col">
        {MOCK_POSTS.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>

      {/* Floating Action Button for Create Post */}
      <Link
        to="/workspace/create"
        className="fixed bottom-20 right-4 md:hidden z-40 bg-indigo-600 text-white h-14 w-14 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all"
        aria-label="Buat Postingan Baru"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
}
