"use client";
import { create } from "zustand";

interface CartSheetState {
  open: boolean;
  openSheet: () => void;
  closeSheet: () => void;
}

export const useCartSheet = create<CartSheetState>((set) => ({
  open: false,
  openSheet: () => set({ open: true }),
  closeSheet: () => set({ open: false }),
}));
