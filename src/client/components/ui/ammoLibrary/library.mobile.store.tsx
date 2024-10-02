import { create } from 'zustand';

export const useLibraryMobileState = create<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}>()((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen: isOpen })
}));
