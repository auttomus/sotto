import { useState, useRef } from "react";
import { useCreateStore } from "~/features/create/store/useCreateStore";
import { FolderUp, Link2, Package, UploadCloud, AlertCircle, Check } from "lucide-react";

export function ListingDigitalProductStep() {
  const { listingData, updateListingData } = useCreateStore();
  const [activeTab, setActiveTab] = useState<"file" | "link">(
    listingData.digitalFile ? "file" : "link"
  );
  const [linkError, setLinkError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Link Validation Function
  const validateLink = (url: string) => {
    if (!url.trim()) {
      setLinkError(null);
      return;
    }
    
    // Regular expression to validate standard URL format
    const urlPattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    if (!urlPattern.test(url)) {
      setLinkError("Format link tidak valid. Pastikan diawali dengan http:// atau https://");
    } else {
      setLinkError(null);
    }
  };

  const handleLinkChange = (val: string) => {
    updateListingData({ digitalLink: val });
    validateLink(val);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      updateListingData({ digitalFile: e.target.files[0], digitalLink: "" });
    }
  };

  const removeFile = () => {
    updateListingData({ digitalFile: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Drag and Drop helpers
  const [isDragOver, setIsDragOver] = useState(false);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      updateListingData({ digitalFile: e.dataTransfer.files[0], digitalLink: "" });
    }
  };

  const isGoogleDrive = listingData.digitalLink.toLowerCase().includes("drive.google.com") || 
                        listingData.digitalLink.toLowerCase().includes("docs.google.com");
  
  const isDropbox = listingData.digitalLink.toLowerCase().includes("dropbox.com");

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Unggah Produk Digital</h2>
        <p className="text-sm text-muted-foreground">
          Pilih metode pengiriman produk digital Anda kepada pembeli setelah pembayaran sukses.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-muted p-1 rounded-sm border border-border">
        <button
          type="button"
          onClick={() => {
            setActiveTab("file");
            updateListingData({ digitalLink: "" });
          }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "file"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FolderUp className="h-4 w-4" />
          Unggah Berkas/Media
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("link");
            updateListingData({ digitalFile: null });
          }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "link"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Link2 className="h-4 w-4" />
          Tautan/Link Eksternal
        </button>
      </div>

      <div className="pt-2 min-h-[220px]">
        {activeTab === "file" ? (
          <div className="space-y-4">
            {listingData.digitalFile ? (
              // Premium Glassmorphism File Preview Card
              <div className="flex items-center justify-between p-5 border border-primary/20 bg-primary/5 rounded-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center text-primary">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground line-clamp-1 text-sm max-w-[280px]">
                      {listingData.digitalFile.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {(listingData.digitalFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="w-8 h-8 rounded-full border border-border bg-background hover:bg-red-500 hover:text-white hover:border-red-500 flex items-center justify-center transition-all cursor-pointer shadow-sm text-xs font-bold"
                  title="Hapus berkas"
                >
                  ✕
                </button>
              </div>
            ) : (
              // Drag and Drop Area
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragOver
                    ? "border-primary bg-primary/5 scale-[0.99]"
                    : "border-border hover:border-primary/60 hover:bg-muted/30"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <UploadCloud className="h-7 w-7" />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">
                    Tarik berkas ke sini atau <span className="text-primary hover:underline">Pilih File</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Mendukung semua format berkas (ZIP, PDF, RAR, PNG, EXE, dll) hingga 100MB
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="form-label mb-1.5 block">Tautan Unduhan/Akses Produk</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Link2 className="h-4 w-4" />
                </span>
                <input
                  type="url"
                  value={listingData.digitalLink}
                  onChange={(e) => handleLinkChange(e.target.value)}
                  placeholder="https://drive.google.com/file/d/... atau tautan lainnya"
                  className={`form-input w-full p-3.5 pl-11 text-sm font-medium ${
                    linkError ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                />
              </div>
              
              {/* Error display */}
              {linkError && (
                <p className="text-xs text-red-500 mt-2 font-medium flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {linkError}
                </p>
              )}

              {/* Dynamic verified badges */}
              {!linkError && listingData.digitalLink.trim() && (
                <div className="mt-3.5 animate-in fade-in duration-300">
                  {isGoogleDrive ? (
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                      <Check className="h-3.5 w-3.5" />
                      Tautan Google Drive Terdeteksi & Valid
                    </div>
                  ) : isDropbox ? (
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      <Check className="h-3.5 w-3.5" />
                      Tautan Dropbox Terdeteksi & Valid
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                      <Check className="h-3.5 w-3.5" />
                      Tautan Eksternal Valid
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-muted/40 border border-border rounded-sm text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground block mb-1">Tips Keamanan Link:</strong>
              Pastikan pengaturan akses file di cloud storage Anda (seperti Google Drive) telah diset ke 
              <span className="text-foreground font-semibold"> "Siapa saja yang memiliki link" (Anyone with the link)</span> agar pembeli dapat langsung membukanya setelah melakukan pembayaran.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
