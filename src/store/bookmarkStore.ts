import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  createdAt?: number;
}

export type BookmarkView = "list" | "grid" | "compact";
export type BookmarkSort = "manual" | "title" | "domain" | "recent";

interface BookmarkState {
  bookmarks: Bookmark[];
  view: BookmarkView;
  sort: BookmarkSort;
  showFavicons: boolean;
  addBookmark: (title: string, url: string) => void;
  removeBookmark: (id: string) => void;
  setView: (view: BookmarkView) => void;
  setSort: (sort: BookmarkSort) => void;
  setShowFavicons: (showFavicons: boolean) => void;
  importBookmarks: (bookmarks: Bookmark[]) => void;
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
      sort: "manual",
      showFavicons: true,
      addBookmark: (title, url) =>
        set((state) => ({
          bookmarks: [
            ...state.bookmarks,
            { id: crypto.randomUUID(), title, url, createdAt: Date.now() },
          ],
        })),
      removeBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        })),
      setView: (view) => set({ view }),
      setSort: (sort) => set({ sort }),
      setShowFavicons: (showFavicons) => set({ showFavicons }),
      importBookmarks: (bookmarks) =>
        set((state) => {
          const existingUrls = new Set(state.bookmarks.map((bookmark) => bookmark.url));
          const additions = bookmarks.filter((bookmark) => !existingUrls.has(bookmark.url));
          return { bookmarks: [...state.bookmarks, ...additions] };
        }),
    }),
    { name: "nova-exe-bookmarks" }
  )
);
