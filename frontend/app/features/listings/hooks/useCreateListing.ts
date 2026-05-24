import { useState } from "react";
import { useNavigate } from "react-router";
import { useUpload } from "~/core/hooks/useUpload";
import { useToastStore } from "~/core/store/useToastStore";
import { useCreateListingMutation } from "~/core/apollo/generated";
import type { CreateState } from "../../create/store/useCreateStore";

export function useCreateListingLogic(resetStore: () => void) {
  const navigate = useNavigate();
  const { uploadFile } = useUpload();
  const addToast = useToastStore(s => s.addToast);
  
  const [createListing, { loading: isCreatingListing }] = useCreateListingMutation();
  const [isUploading, setIsUploading] = useState(false);
  
  const submitListing = async (
    listingData: CreateState['listingData'], 
    files: File[]
  ) => {
    try {
      setIsUploading(true);
      const mediaIds: string[] = [];
      
      for (const file of files) {
        // According to backend Bruno spec, attachedType is likely 'ScyllaListing' or 'Listing'
        const result = await uploadFile(file, 'Listing');
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
        },
        refetchQueries: ['GetListings', 'GetListingsByAccount']
      });

      addToast('success', 'Penawaran berhasil dibuat');
      resetStore();
      navigate('/profile'); // Redirect to profile after creating listing
    } catch (error: any) {
      addToast('error', error.message || 'Gagal membuat penawaran');
    } finally {
      setIsUploading(false);
    }
  };

  return {
    submitListing,
    isSubmitting: isCreatingListing || isUploading
  };
}
