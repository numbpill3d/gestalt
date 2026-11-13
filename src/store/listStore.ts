import { create } from "zustand";
import { persist } from "zustand/middleware";
import { gestaltStorage } from "@/store/persistStorage";

interface ListState { items: string[]; add: (label: string) => void; remove: (index: number) => void; }

export const useListStore = create<ListState>()(
  persist(
    (set) => ({
      items: ["Things worth keeping", "Ideas in progress", "Good places to return to"],
      add: (label) => set((state) => ({ items: [...state.items, label] })),
      remove: (index) => set((state) => ({ items: state.items.filter((_, itemIndex) => itemIndex !== index) })),
    }),
    { name: "gestalt-list", storage: gestaltStorage("list") }
  )
);
