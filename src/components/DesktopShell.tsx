"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@/components/Canvas";
import { CommandPalette } from "@/components/CommandPalette";
import { SettingsPanel } from "@/components/SettingsPanel";
import { useWidgetStore, type WidgetType } from "@/store/widgetStore";
import { useThemeStore } from "@/store/themeStore";
import { getThemeById } from "@/themes";
import { Sidebar } from "@/components/Sidebar";
import { WidgetInspector } from "@/components/WidgetInspector";

const widgetOptions: Array<{ type: WidgetType; title: string; description: string }> = [
  { type: "bookmarks", title: "Bookmarks", description: "Your links, close at hand." },
  { type: "notes", title: "Scratchpad", description: "A private place for loose thoughts." },
  { type: "clock", title: "Local time", description: "A small time and status tile." },
  { type: "calendar", title: "Calendar", description: "A lightweight month view." },
  { type: "website", title: "Web view", description: "Keep a site inside your workspace." },
  { type: "todo", title: "To-do list", description: "Small tasks with satisfying checks." },
  { type: "list", title: "Plain list", description: "A flexible list for anything." },
  { type: "ascii", title: "ASCII art", description: "A rotating text-art signal from ASCIIArt.eu." },
];

export function DesktopShell() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [widgetShelfOpen, setWidgetShelfOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [customizeWidgetId, setCustomizeWidgetId] = useState<string | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const widgets = useWidgetStore((state) => state.widgets);
  const addWidget = useWidgetStore((state) => state.addWidget);
  const resetLayout = useWidgetStore((state) => state.resetLayout);
  const minimizeAll = useWidgetStore((state) => state.minimizeAll);
  const restoreAll = useWidgetStore((state) => state.restoreAll);
  const themeId = useThemeStore((state) => state.themeId);
  const showWelcome = useThemeStore((state) => state.showWelcome);
  const showGrid = useThemeStore((state) => state.showGrid);
  const setShowGrid = useThemeStore((state) => state.setShowGrid);
  const setShowWelcome = useThemeStore((state) => state.setShowWelcome);
  const resetAppearance = useThemeStore((state) => state.resetAppearance);
  const theme = getThemeById(themeId);
  const activeCount = widgets.length;

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
        setMenuOpen(null);
        setAboutOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function addFromShelf(type: WidgetType) {
    const offset = widgets.length * 24;
    addWidget({ id: `${type}-${crypto.randomUUID()}`, type, title: widgetOptions.find((item) => item.type === type)?.title ?? type, x: 170 + offset, y: 180 + offset, w: type === "bookmarks" ? 360 : type === "website" ? 460 : type === "clock" ? 360 : type === "ascii" ? 390 : 320, h: type === "clock" ? 240 : type === "calendar" ? 260 : type === "website" ? 360 : type === "ascii" ? 330 : 300, minimized: false });
    setWidgetShelfOpen(false);
  }

  function addBlankBox() {
    const offset = widgets.length * 24;
    addWidget({ id: `box-${crypto.randomUUID()}`, type: "list", title: "New box", x: 170 + offset, y: 150 + offset, w: 320, h: 240, minimized: false });
    setMenuOpen(null);
  }

  function runMenuAction(action: () => void) {
    action();
    setMenuOpen(null);
  }

  function menuItems(name: string): Array<{ label: string; action: () => void }> {
    if (name === "File") return [
      { label: "New widget...", action: () => setWidgetShelfOpen(true) },
      { label: "New blank box", action: addBlankBox },
      { label: "Open settings", action: () => setSettingsOpen(true) },
    ];
    if (name === "Edit") return [
      { label: "Reset window layout", action: resetLayout },
      { label: "Minimize all", action: minimizeAll },
      { label: "Restore all", action: restoreAll },
    ];
    if (name === "View") return [
      { label: showGrid ? "Hide canvas grid" : "Show canvas grid", action: () => setShowGrid(!showGrid) },
      { label: showWelcome ? "Hide welcome window" : "Show welcome window", action: () => setShowWelcome(!showWelcome) },
      { label: focusMode ? "Exit focus mode" : "Enter focus mode", action: () => setFocusMode(!focusMode) },
    ];
    if (name === "Windows") return [
      { label: "Widget shelf", action: () => setWidgetShelfOpen(true) },
      { label: "Settings", action: () => setSettingsOpen(true) },
      { label: "Reset appearance", action: resetAppearance },
    ];
    if (name === "Special") return [
      { label: "New blank box", action: addBlankBox },
      { label: "Restore all windows", action: restoreAll },
      { label: "Focus workspace", action: () => setFocusMode(true) },
    ];
    return [{ label: "About GESTALT", action: () => setAboutOpen(true) }, { label: "Open settings", action: () => setSettingsOpen(true) }];
  }

  return (
    <main className={`gestalt-desktop ${focusMode ? "is-focus-mode" : ""}`}>
      <div className="gestalt-atmosphere" aria-hidden="true" />
      <header className="gestalt-header">
        <div className="brand-lockup"><div className="brand-mark">G</div><div><div className="brand-name">GESTALT</div><div className="brand-subtitle">LOCAL USER NODE</div></div></div>
        <nav className="mac-menu-items" aria-label="Application menu">{["File", "Edit", "View", "Windows", "Special", "Help"].map((name) => <span className="mac-menu-slot" key={name}><button type="button" aria-expanded={menuOpen === name} onClick={() => setMenuOpen(menuOpen === name ? null : name)}>{name}</button>{menuOpen === name && <div className="mac-menu-dropdown">{menuItems(name).map((item) => <button type="button" key={item.label} onClick={() => runMenuAction(item.action)}>{item.label}</button>)}</div>}</span>)}</nav>
        <div className="header-center"><span className="live-indicator" />{theme.name}<span className="header-divider" />{activeCount} {activeCount === 1 ? "window" : "windows"}</div>
        <nav className="header-actions" aria-label="Workspace actions"><button type="button" className="header-action" onClick={() => setSearchOpen(true)}><span>Search</span><kbd>⌘ K</kbd></button><button type="button" className="header-action" onClick={() => setSettingsOpen(true)}>Settings</button></nav>
      </header>

      {!focusMode && <Sidebar onAddWidget={() => setWidgetShelfOpen(true)} onSettings={() => setSettingsOpen(true)} onSearch={() => setSearchOpen(true)} />}

      {!focusMode && showWelcome && <section className="workspace-intro"><div className="welcome-titlebar"><span>Welcome to GESTALT</span><span className="welcome-titlebar-box" aria-hidden="true" /></div><div className="welcome-content"><div className="eyebrow">WELCOME TO GESTALT BBS</div><h1>GESTALT<br /><em>READY.</em></h1><p>A monochrome desktop for bookmarks, notes, lists, and whatever you are building next.</p><div className="intro-actions"><button type="button" className="primary-button" onClick={() => setWidgetShelfOpen(true)}>Open widget shelf <span>+</span></button><button type="button" className="quiet-button" onClick={() => setFocusMode(true)}>Focus mode</button></div></div></section>}

      <Canvas onCustomize={setCustomizeWidgetId} />

      <footer className="gestalt-dock" aria-label="Workspace dock"><div className="dock-group"><button type="button" className="dock-button is-active" onClick={() => setFocusMode(false)}><span className="dock-glyph">⌂</span><span>Workspace</span></button><button type="button" className="dock-button" onClick={() => setWidgetShelfOpen(true)}><span className="dock-glyph">+</span><span>Widgets</span></button></div><div className="dock-hint"><span className="status-dot" /> Local workspace</div><div className="dock-group"><button type="button" className="dock-button" onClick={() => setFocusMode(!focusMode)}><span className="dock-glyph">{focusMode ? "□" : "◧"}</span><span>{focusMode ? "Exit focus" : "Focus"}</span></button><button type="button" className="dock-button" onClick={() => setSettingsOpen(true)}><span className="dock-glyph">⚙</span><span>Settings</span></button></div></footer>

      {widgetShelfOpen && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setWidgetShelfOpen(false)}><section className="widget-shelf" role="dialog" aria-modal="true" aria-labelledby="widget-shelf-title"><div className="settings-header"><div><div className="eyebrow">Workspace shelf</div><h2 id="widget-shelf-title">Add something useful</h2><p>Widgets stay local and remember their place.</p></div><button type="button" className="icon-button" onClick={() => setWidgetShelfOpen(false)}>Close</button></div><div className="shelf-grid">{widgetOptions.map((option) => <button type="button" key={option.type} className="shelf-card" onClick={() => addFromShelf(option.type)}><span className="shelf-icon">+</span><span><strong>{option.title}</strong><small>{option.description}</small></span></button>)}</div></section></div>}
      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
      {customizeWidgetId && <WidgetInspector widgetId={customizeWidgetId} onClose={() => setCustomizeWidgetId(null)} />}
      {aboutOpen && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setAboutOpen(false)}><section className="about-panel" role="dialog" aria-modal="true" aria-labelledby="about-title"><div className="settings-header"><div><div className="eyebrow">Local workspace system</div><h2 id="about-title">GESTALT</h2><p>Macintosh / BBS edition. Widgets and preferences stay in this browser.</p></div><button type="button" className="icon-button" onClick={() => setAboutOpen(false)}>Close</button></div><div className="about-copy">Drag title bars to place windows. Use the small plus control in any title bar to customize that box.</div></section></div>}
      {searchOpen && <CommandPalette onClose={() => setSearchOpen(false)} onSettings={() => { setSearchOpen(false); setSettingsOpen(true); }} onAddWidget={() => { setSearchOpen(false); setWidgetShelfOpen(true); }} />}
    </main>
  );
}
