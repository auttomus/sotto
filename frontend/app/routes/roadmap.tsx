import * as React from "react";
import { Link } from "react-router";
import { ArrowLeft, CheckCircle2, Circle, PanelLeft, Layout, ShieldAlert, FileText, School, ChevronRight, Phone } from "lucide-react";
import { motion } from "framer-motion";

interface Milestone {
  title: string;
  description: string;
  progress: number; // 0 to 100
  status: "completed" | "in-progress" | "planned";
  targetDate: string;
  icon: React.ReactNode;
  bullets: string[];
}

export default function RoadmapRoute() {
  const milestones: Milestone[] = [
    {
      title: "Platform Core Release",
      description: "Membangun pondasi utama ekosistem digital Sotto untuk interaksi sosial dan transaksi.",
      progress: 100,
      status: "completed",
      targetDate: "Q2 2026",
      icon: <CheckCircle2 className="h-6 w-6 text-emerald-500" />,
      bullets: [
        "Sistem feed sosial & berbagi portofolio karya",
        "Direct messaging & chat real-time terintegrasi",
        "Modul negosiasi Custom Offer dalam ruang obrolan",
        "Integrasi Escrow Payment Gateway (Midtrans Snap & Webhook)"
      ]
    },
    {
      title: "Admin & Moderation Panel",
      description: "Pusat kendali operasional platform untuk tim admin, verifikator, dan mediator sengketa.",
      progress: 15,
      status: "in-progress",
      targetDate: "Q3 2026",
      icon: <Layout className="h-6 w-6 text-violet-500 animate-pulse" />,
      bullets: [
        "Dashboard analisis transaksi dan escrow audit",
        "Sistem resolusi sengketa mediasi pesanan",
        "Manajemen verifikasi akun kreator dan portofolio",
        "Moderasi konten otomatis & pelaporan pelanggaran"
      ]
    },
    {
      title: "Mobile Responsiveness & Dedicated Apps",
      description: "Mengoptimalkan aksesibilitas platform di semua jenis perangkat mobile secara native.",
      progress: 0,
      status: "planned",
      targetDate: "Q4 2026",
      icon: <Phone className="h-6 w-6 text-muted-foreground" />,
      bullets: [
        "Peningkatan mobile responsiveness UI web 100% fluid",
        "Pengembangan aplikasi mobile native terpisah (Android & iOS)",
        "Notifikasi push real-time di HP",
        "Offline-first support untuk pengiriman pesan lokal"
      ]
    },
    {
      title: "Badan Hukum, Regulasi & Kemitraan Vokasi",
      description: "Membangun payung hukum yang sah dan kerja sama resmi dengan institusi pendidikan.",
      progress: 0,
      status: "planned",
      targetDate: "Q1 2027",
      icon: <School className="h-6 w-6 text-muted-foreground" />,
      bullets: [
        "Pendirian badan hukum resmi (PT) untuk legalitas platform",
        "Penyusunan syarat & ketentuan legalitas kerja lepas siswa vokasi",
        "Penandatanganan Perjanjian Kerja Sama (PKS) dengan SMK/Sekolah Vokasi",
        "Program konversi transaksi di Sotto menjadi SKS/Nilai PKL Magang resmi"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 relative overflow-hidden pb-20">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3 z-0" />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/60 border-b border-border/30 w-full">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center max-w-4xl">
          <Link to="/" className="flex items-center gap-2 group text-sm font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Kembali ke Beranda
          </Link>
          <span className="text-xl font-bold tracking-tight text-primary font-serif italic">
            Sotto Roadmap
          </span>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 max-w-3xl pt-16">
        {/* Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4 uppercase tracking-wider">
            Development Progress
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Peta Rencana & Pengembangan Sotto
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto font-medium">
            Transparansi dalam setiap proses. Ikuti perjalanan kami membangun ekosistem kerja digital terbaik bagi siswa vokasi dan kreator muda.
          </p>
        </div>

        {/* Overall progress bar */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 mb-12 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-extrabold text-foreground uppercase tracking-wider">Total Progress Platform</span>
            <span className="text-sm font-extrabold text-primary">35%</span>
          </div>
          <div className="w-full bg-muted h-3 rounded-full overflow-hidden border border-border/30">
            <div className="bg-gradient-to-r from-primary to-violet-500 h-full rounded-full w-[35%]" />
          </div>
          <div className="flex gap-6 mt-4 text-[11px] text-muted-foreground font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Selesai (1/4)
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              Sedang Dikerjakan (1/4)
            </div>
            <div className="flex items-center gap-1.5 font-normal">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
              Direncanakan (2/4)
            </div>
          </div>
        </div>

        {/* Milestones List */}
        <div className="space-y-8 relative">
          {/* Vertical connecting line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border/40 -z-10" />

          {milestones.map((milestone, idx) => (
            <div key={idx} className="flex gap-6 group">
              {/* Left Timeline Dot indicator */}
              <div className="flex flex-col items-center shrink-0">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center border shadow-sm transition-all duration-300 ${
                  milestone.status === "completed" 
                    ? "bg-emerald-500/5 border-emerald-500/30 text-emerald-500" 
                    : milestone.status === "in-progress"
                    ? "bg-violet-500/5 border-violet-500/30 text-violet-500 ring-4 ring-violet-500/10"
                    : "bg-muted border-border text-muted-foreground"
                }`}>
                  {milestone.icon}
                </div>
              </div>

              {/* Card content */}
              <div className="flex-1 bg-card border border-border/50 rounded-2xl p-6 shadow-sm group-hover:border-border transition-colors duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2.5">
                      {milestone.title}
                    </h3>
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{milestone.targetDate}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border tracking-wider ${
                      milestone.status === "completed" 
                        ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500" 
                        : milestone.status === "in-progress"
                        ? "bg-violet-500/5 border-violet-500/20 text-violet-500"
                        : "bg-muted border-border/30 text-muted-foreground"
                    }`}>
                      {milestone.status === "completed" ? "Selesai" : milestone.status === "in-progress" ? "Dikerjakan" : "Rencana"}
                    </span>
                    <span className="text-xs font-extrabold text-foreground">{milestone.progress}%</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  {milestone.description}
                </p>

                {/* Progress bar inside card */}
                {milestone.status !== "planned" && (
                  <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden mb-6 border border-border/10">
                    <div className={`h-full rounded-full ${
                      milestone.status === "completed" ? "bg-emerald-500" : "bg-violet-500"
                    }`} style={{ width: `${milestone.progress}%` }} />
                  </div>
                )}

                {/* Bullets */}
                <ul className="space-y-2.5 border-t border-border/40 pt-4">
                  {milestone.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5 text-xs font-medium text-foreground/80">
                      {milestone.status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className={`h-4 w-4 shrink-0 mt-0.5 ${
                          milestone.status === "in-progress" && bIdx === 0 
                            ? "text-violet-500 fill-violet-500/10" 
                            : "text-muted-foreground/30"
                        }`} />
                      )}
                      <span className="leading-normal">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
