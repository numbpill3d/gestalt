import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NotesState {
  content: string;
  setContent: (content: string) => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      content:
        "Keep this space for ideas, links to revisit, or the one thing you do not want to lose.",
      setContent: (content) => set({ content }),
    }),
    { name: "nova-exe-notes" }
  )
);
