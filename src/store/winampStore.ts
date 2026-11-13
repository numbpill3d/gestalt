import { create } from "zustand";
import { persist } from "zustand/middleware";
import { gestaltStorage } from "@/store/persistStorage";

interface WinampState {
  skinName: string;
  skinDataUrl: string | null;
  setSkin: (skinName: string, skinDataUrl: string) => void;
  clearSkin: () => void;
}

export const useWinampStore = create<WinampState>()(
  persist(
    (set) => ({
      skinName: "Classic Gestalt",
      skinDataUrl: null,
      setSkin: (skinName, skinDataUrl) => set({ skinName, skinDataUrl }),
      clearSkin: () => set({ skinName: "Classic Gestalt", skinDataUrl: null }),
    }),
    { name: "gestalt-winamp", storage: gestaltStorage("winamp") }
  )
);
