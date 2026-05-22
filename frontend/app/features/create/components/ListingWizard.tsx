import * as React from "react";
import { ArrowLeft, ArrowRight, Loader2, Image as ImageIcon, X } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/Button";
import { useCreateStore } from "../store/useCreateStore";
import { useUpload } from "~/core/hooks/useUpload";
import { useToastStore } from "~/core/store/useToastStore";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { ListingBasicStep } from "./wizard-steps/ListingBasicStep";
import { ListingPricingStep } from "./wizard-steps/ListingPricingStep";
import { ListingMediaStep } from "./wizard-steps/ListingMediaStep";

const CREATE_LISTING_MUTATION = gql`
  mutation CreateListing($input: CreateListingInput!) {
    createListing(input: $input) {
      id
      title
    }
  }
`;

export function ListingWizard() {
  const navigate = useNavigate();
  const { 
    step,
    setStep,
    nextStep,
    prevStep,
    listingData, 
    updateListingData,
    files,
    setFiles,
    setSelectedType,
    reset
  } = useCreateStore();
  
  const { uploadFile } = useUpload();
  const addToast = useToastStore(s => s.addToast);
  const [createListing, { loading }] = useMutation(CREATE_LISTING_MUTATION);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
      setSelectedType(null);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsUploading(true);
      const mediaIds: string[] = [];
      
      for (const file of files) {
        const result = await uploadFile(file, 'LISTING');
        mediaIds.push(result.id);
      }

      await createListing({
        variables: {
          input: {
            title: listingData.title,
            description: listingData.description,
            basePrice: listingData.price,
            type: listingData.type,
            isUnlimited: listingData.isUnlimited,
            deliveryTimeDays: listingData.type === 'SERVICE' ? listingData.deliveryTimeDays : null,
            mediaIds: mediaIds.length > 0 ? mediaIds : undefined
          }
        }
      });

      addToast('success', 'Penawaran berhasil dibuat');
      reset();
      navigate('/profile'); // Redirect to profile after creating listing
    } catch (error: any) {
      addToast('error', error.message || 'Gagal membuat penawaran');
    } finally {
      setIsUploading(false);
    }
  };

  const isSubmitting = loading || isUploading;
  const isStep1Valid = listingData.title.trim().length > 0 && listingData.description.trim().length > 0;
  const isStep2Valid = listingData.price > 0 && (listingData.type === 'DIGITAL_PRODUCT' || listingData.deliveryTimeDays > 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 w-full max-w-lg mx-auto border-x border-gray-100 dark:border-gray-800 relative">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 h-14 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <div className="flex flex-col">
            <h1 className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-tight">Buat Penawaran</h1>
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Langkah {step} dari 3</span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-800 h-1">
        <div 
          className="bg-indigo-600 dark:bg-indigo-500 h-full transition-all duration-300 ease-out" 
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <div className="p-4 md:p-6 overflow-y-auto pb-24">
        {step === 1 && <ListingBasicStep />}
        {step === 2 && <ListingPricingStep />}
        {step === 3 && <ListingMediaStep handleFileSelect={handleFileSelect} removeFile={removeFile} />}
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 p-4 pb-safe z-10">
        {step === 1 && (
          <Button 
            variant="primary" 
            className="w-full h-12 text-base font-bold rounded-xl shadow-lg shadow-indigo-500/20"
            onClick={nextStep}
            disabled={!isStep1Valid}
          >
            Selanjutnya <ArrowRight className="h-5 w-5 ml-1" />
          </Button>
        )}
        
        {step === 2 && (
          <Button 
            variant="primary" 
            className="w-full h-12 text-base font-bold rounded-xl shadow-lg shadow-indigo-500/20"
            onClick={nextStep}
            disabled={!isStep2Valid}
          >
            Selanjutnya <ArrowRight className="h-5 w-5 ml-1" />
          </Button>
        )}
        
        {step === 3 && (
          <Button 
            variant="primary" 
            className="w-full h-12 text-base font-bold rounded-xl shadow-lg shadow-indigo-500/20"
            onClick={handleSubmit}
            disabled={isSubmitting || files.length === 0}
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
