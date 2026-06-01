import * as React from "react";
import { Info } from "lucide-react";

export function AboutCard() {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tentang Aplikasi</h2>
      <div className="p-5 bg-card rounded-sm border border-border flex flex-col items-center text-center space-y-4">
        {/* App Logo */}
        <div className="flex flex-col items-center">
          <span className="text-3xl font-extrabold tracking-tight text-primary font-serif italic">
            Sotto
          </span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mt-1">
            Social & Collaboration
          </span>
        </div>

        {/* Divider */}
        <div className="w-12 h-0.5 bg-border rounded-full" />

        {/* Description */}
        <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
          Sotto adalah platform sosial media modern untuk berbagi cerita, berkolaborasi dalam proyek, dan berinteraksi secara real-time.
        </p>

        {/* Version Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-full text-[10px] font-medium text-foreground border border-border/40">
          <Info className="h-3.5 w-3.5 text-primary" />
          <span>Versi 0.6.9 (beta-stable)</span>
        </div>
      </div>
    </section>
  );
}
