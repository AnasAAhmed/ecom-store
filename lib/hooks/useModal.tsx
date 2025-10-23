import { create } from "zustand";

type ModalKey = string;

interface ModalStore {
  openModals: Record<ModalKey, boolean>;
  open: (key: ModalKey) => void;
  close: (key: ModalKey) => void;
  isOpen: (key: ModalKey) => boolean;
  closeAll: () => void;
}

export const useModalStore = create<ModalStore>((set, get) => ({
  openModals: {},

  open: (key) =>
    set((state) => ({
      openModals: { ...state.openModals, [key]: true },
    })),

  close: (key) =>
    set((state) => ({
      openModals: { ...state.openModals, [key]: false },
    })),

  isOpen: (key) => !!get().openModals[key],

  closeAll: () => set({ openModals: {} }),
}));
