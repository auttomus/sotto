import * as React from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/Button";
import { useCreateStore } from "../../../create/store/useCreateStore";
import { useToastStore } from "~/core/store/useToastStore";
import { ListingBasicStep } from "./ListingBasicStep";
import { ListingPricingStep } from "./ListingPricingStep";
import { ListingMediaStep } from "./ListingMediaStep";
import { useCreateListingLogic } from "../../hooks/useCreateListing";

export function ListingWizard() {
  const { 
    step,
    nextStep,
    prevStep,
    listingData, 
    listingFiles: files,
    setListingFiles: setFiles,
    setSelectedType,
    reset
  } = useCreateStore();
  
  const addToast = useToastStore(s => s.addToast);
  const [showDraftDialog, setShowDraftDialog] = React.useState(false);
  const { submitListing, isSubmitting } = useCreateListingLogic(reset);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (files.length + newFiles.length > 5) {
        addToast('error', 'Maksimal 5 file diperbolehkan');
        return;
      }
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleBack = () => {
    if (step > 1) {
      prevStep();
    } else {
      const hasContent = listingData.title.trim().length > 0 || listingData.description.trim().length > 0 || files.length > 0;
      if (hasContent) {
        setShowDraftDialog(true);
      } else {
        setSelectedType(null);
      }
    }
  };

  const handleDiscard = () => {
    reset();
    setSelectedType(null);
  };

  const handleSaveDraft = () => {
    setSelectedType(null);
    addToast('success', 'Disimpan sebagai draft');
  };

  const isStep1Valid = listingData.title.trim().length > 0 && listingData.description.trim().length > 0;
  const isStep2Valid = listingData.price > 0 && (listingData.type === 'DIGITAL_PRODUCT' || listingData.deliveryTimeDays > 0);

  return (
    <div className="flex flex-col min-h-screen bg-background w-full max-w-lg mx-auto border-x border-border relative">
      {showDraftDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowDraftDialog(false)}>
          <div className="bg-card rounded-md border border-border shadow-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-foreground mb-2">Simpan sebagai Draft?</h3>
            <p className="text-sm text-muted-foreground mb-6">Kamu memiliki perubahan yang belum disimpan. Ingin menyimpannya untuk dilanjutkan nanti?</p>
            <div className="flex flex-col gap-2">
              <Button variant="primary" onClick={handleSaveDraft} className="w-full">Simpan sebagai Draft</Button>
              <Button variant="danger" onClick={handleDiscard} className="w-full">Hapus dan Keluar</Button>
              <Button variant="ghost" onClick={() => setShowDraftDialog(false)} className="w-full mt-2">Batal</Button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-card/85 backdrop-blur-md border-b border-border px-4 h-14 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-muted transition cursor-pointer">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex flex-col">
            <h1 className="font-bold text-foreground text-sm leading-tight">Buat Penawaran</h1>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Langkah {step} dari 3</span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-muted h-1">
        <div 
          className="bg-primary h-full transition-all duration-300 ease-out" 
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <div className="p-4 md:p-6 overflow-y-auto pb-24">
        {step === 1 && <ListingBasicStep />}
        {step === 2 && <ListingPricingStep />}
        {step === 3 && <ListingMediaStep handleFileSelect={handleFileSelect} removeFile={removeFile} />}
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-card/85 backdrop-blur-md border-t border-border p-4 pb-safe z-10">
        {step === 1 && (
          <Button 
            variant="primary" 
            className="w-full h-12 text-base font-bold rounded-md shadow-lg shadow-primary/20"
            onClick={nextStep}
            disabled={!isStep1Valid}
          >
            Selanjutnya <ArrowRight className="h-5 w-5 ml-1" />
          </Button>
        )}
        
        {step === 2 && (
          <Button 
            variant="primary" 
            className="w-full h-12 text-base font-bold rounded-md shadow-lg shadow-primary/20"
            onClick={nextStep}
            disabled={!isStep2Valid}
          >
            Selanjutnya <ArrowRight className="h-5 w-5 ml-1" />
          </Button>
        )}
        
        {step === 3 && (
          <Button 
            variant="primary" 
            className="w-full h-12 text-base font-bold rounded-md shadow-lg shadow-primary/20"
            onClick={() => submitListing(listingData, files)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Mengunggah...</span>
            ) : (
              "Terbitkan Penawaran"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
