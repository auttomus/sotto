import * as React from "react";
import { AlertCircle } from "lucide-react";
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
          <div className="p-2 rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-foreground text-sm tracking-tight">Ajukan Komplain Sengketa</h3>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Langkah Mediasi Escrow</p>
          </div>
        </div>
      }
      footer={
        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 font-bold text-xs py-2.5 rounded-sm border border-border text-foreground hover:bg-muted transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={!reason}
            onClick={handleSubmit}
            className="flex-1 font-bold text-xs py-2.5 rounded-sm bg-destructive hover:bg-destructive/90 text-destructive-foreground border-0 shadow-md shadow-destructive/25 active:scale-[0.99] transition cursor-pointer disabled:opacity-50"
          >
            Ajukan Komplain Resmi
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
            Alasan Komplain Utama <span className="text-destructive">*</span>
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="w-full bg-background text-foreground border border-border rounded-sm px-3 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
          >
            <option value="" disabled>-- Pilih Alasan Utama --</option>
            <option value="Hasil kerja tidak sesuai deskripsi">Hasil kerja tidak sesuai deskripsi</option>
            <option value="Keterlambatan waktu penyerahan">Keterlambatan waktu penyerahan</option>
            <option value="Penjual tidak merespon chat komunikasi">Penjual tidak merespon chat komunikasi</option>
            <option value="Kualitas pekerjaan sangat buruk">Kualitas pekerjaan sangat buruk</option>
            <option value="Lainnya">Lainnya (Tuliskan detail di bawah)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
            Catatan Masalah & Bukti Tambahan (Opsional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Jelaskan kendala Anda secara mendalam agar admin/penjual dapat memahami permasalahannya..."
            rows={4}
            className="w-full bg-background text-foreground border border-border rounded-sm px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition resize-none placeholder:text-muted-foreground/50"
          />
        </div>
      </form>
    </Dialog>
  );
}
