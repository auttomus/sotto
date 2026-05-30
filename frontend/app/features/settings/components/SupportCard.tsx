import * as React from "react";
import { Mail, Copy, Check, Send } from "lucide-react";
import { useToastStore } from "~/core/store/useToastStore";

export function SupportCard() {
  const [copied, setCopied] = React.useState(false);
  const addToast = useToastStore((s) => s.addToast);
  const emailAddress = "support@sotto.auttomus.xyz";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopied(true);
      addToast("success", "Alamat email berhasil disalin ke clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      addToast("error", "Gagal menyalin alamat email");
    }
  };

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hubungi Kami</h2>
      <div className="p-5 bg-card rounded-sm border border-border flex flex-col space-y-4">
        <div>
          <h3 className="font-bold text-xs text-foreground flex items-center gap-1.5">
            <Mail className="h-4 w-4 text-primary" />
            Kirim Masukan & Laporan
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
            Menemukan kendala atau memiliki ide kreatif untuk Sotto? Sampaikan aspirasi atau laporkan bug langsung ke tim dukungan kami.
          </p>
        </div>

        {/* Email Copy Card */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-sm border border-border/60">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Email Support</p>
            <p className="text-xs font-mono font-medium text-foreground truncate select-all">{emailAddress}</p>
          </div>
          <button
            onClick={handleCopy}
            className="p-2 bg-card hover:bg-accent border border-border text-foreground rounded-sm transition cursor-pointer active:scale-95 flex items-center justify-center shrink-0"
            title="Salin Email"
          >
            {copied ? (
              <Check className="h-4 w-4 text-success" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Mailto Direct Link */}
        <a
          href={`mailto:${emailAddress}?subject=Saran/Laporan Sotto&body=Halo Tim Sotto,%0A%0ASaya ingin memberikan masukan / melaporkan masalah berikut:%0A%0A[Tulis pesan Anda di sini]%0A%0A--%0ADikirim dari Pengaturan Sotto`}
          className="w-full h-10 bg-primary hover:opacity-90 text-primary-foreground font-bold rounded-sm flex items-center justify-center gap-2 text-xs transition cursor-pointer shadow-sm active:scale-[0.98]"
        >
          <Send className="h-3.5 w-3.5" />
          Kirim Email Sekarang
        </a>
      </div>
    </section>
  );
}
