import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Bookmark {
  id: string;
  title: string;
  url: string;
}

export type BookmarkView = "list" | "grid" | "compact";

interface BookmarkState {
  bookmarks: Bookmark[];
  view: BookmarkView;
  showFavicons: boolean;
  addBookmark: (title: string, url: string) => void;
  removeBookmark: (id: string) => void;
  setView: (view: BookmarkView) => void;
  setShowFavicons: (showFavicons: boolean) => void;
}

function faviconFor(url: string): string {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
  } catch {
    return "";
  }
}

export function faviconForUrl(url: string): string {
  return faviconFor(url);
}

const defaultBookmarks: Bookmark[] = [
  { id: "1", title: "Neocities", url: "https://neocities.org" },
  { id: "2", title: "Hacker News", url: "https://news.ycombinator.com" },
  { id: "3", title: "Are.na", url: "https://www.are.na" },
];

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set) => ({
      bookmarks: defaultBookmarks,
      view: "list",
      showFavicons: true,
      addBookmark: (title, url) =>
        set((state) => ({
          bookmarks: [
            ...state.bookmarks,
            { id: crypto.randomUUID(), title, url },
          ],
        })),
      removeBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        })),
      setView: (view) => set({ view }),
      setShowFavicons: (showFavicons) => set({ showFavicons }),
    }),
    { name: "nova-exe-bookmarks" }
  )
);
