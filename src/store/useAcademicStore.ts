import { AcademicStore } from "@/types/academic";
import { create } from "zustand";

export const useAcademicStore = create<AcademicStore>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}));
