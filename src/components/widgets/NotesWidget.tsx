"use client";

import { useNotesStore } from "@/store/notesStore";

export function NotesWidget() {
  const content = useNotesStore((state) => state.content);
  const setContent = useNotesStore((state) => state.setContent);

  return (
    <div className="widget-stack">
      <div className="widget-kicker">Local only</div>
      <textarea
        aria-label="Scratchpad note"
        className="notes-editor"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Write something down..."
      />
      <div className="widget-hint">Saved automatically in this browser.</div>
    </div>
  );
}
