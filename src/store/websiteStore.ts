import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WebsiteState { url: string; setUrl: (url: string) => void; }

export const useWebsiteStore = create<WebsiteState>()(
  persist(
    (set) => ({ url: "https://neocities.org", setUrl: (url) => set({ url }) }),
    { name: "nova-exe-website" }
  )
);
