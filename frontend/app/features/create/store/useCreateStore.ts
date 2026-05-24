import { create } from 'zustand';

export type CreateType = "portfolio" | "penawaran" | "pengalaman" | null;

export interface TagObject {
  id: string;
  name: string;
}

export interface CreateState {
  selectedType: CreateType;
  step: number;
  
  // Post/Portfolio state
  postContent: string;
  postFiles: File[];
  postTags: TagObject[];
  
  // Listing/Penawaran state
  listingData: {
    title: string;
    description: string;
    price: number;
    type: 'SERVICE' | 'DIGITAL_PRODUCT';
    isUnlimited: boolean;
    deliveryTimeDays: number;
  };
  listingFiles: File[];

  // Actions
  setSelectedType: (type: CreateType) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  setPostContent: (content: string) => void;
  setPostFiles: (files: File[]) => void;
  addPostTag: (tag: TagObject) => void;
  removePostTag: (tagId: string) => void;
  
  updateListingData: (data: Partial<CreateState['listingData']>) => void;
  setListingFiles: (files: File[]) => void;
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
  
  postContent: "",
  postFiles: [],
  postTags: [],
  
  listingData: { ...initialListingData },
  listingFiles: [],

  setSelectedType: (type) => set({ selectedType: type, step: 1 }),
  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
  
  setPostContent: (postContent) => set({ postContent }),
  setPostFiles: (postFiles) => set({ postFiles }),
  addPostTag: (tag) => set((state) => {
    if (state.postTags.some(t => t.id === tag.id)) return state;
    return { postTags: [...state.postTags, tag] };
  }),
  removePostTag: (tagId) => set((state) => ({ postTags: state.postTags.filter(t => t.id !== tagId) })),
  
  updateListingData: (data) => set((state) => ({ 
    listingData: { ...state.listingData, ...data } 
  })),
  setListingFiles: (listingFiles) => set({ listingFiles }),
  
  reset: () => set({
    selectedType: null,
    step: 1,
    postContent: "",
    postFiles: [],
    postTags: [],
    listingData: { ...initialListingData },
    listingFiles: [],
  })
}));
