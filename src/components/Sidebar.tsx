"use client";

import { useWidgetStore } from "@/store/widgetStore";

export function Sidebar({ onAddWidget, onSettings, onSearch }: { onAddWidget: () => void; onSettings: () => void; onSearch: () => void }) {
  const widgets = useWidgetStore((state) => state.widgets);

  function focusWidget(type: string) {
    const widget = widgets.find((item) => item.type === type);
    if (!widget) return;
    document.getElementById(`nova-window-${widget.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <aside className="nova-sidebar" aria-label="Workspace sidebar">
      <div className="sidebar-caption">PAGES</div>
      <button type="button" className="sidebar-item is-selected" onClick={() => window.scrollTo(0, 0)}><span className="sidebar-glyph">⌂</span><span>HOME</span></button>
      <button type="button" className="sidebar-item" onClick={() => focusWidget("bookmarks")}><span className="sidebar-glyph">▤</span><span>LINKS</span></button>
      <button type="button" className="sidebar-item" onClick={() => focusWidget("notes")}><span className="sidebar-glyph">▧</span><span>NOTES</span></button>
      <button type="button" className="sidebar-item" onClick={() => focusWidget("calendar")}><span className="sidebar-glyph">□</span><span>DATES</span></button>
      <div className="sidebar-rule" />
      <div className="sidebar-caption">TOOLS</div>
      <button type="button" className="sidebar-item" onClick={onAddWidget}><span className="sidebar-glyph">+</span><span>ADD</span></button>
      <button type="button" className="sidebar-item" onClick={onSearch}><span className="sidebar-glyph">?</span><span>FIND</span></button>
      <button type="button" className="sidebar-item" onClick={onSettings}><span className="sidebar-glyph">*</span><span>SETUP</span></button>
      <div className="sidebar-footer">NOVA<br />LOCAL</div>
    </aside>
  );
}
