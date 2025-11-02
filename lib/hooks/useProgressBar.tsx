import { create } from "zustand";

type ProgressState = {
  progress: number;
  loading: boolean;
  start: () => void;
  complete: () => void;
  reset: () => void;
  setProgress: (value: number) => void;
};

let intervalId: NodeJS.Timeout | null = null;

export const useProgressStore = create<ProgressState>((set) => ({
  progress: 0,
  loading: false,

  start: () => {
    // Clear any existing intervals
    if (intervalId) clearInterval(intervalId);

    set({ loading: true, progress: 0 });

    // Smoothly increase progress up to 85%
    intervalId = setInterval(() => {
      set((state) => {
        const next = Math.min(state.progress + Math.random() * 5, 85); // slow smooth increment
        return { progress: next };
      });
    }, 100); // every 0.2s
  },

  complete: () => {
    if (intervalId) clearInterval(intervalId);

    // Jump to 100% quickly
    set({ progress: 100 });

    // Hide after a short delay
    setTimeout(() => {
      set({ loading: false});
    }, 200);
    setTimeout(() => {
      set({ progress: 0});
    }, 400);
  },

  reset: () => {
    if (intervalId) clearInterval(intervalId);
    set({ loading: false, progress: 0 });
  },

  setProgress: (value: number) => set({ progress: value }),
}));
