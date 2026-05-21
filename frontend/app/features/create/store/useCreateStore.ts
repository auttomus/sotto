import { create } from 'zustand';

export type CreateType = "portfolio" | "penawaran" | "pengalaman" | null;

interface CreateState {
  // Common state
  selectedType: CreateType;
  step: number;
  
  // Post/Portfolio state
  content: string;
  files: File[];
  tags: string[];
  
  // Listing/Penawaran state
  listingData: {
    title: string;
    description: string;
    price: number;
    type: 'SERVICE' | 'DIGITAL_PRODUCT';
    isUnlimited: boolean;
    deliveryTimeDays: number;
  };

  // Actions
  setSelectedType: (type: CreateType) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  setContent: (content: string) => void;
  setFiles: (files: File[]) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  
  updateListingData: (data: Partial<CreateState['listingData']>) => void;
  reset: () => void;
}

const initialListingData = {
  title: "",
  description: "",
  price: 0,
  type: 'SERVICE' as const,
  isUnlimited: false,
  deliveryTimeDays: 1,
};

export const useCreateStore = create<CreateState>((set) => ({
  selectedType: null,
  step: 1,
  
  content: "",
  files: [],
  tags: [],
  
  listingData: { ...initialListingData },

  setSelectedType: (type) => set({ selectedType: type, step: 1 }),
  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
  
  setContent: (content) => set({ content }),
  setFiles: (files) => set({ files }),
  addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
  removeTag: (tag) => set((state) => ({ tags: state.tags.filter(t => t !== tag) })),
  
  updateListingData: (data) => set((state) => ({ 
    listingData: { ...state.listingData, ...data } 
  })),
  
  reset: () => set({
    selectedType: null,
    step: 1,
    content: "",
    files: [],
    tags: [],
    listingData: { ...initialListingData },
  })
}));
