import { useToastStore } from "~/core/store/useToastStore";

interface ShareOptions {
  title: string;
  text?: string;
  url: string;
}

export async function shareObject({ title, text, url }: ShareOptions) {
  const addToast = useToastStore.getState().addToast;

  // Ensure absolute URL if it is a relative path
  let absoluteUrl = url;
  if (typeof window !== "undefined") {
    if (url.startsWith("/")) {
      absoluteUrl = `${window.location.origin}${url}`;
    }
  }

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title,
        text: text || title,
        url: absoluteUrl,
      });
      addToast("success", "Berhasil dibagikan!");
    } catch (error: any) {
      // Ignore AbortError when user cancels native sharing
      if (error.name !== "AbortError") {
        addToast("error", "Gagal membagikan tautan.");
      }
    }
  } else if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(absoluteUrl);
      addToast("success", "Tautan berhasil disalin ke papan klip!");
    } catch (error) {
      addToast("error", "Gagal menyalin tautan.");
    }
  } else {
    addToast("error", "Fitur berbagi tidak didukung di peramban ini.");
  }
}
