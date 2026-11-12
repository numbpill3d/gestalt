"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@/components/Canvas";
import { CommandPalette } from "@/components/CommandPalette";
import { SettingsPanel } from "@/components/SettingsPanel";
import { useWidgetStore, type WidgetType } from "@/store/widgetStore";
import { useThemeStore } from "@/store/themeStore";
import { getThemeById } from "@/themes";

const widgetOptions: Array<{ type: WidgetType; title: string; description: string }> = [
  { type: "bookmarks", title: "Bookmarks", description: "Your links, close at hand." },
  { type: "notes", title: "Scratchpad", description: "A private place for loose thoughts." },
  { type: "clock", title: "Local time", description: "A small time and status tile." },
  { type: "calendar", title: "Calendar", description: "A lightweight month view." },
  { type: "website", title: "Web view", description: "Keep a site inside your workspace." },
  { type: "todo", title: "To-do list", description: "Small tasks with satisfying checks." },
  { type: "list", title: "Plain list", description: "A flexible list for anything." },
];

export function DesktopShell() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [widgetShelfOpen, setWidgetShelfOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const widgets = useWidgetStore((state) => state.widgets);
  const addWidget = useWidgetStore((state) => state.addWidget);
  const themeId = useThemeStore((state) => state.themeId);
  const showWelcome = useThemeStore((state) => state.showWelcome);
  const theme = getThemeById(themeId);
  const activeCount = widgets.length;
  const availableWidgets = useMemo(() => widgetOptions.filter((option) => !widgets.some((widget) => widget.type === option.type)), [widgets]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if ((event.metaKey || event.ctrlKey) && event.key === ",") {
        event.preventDefault();
        setSettingsOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setSettingsOpen(false);
        setWidgetShelfOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function addFromShelf(type: WidgetType) {
    const offset = widgets.length * 24;
    addWidget({ id: `${type}-1`, type, title: widgetOptions.find((item) => item.type === type)?.title ?? type, x: 80 + offset, y: 180 + offset, w: type === "bookmarks" ? 360 : type === "website" ? 460 : 320, h: type === "clock" || type === "calendar" ? 260 : type === "website" ? 360 : 300, minimized: false });
    setWidgetShelfOpen(false);
  }

  return (
    <main className={`nova-desktop ${focusMode ? "is-focus-mode" : ""}`}>
      <div className="nova-atmosphere" aria-hidden="true" />
      <header className="nova-header">
        <div className="brand-lockup"><div className="brand-mark">N</div><div><div className="brand-name">NOVA.EXE</div><div className="brand-subtitle">LOCAL USER NODE</div></div></div>
        <nav className="mac-menu-items" aria-label="Application menu"><button type="button">File</button><button type="button">Edit</button><button type="button">View</button><button type="button">Windows</button><button type="button">Special</button><button type="button">Help</button></nav>
        <div className="header-center"><span className="live-indicator" />{theme.name}<span className="header-divider" />{activeCount} {activeCount === 1 ? "window" : "windows"}</div>
        <nav className="header-actions" aria-label="Workspace actions"><button type="button" className="header-action" onClick={() => setSearchOpen(true)}><span>Search</span><kbd>⌘ K</kbd></button><button type="button" className="header-action" onClick={() => setSettingsOpen(true)}>Settings</button></nav>
      </header>

      {!focusMode && showWelcome && <section className="workspace-intro"><div className="welcome-titlebar"><span>Welcome to NOVA.EXE</span><span className="welcome-titlebar-box" aria-hidden="true" /></div><div className="welcome-content"><div className="eyebrow">WELCOME TO NOVA BBS</div><h1>NOVA.EXE<br /><em>READY.</em></h1><p>A monochrome desktop for bookmarks, notes, lists, and whatever you are building next.</p><div className="intro-actions"><button type="button" className="primary-button" onClick={() => setWidgetShelfOpen(true)}>Open widget shelf <span>+</span></button><button type="button" className="quiet-button" onClick={() => setFocusMode(true)}>Focus mode</button></div></div></section>}

      <Canvas />

      <footer className="nova-dock" aria-label="Workspace dock"><div className="dock-group"><button type="button" className="dock-button is-active" onClick={() => setFocusMode(false)}><span className="dock-glyph">⌂</span><span>Workspace</span></button><button type="button" className="dock-button" onClick={() => setWidgetShelfOpen(true)}><span className="dock-glyph">+</span><span>Widgets</span></button></div><div className="dock-hint"><span className="status-dot" /> Local workspace</div><div className="dock-group"><button type="button" className="dock-button" onClick={() => setFocusMode(!focusMode)}><span className="dock-glyph">{focusMode ? "□" : "◧"}</span><span>{focusMode ? "Exit focus" : "Focus"}</span></button><button type="button" className="dock-button" onClick={() => setSettingsOpen(true)}><span className="dock-glyph">⚙</span><span>Settings</span></button></div></footer>

      {widgetShelfOpen && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setWidgetShelfOpen(false)}><section className="widget-shelf" role="dialog" aria-modal="true" aria-labelledby="widget-shelf-title"><div className="settings-header"><div><div className="eyebrow">Workspace shelf</div><h2 id="widget-shelf-title">Add something useful</h2><p>Widgets stay local and remember their place.</p></div><button type="button" className="icon-button" onClick={() => setWidgetShelfOpen(false)}>Close</button></div><div className="shelf-grid">{availableWidgets.length ? availableWidgets.map((option) => <button type="button" key={option.type} className="shelf-card" onClick={() => addFromShelf(option.type)}><span className="shelf-icon">+</span><span><strong>{option.title}</strong><small>{option.description}</small></span></button>) : <p className="command-empty">Everything in the shelf is already open.</p>}</div></section></div>}
      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
      {searchOpen && <CommandPalette onClose={() => setSearchOpen(false)} onSettings={() => { setSearchOpen(false); setSettingsOpen(true); }} onAddWidget={() => { setSearchOpen(false); setWidgetShelfOpen(true); }} />}
    </main>
  );
}
