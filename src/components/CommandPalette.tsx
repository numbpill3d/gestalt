"use client";

import { useMemo, useState } from "react";
import { useBookmarkStore } from "@/store/bookmarkStore";

interface CommandPaletteProps {
  onClose: () => void;
  onSettings: () => void;
  onAddWidget: () => void;
}

export function CommandPalette({ onClose, onSettings, onAddWidget }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const bookmarks = useBookmarkStore((state) => state.bookmarks);
  const results = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    return normalized ? bookmarks.filter((bookmark) => `${bookmark.title} ${bookmark.url}`.toLowerCase().includes(normalized)) : bookmarks.slice(0, 4);
  }, [bookmarks, query]);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="command-panel" role="dialog" aria-modal="true" aria-labelledby="command-title">
        <div className="command-search-row"><span className="command-mark">⌕</span><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bookmarks or type a command" aria-label="Search workspace" /><kbd>ESC</kbd></div>
        <div className="command-section"><div className="command-label" id="command-title">Quick actions</div><div className="command-actions"><button type="button" onClick={onSettings}><span>Settings</span><small>Customize GESTALT</small></button><button type="button" onClick={onAddWidget}><span>Add widget</span><small>Open the widget shelf</small></button></div></div>
        <div className="command-section"><div className="command-label">Bookmarks</div>{results.length ? <div className="command-results">{results.map((bookmark) => <a key={bookmark.id} href={bookmark.url} target="_blank" rel="noopener noreferrer" onClick={onClose}><span>{bookmark.title}</span><small>{bookmark.url.replace(/^https?:\/\//, "")}</small></a>)}</div> : <p className="command-empty">No matching bookmarks.</p>}</div>
      </section>
    </div>
  );
}
