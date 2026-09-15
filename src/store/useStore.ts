import { create } from "zustand";
import { Role } from "../types";

interface UIState {
  role: Role;
  setRole: (role: Role) => void;
  currency: "INR" | "USD";
  setCurrency: (currency: "INR" | "USD") => void;
  savedPropertyIds: string[];
  toggleSaved: (id: string) => void;
  comparePropertyIds: string[];
  toggleCompare: (id: string) => void;
}

export const useStore = create<UIState>((set) => ({
  role: "BUYER",
  setRole: (role) => set({ role }),
  currency: "INR",
  setCurrency: (currency) => set({ currency }),
  savedPropertyIds: [],
  toggleSaved: (id) =>
    set((state) => ({
      savedPropertyIds: state.savedPropertyIds.includes(id)
        ? state.savedPropertyIds.filter((pid) => pid !== id)
        : [...state.savedPropertyIds, id],
    })),
  comparePropertyIds: [],
  toggleCompare: (id) =>
    set((state) => {
      if (state.comparePropertyIds.includes(id)) {
        return { comparePropertyIds: state.comparePropertyIds.filter((pid) => pid !== id) };
      }
      if (state.comparePropertyIds.length < 4) {
        return { comparePropertyIds: [...state.comparePropertyIds, id] };
      }
      return state;
    }),
}));
