"use client";

import { useState } from "react";
import Image from "next/image";
import { useBookmarkStore, faviconForUrl } from "@/store/bookmarkStore";

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

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

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
      style={{ fontFamily: "var(--nova-font)" }}
    >
      <ul className="flex flex-col gap-1 flex-1 overflow-auto">
        {bookmarks.map((b) => (
          <li
            key={b.id}
            className="flex items-center gap-2 px-1.5 py-1 group border"
            style={{
              background: "var(--nova-surface-alt)",
              borderColor: "var(--nova-border)",
              borderRadius: "var(--nova-radius)",
            }}
          >
            <Image
              src={faviconForUrl(b.url)}
              alt=""
              width={16}
              height={16}
              unoptimized
              className="w-4 h-4 shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).style.visibility = "hidden";
              }}
            />
            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate flex-1 hover:underline"
              style={{ color: "var(--nova-text)" }}
              title={b.url}
            >
              {b.title}
            </a>
            <button
              type="button"
              onClick={() => removeBookmark(b.id)}
              className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-xs px-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--nova-accent)]"
              style={{ color: "var(--nova-text-muted)" }}
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
            style={{ color: "var(--nova-text-muted)" }}
          >
            No bookmarks yet.
          </li>
        )}
      </ul>

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-1 border-t pt-2"
        style={{ borderColor: "var(--nova-border)" }}
      >
        <input
          aria-label="Bookmark title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="px-1.5 py-1 border text-xs"
          style={{
            borderColor: "var(--nova-border)",
            borderRadius: "var(--nova-radius)",
            background: "var(--nova-surface-alt)",
            color: "var(--nova-text)",
          }}
        />
        <input
          aria-label="Bookmark URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL"
          className="px-1.5 py-1 border text-xs"
          style={{
            borderColor: "var(--nova-border)",
            borderRadius: "var(--nova-radius)",
            background: "var(--nova-surface-alt)",
            color: "var(--nova-text)",
          }}
        />
        {error && (
          <p role="alert" className="text-xs" style={{ color: "var(--nova-text-muted)" }}>
            {error}
          </p>
        )}
        <button
          type="submit"
          className="px-1.5 py-1 text-xs font-bold border"
          style={{
            borderColor: "var(--nova-border)",
            borderRadius: "var(--nova-radius)",
            background: "var(--nova-accent)",
            color: "var(--nova-accent-text)",
          }}
        >
          Add Bookmark
        </button>
      </form>
    </div>
  );
}
