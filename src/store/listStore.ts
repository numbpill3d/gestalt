import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ListState { items: string[]; add: (label: string) => void; remove: (index: number) => void; }

export const useListStore = create<ListState>()(
  persist(
    (set) => ({
      items: ["Things worth keeping", "Ideas in progress", "Good places to return to"],
      add: (label) => set((state) => ({ items: [...state.items, label] })),
      remove: (index) => set((state) => ({ items: state.items.filter((_, itemIndex) => itemIndex !== index) })),
    }),
    { name: "nova-exe-list" }
  )
);
