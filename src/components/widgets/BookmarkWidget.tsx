"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useBookmarkStore, faviconForUrl, type Bookmark, type BookmarkSort, type BookmarkView } from "@/store/bookmarkStore";

function normalizeUrl(value: string): string | null {
  if (/^[a-z][a-z\d+.-]*:/i.test(value) && !/^https?:\/\//i.test(value)) {
    return null;
  }
  try {
    const candidate = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return candidate.protocol === "http:" || candidate.protocol === "https:"
      ? candidate.toString()
      : null;
  } catch {
    return null;
  }
}

export function BookmarkWidget() {
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const addBookmark = useBookmarkStore((s) => s.addBookmark);
  const removeBookmark = useBookmarkStore((s) => s.removeBookmark);
  const view = useBookmarkStore((s) => s.view);
  const sort = useBookmarkStore((s) => s.sort);
  const showFavicons = useBookmarkStore((s) => s.showFavicons);
  const setView = useBookmarkStore((s) => s.setView);
  const setSort = useBookmarkStore((s) => s.setSort);
  const setShowFavicons = useBookmarkStore((s) => s.setShowFavicons);
  const importBookmarks = useBookmarkStore((s) => s.importBookmarks);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [importStatus, setImportStatus] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sortedBookmarks = useMemo(() => [...bookmarks].sort((a, b) => {
    if (sort === "title") return a.title.localeCompare(b.title);
    if (sort === "domain") return new URL(a.url).hostname.localeCompare(new URL(b.url).hostname);
    if (sort === "recent") return (b.createdAt ?? 0) - (a.createdAt ?? 0);
    return 0;
  }), [bookmarks, sort]);

  function parseImportedBookmarks(text: string, fileName: string): Bookmark[] {
    if (/\.html?$/i.test(fileName) || text.trim().startsWith("<!DOCTYPE")) {
      const document = new DOMParser().parseFromString(text, "text/html");
      return Array.from(document.querySelectorAll("a[href]")).flatMap((anchor) => {
        const normalized = normalizeUrl(anchor.getAttribute("href") ?? "");
        return normalized ? [{ id: crypto.randomUUID(), title: anchor.textContent?.trim() || normalized, url: normalized, createdAt: Date.now() }] : [];
      });
    }
    const value = JSON.parse(text) as unknown;
    const found: Bookmark[] = [];
    function collect(item: unknown) {
      if (Array.isArray(item)) return item.forEach(collect);
      if (!item || typeof item !== "object") return;
      const record = item as Record<string, unknown>;
      const candidateUrl = typeof record.url === "string" ? normalizeUrl(record.url) : null;
      if (candidateUrl) found.push({ id: crypto.randomUUID(), title: typeof record.title === "string" ? record.title : typeof record.name === "string" ? record.name : candidateUrl, url: candidateUrl, createdAt: Date.now() });
      if (record.children) collect(record.children);
      if (record.bookmarks) collect(record.bookmarks);
    }
    collect(value);
    return found;
  }

  async function onImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const imported = parseImportedBookmarks(await file.text(), file.name);
      importBookmarks(imported);
      setImportStatus(imported.length ? `Imported ${imported.length} link${imported.length === 1 ? "" : "s"}.` : "No web links found.");
    } catch {
      setImportStatus("Could not read that bookmark file.");
    }
  }

  function exportBookmarks() {
    const blob = new Blob([JSON.stringify(bookmarks, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "gestalt-bookmarks.json";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      setError("Add a title and URL first.");
      return;
    }
    const normalized = normalizeUrl(url.trim());
    if (!normalized) {
      setError("Use a valid HTTP or HTTPS URL.");
      return;
    }
    addBookmark(title.trim(), normalized);
    setTitle("");
    setUrl("");
    setError("");
  }

  return (
    <div
      className="flex flex-col gap-2 h-full text-sm"
      style={{ fontFamily: "var(--gestalt-font)" }}
    >
      <div className="bookmark-toolbar" aria-label="Bookmark display options">
        <span className="widget-kicker">Saved links</span>
        <div className="bookmark-view-controls" role="group" aria-label="Bookmark view">
          {(["list", "grid", "compact"] as BookmarkView[]).map((mode) => (
            <button key={mode} type="button" className={view === mode ? "is-active" : ""} onClick={() => setView(mode)} aria-label={`${mode} bookmark view`} aria-pressed={view === mode}>
              {mode === "list" ? "≡" : mode === "grid" ? "▦" : "="}
            </button>
          ))}
          <button type="button" className={showFavicons ? "is-active" : ""} onClick={() => setShowFavicons(!showFavicons)} aria-label="Toggle bookmark icons" aria-pressed={showFavicons}>ICO</button>
        </div>
      </div>
      <div className="bookmark-library-tools">
        <label>Sort <select value={sort} onChange={(event) => setSort(event.target.value as BookmarkSort)} aria-label="Sort bookmarks"><option value="manual">manual</option><option value="title">title</option><option value="domain">domain</option><option value="recent">recent</option></select></label>
        <div><button type="button" onClick={() => fileInputRef.current?.click()}>IMPORT BROWSER</button><button type="button" onClick={exportBookmarks}>EXPORT</button><input ref={fileInputRef} type="file" accept=".json,.html,.htm" onChange={onImport} hidden /></div>
      </div>
      {importStatus && <p className="bookmark-status" role="status">{importStatus}</p>}
      <ul className={`bookmark-list bookmark-view-${view} ${showFavicons ? "has-favicons" : "no-favicons"}`}>
        {sortedBookmarks.map((b) => (
          <li
            key={b.id}
            className="flex items-center gap-2 px-1.5 py-1 group border"
            style={{
              background: "var(--gestalt-surface-alt)",
              borderColor: "var(--gestalt-border)",
              borderRadius: "var(--gestalt-radius)",
            }}
          >
            {showFavicons && <Image src={faviconForUrl(b.url)} alt="" width={16} height={16} unoptimized className="bookmark-favicon" onError={(e) => { (e.target as HTMLImageElement).style.visibility = "hidden"; }} />}
            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate flex-1 hover:underline"
              style={{ color: "var(--gestalt-text)" }}
              title={b.url}
            >
              {b.title}
            </a>
            <button
              type="button"
              onClick={() => removeBookmark(b.id)}
              className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-xs px-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--gestalt-accent)]"
              style={{ color: "var(--gestalt-text-muted)" }}
              title="Remove"
              aria-label={`Remove ${b.title}`}
            >
              ✕
            </button>
          </li>
        ))}
        {bookmarks.length === 0 && (
          <li
            className="text-xs italic py-4 text-center"
            style={{ color: "var(--gestalt-text-muted)" }}
          >
            No bookmarks yet.
          </li>
        )}
      </ul>

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-1 border-t pt-2"
        style={{ borderColor: "var(--gestalt-border)" }}
      >
        <input
          aria-label="Bookmark title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="px-1.5 py-1 border text-xs"
          style={{
            borderColor: "var(--gestalt-border)",
            borderRadius: "var(--gestalt-radius)",
            background: "var(--gestalt-surface-alt)",
            color: "var(--gestalt-text)",
          }}
        />
        <input
          aria-label="Bookmark URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL"
          className="px-1.5 py-1 border text-xs"
          style={{
            borderColor: "var(--gestalt-border)",
            borderRadius: "var(--gestalt-radius)",
            background: "var(--gestalt-surface-alt)",
            color: "var(--gestalt-text)",
          }}
        />
        {error && (
          <p role="alert" className="text-xs" style={{ color: "var(--gestalt-text-muted)" }}>
            {error}
          </p>
        )}
        <button
          type="submit"
          className="px-1.5 py-1 text-xs font-bold border"
          style={{
            borderColor: "var(--gestalt-border)",
            borderRadius: "var(--gestalt-radius)",
            background: "var(--gestalt-accent)",
            color: "var(--gestalt-accent-text)",
          }}
        >
          Add Bookmark
        </button>
      </form>
    </div>
  );
}
