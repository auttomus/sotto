import * as React from "react";
import { useSearchAccountsQuery } from "~/core/apollo/generated";
import { Avatar } from "~/components/ui/Avatar";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import { useToastStore } from "~/core/store/useToastStore";

interface MentionSuggestionsProps {
  value: string;
  onChange: (newValue: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>;
}

export function MentionSuggestions({ value, onChange, inputRef }: MentionSuggestionsProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const addToast = useToastStore((s) => s.addToast);

  // Deteksi kata sebutan (@query) aktif di sebelah kursor
  const getActiveMention = React.useCallback(() => {
    const input = inputRef.current;
    if (!input) return null;

    const cursor = input.selectionStart ?? 0;
    const textBeforeCursor = value.slice(0, cursor);

    // Cari letak karakter '@' terakhir sebelum kursor
    const lastAtIdx = textBeforeCursor.lastIndexOf("@");
    if (lastAtIdx === -1) return null;

    // Pastikan tidak ada spasi atau baris baru di antara '@' dan kursor
    const textAfterAt = textBeforeCursor.slice(lastAtIdx + 1);
    if (/\s/.test(textAfterAt)) return null;

    // Pastikan karakter sebelum '@' adalah spasi kosong, awal baris, atau baris baru
    if (lastAtIdx > 0 && !/\s/.test(textBeforeCursor[lastAtIdx - 1])) {
      return null;
    }

    return {
      query: textAfterAt,
      startIdx: lastAtIdx,
      endIdx: cursor,
    };
  }, [value, inputRef]);

  // Pantau perubahan input teks untuk memperbarui kueri pencarian aktif
  React.useEffect(() => {
    const active = getActiveMention();
    if (active) {
      setSearchQuery(active.query);
    } else {
      setSearchQuery("");
    }
  }, [value, getActiveMention]);

  // Lakukan debounce kueri pencarian (200ms) untuk menghemat permintaan API
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Ambil data akun yang cocok dari database
  const activeMention = getActiveMention();
  const showSuggestions = activeMention !== null;

  const { data, loading } = useSearchAccountsQuery({
    variables: { query: debouncedQuery },
    skip: !showSuggestions || debouncedQuery.trim() === "",
  });

  const accounts = data?.searchAccounts || [];
  
  // Batasi rekomendasi pencarian maksimal hanya 5 orang teratas
  const filteredAccounts = accounts.slice(0, 5);

  const handleSelect = (username: string) => {
    const active = getActiveMention();
    if (!active) return;

    // Validasi batasan: Periksa jumlah tag unik yang saat ini ada
    const matches = value.match(/\B@[a-zA-Z0-9_]{3,30}\b/g) || [];
    if (matches.length >= 5) {
      addToast("error", "Maksimal 5 tag orang diperbolehkan per postingan/pesan");
      return;
    }

    const before = value.slice(0, active.startIdx);
    const after = value.slice(active.endIdx);
    const newValue = `${before}@${username} ${after}`;

    onChange(newValue);

    // Kembalikan fokus kursor tepat setelah spasi tag nama orang
    setTimeout(() => {
      const input = inputRef.current;
      if (input) {
        input.focus();
        const newCursorPos = active.startIdx + username.length + 2; // @ + username + spasi
        input.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 50);
  };

  if (!showSuggestions || filteredAccounts.length === 0) return null;

  return (
    <div 
      className="absolute left-0 bottom-full mb-2.5 z-50 w-full max-w-[280px] bg-popover/95 border border-border shadow-xl rounded-2xl p-1.5 flex flex-col gap-0.5 animate-scale-in"
      onClick={(e) => e.stopPropagation()} // Mencegah bubbling click
    >
      <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground tracking-wide uppercase border-b border-border mb-1">
        Rekomendasi Pengguna
      </div>
      <div className="flex flex-col max-h-[220px] overflow-y-auto gap-0.5">
        {filteredAccounts.map((acc) => (
          <button
            key={acc.id}
            type="button"
            onClick={() => handleSelect(acc.username)}
            className="flex items-center gap-2.5 w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-accent hover:text-accent-foreground transition-all duration-150 cursor-pointer group active:scale-[0.98]"
          >
            <Avatar 
              src={resolveMediaUrl(acc.avatarObjectKey)} 
              alt={acc.displayName || acc.username} 
              size="sm"
              className="shrink-0 h-6 w-6 border border-border"
            />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-foreground truncate group-hover:text-accent-foreground">
                {acc.displayName || acc.username}
              </span>
              <span className="text-[10px] text-muted-foreground truncate font-medium group-hover:text-accent-foreground/80">
                @{acc.username}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
