import * as React from "react";
import { Link } from "react-router";
import { ROUTES } from "~/core/constants/ROUTES";

/**
 * Mengidentifikasi kata berformat @username dalam teks dan merendernya 
 * sebagai tautan reaktif (react-router Link) menggunakan warna aksen primer.
 */
export function formatMentions(text: string, isMine?: boolean) {
  if (!text) return "";
  
  // Memecah teks berdasarkan pola @username (3 hingga 30 karakter alfanumerik & underscore)
  const parts = text.split(/(\B@[a-zA-Z0-9_]{3,30}\b)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      const username = part.slice(1);
      return (
        <Link
          key={index}
          to={ROUTES.PROFILE_PUBLIC(username)}
          onClick={(e) => {
            // Mencegah trigger navigasi klik permukaan kartu
            e.stopPropagation();
          }}
          className={`font-semibold hover:underline transition-colors ${
            isMine 
              ? "text-white underline/40 hover:text-gray-100" 
              : "text-primary hover:text-primary/90"
          }`}
        >
          {part}
        </Link>
      );
    }
    return part;
  });
}
