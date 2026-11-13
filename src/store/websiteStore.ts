import { create } from "zustand";
import { persist } from "zustand/middleware";
import { gestaltStorage } from "@/store/persistStorage";

interface WebsiteState { url: string; setUrl: (url: string) => void; }

export const useWebsiteStore = create<WebsiteState>()(
  persist(
    (set) => ({ url: "https://neocities.org", setUrl: (url) => set({ url }) }),
    { name: "gestalt-website", storage: gestaltStorage("website") }
  )
);
