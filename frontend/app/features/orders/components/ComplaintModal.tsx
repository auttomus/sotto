import * as React from "react";
import { AlertCircle, ShieldAlert } from "lucide-react";
import { Dialog } from "~/components/ui/Dialog";

interface ComplaintModalProps {
  onSubmit: (reason: string, notes?: string) => void;
  onClose: () => void;
}

export function ComplaintModal({ onSubmit, onClose }: ComplaintModalProps) {
  const [reason, setReason] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onSubmit(reason, notes);
    onClose();
  };

  return (
    <Dialog
      isOpen={true}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-sm">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-foreground text-sm tracking-tight leading-none">Ajukan Komplain Sengketa</h3>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Langkah Mediasi Escrow Sotto</p>
          </div>
        </div>
      }
      footer={
        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 font-bold text-xs py-3 rounded-lg border border-border bg-card text-foreground hover:bg-muted active:scale-[0.98] transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={!reason}
            onClick={handleSubmit}
            className="flex-1 font-bold text-xs py-3 rounded-lg bg-destructive hover:bg-destructive/95 text-destructive-foreground border-0 shadow-lg shadow-destructive/20 active:scale-[0.98] transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Ajukan Komplain Resmi
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Modern Alert Box */}
        <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-3.5 flex gap-3 items-start text-[11px] text-muted-foreground font-semibold leading-relaxed">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
          <div>
            <p className="text-foreground font-extrabold tracking-tight">Harap Perhatikan Sebelum Mengajukan Komplain:</p>
            <p className="mt-1 text-muted-foreground/80 font-semibold">
              Pengajuan komplain sengketa akan menahan dana escrow di platform Sotto. Kami sangat menyarankan agar Anda menghubungi penjual via chat terlebih dahulu sebelum memulai proses mediasi formal ini.
            </p>
          </div>
        </div>

        {/* Input: Reason Select */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
            Alasan Komplain Utama <span className="text-destructive font-black">*</span>
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="w-full bg-accent/40 text-foreground border border-border/80 rounded-lg px-3.5 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-destructive/30 focus:border-destructive transition duration-200 shadow-inner cursor-pointer"
          >
            <option value="" disabled className="bg-card text-muted-foreground">-- Pilih Alasan Utama --</option>
            <option value="Hasil kerja tidak sesuai deskripsi" className="bg-card text-foreground">Hasil kerja tidak sesuai deskripsi</option>
            <option value="Keterlambatan waktu penyerahan" className="bg-card text-foreground">Keterlambatan waktu penyerahan</option>
            <option value="Penjual tidak merespon chat komunikasi" className="bg-card text-foreground">Penjual tidak merespon chat komunikasi</option>
            <option value="Kualitas pekerjaan sangat buruk" className="bg-card text-foreground">Kualitas pekerjaan sangat buruk</option>
            <option value="Lainnya" className="bg-card text-foreground">Lainnya (Tuliskan detail di bawah)</option>
          </select>
        </div>

        {/* Input: Notes Textarea */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
            Catatan Masalah & Bukti Tambahan (Opsional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Jelaskan kendala Anda secara mendalam agar admin/penjual dapat memahami permasalahannya..."
            rows={4}
            className="w-full bg-accent/40 text-foreground border border-border/80 rounded-lg px-3.5 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-destructive/30 focus:border-destructive transition duration-200 shadow-inner placeholder:text-muted-foreground/40 resize-none leading-relaxed"
          />
        </div>
      </form>
    </Dialog>
  );
}
