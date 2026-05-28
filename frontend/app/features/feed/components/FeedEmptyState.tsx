import * as React from "react";
import { Link } from "react-router";
import { ROUTES } from "~/core/constants/ROUTES";

/**
 * Empty state shown when the feed has no posts.
 * Inline SVG illustration + CTA to create first post.
 */
export function FeedEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {/* Inline SVG Illustration */}
      <div className="mb-6">
        <svg
          width="160"
          height="160"
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-muted-foreground/40"
          aria-hidden="true"
        >
          {/* Easel / canvas board */}
          <rect x="35" y="28" width="90" height="72" rx="6" className="fill-muted stroke-current" strokeWidth="2" />
          <rect x="45" y="38" width="70" height="52" rx="3" className="fill-card stroke-current" strokeWidth="1.5" />

          {/* Mountain landscape in canvas */}
          <path d="M45 80 L65 55 L80 70 L95 50 L115 80 Z" className="fill-primary/20" />
          <circle cx="100" cy="48" r="6" className="fill-warning/30" />

          {/* Paintbrush strokes */}
          <path d="M50 65 Q60 60 70 65" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* Easel legs */}
          <line x1="55" y1="100" x2="42" y2="140" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="105" y1="100" x2="118" y2="140" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="80" y1="100" x2="80" y2="135" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />

          {/* Stars / sparkles */}
          <path d="M130 30 L132 36 L138 38 L132 40 L130 46 L128 40 L122 38 L128 36 Z" className="fill-primary" opacity="0.6" />
          <path d="M25 55 L26.5 59 L30.5 60.5 L26.5 62 L25 66 L23.5 62 L19.5 60.5 L23.5 59 Z" className="fill-primary/80" opacity="0.4" />
          <path d="M140 70 L141 73 L144 74 L141 75 L140 78 L139 75 L136 74 L139 73 Z" className="fill-primary/80" opacity="0.5" />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2">
        Belum Ada Karya
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
        Linimasa masih kosong. Jadilah yang pertama mengunggah portofoliomu dan tunjukkan karyamu ke dunia!
      </p>
      <Link
        to={ROUTES.WORKSPACE_CREATE}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all shadow-sm shadow-primary/20"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Unggah Karya Pertama
      </Link>
    </div>
  );
}
