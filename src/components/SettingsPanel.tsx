"use client";

import { useEffect, useRef } from "react";
import { themes } from "@/themes";
import { useThemeStore, type BackgroundMode, type DockMode, type RadiusStyle } from "@/store/themeStore";
import { useBookmarkStore, type BookmarkView } from "@/store/bookmarkStore";

const accentOptions = [
  { id: "mint", label: "Mint", value: "#82f7c5" },
  { id: "sky", label: "Sky", value: "#8cc8ff" },
  { id: "coral", label: "Coral", value: "#ff9b8c" },
  { id: "violet", label: "Violet", value: "#c7a7ff" },
  { id: "amber", label: "Amber", value: "#ffd166" },
];

const backgroundOptions: Array<{ id: BackgroundMode; label: string; description: string }> = [
  { id: "aurora", label: "Aurora", description: "Soft color at the edges" },
  { id: "deep", label: "Deep space", description: "Quiet and almost black" },
  { id: "cobalt", label: "Cobalt haze", description: "Cool blue atmosphere" },
  { id: "ember", label: "Ember", description: "Warm dusk tones" },
];

function RangeControl({ label, value, min, max, suffix, onChange }: { label: string; value: number; min: number; max: number; suffix: string; onChange: (value: number) => void }) {
  return <label className="range-control"><span><strong>{label}</strong><small>{value}{suffix}</small></span><input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const themeId = useThemeStore((state) => state.themeId);
  const accentId = useThemeStore((state) => state.accentId);
  const customAccent = useThemeStore((state) => state.customAccent);
  const density = useThemeStore((state) => state.density);
  const showGrid = useThemeStore((state) => state.showGrid);
  const use24HourTime = useThemeStore((state) => state.use24HourTime);
  const backgroundMode = useThemeStore((state) => state.backgroundMode);
  const windowOpacity = useThemeStore((state) => state.windowOpacity);
  const windowBlur = useThemeStore((state) => state.windowBlur);
  const radiusStyle = useThemeStore((state) => state.radiusStyle);
  const dockMode = useThemeStore((state) => state.dockMode);
  const showWelcome = useThemeStore((state) => state.showWelcome);
  const snapToGrid = useThemeStore((state) => state.snapToGrid);
  const showWindowLabels = useThemeStore((state) => state.showWindowLabels);
  const setThemeId = useThemeStore((state) => state.setThemeId);
  const setAccentId = useThemeStore((state) => state.setAccentId);
  const setCustomAccent = useThemeStore((state) => state.setCustomAccent);
  const setDensity = useThemeStore((state) => state.setDensity);
  const setShowGrid = useThemeStore((state) => state.setShowGrid);
  const setUse24HourTime = useThemeStore((state) => state.setUse24HourTime);
  const setBackgroundMode = useThemeStore((state) => state.setBackgroundMode);
  const setWindowOpacity = useThemeStore((state) => state.setWindowOpacity);
  const setWindowBlur = useThemeStore((state) => state.setWindowBlur);
  const setRadiusStyle = useThemeStore((state) => state.setRadiusStyle);
  const setDockMode = useThemeStore((state) => state.setDockMode);
  const setShowWelcome = useThemeStore((state) => state.setShowWelcome);
  const setSnapToGrid = useThemeStore((state) => state.setSnapToGrid);
  const setShowWindowLabels = useThemeStore((state) => state.setShowWindowLabels);
  const resetAppearance = useThemeStore((state) => state.resetAppearance);
  const bookmarkView = useBookmarkStore((state) => state.view);
  const showFavicons = useBookmarkStore((state) => state.showFavicons);
  const setBookmarkView = useBookmarkStore((state) => state.setView);
  const setShowFavicons = useBookmarkStore((state) => state.setShowFavicons);

  useEffect(() => {
    panelRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) { if (event.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section ref={panelRef} className="settings-panel" role="dialog" aria-modal="true" aria-labelledby="settings-title" tabIndex={-1}>
      <header className="settings-header"><div><div className="eyebrow">Workspace controls</div><h2 id="settings-title">Settings</h2><p>Shape NOVA around the way you actually work.</p></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close settings">Close</button></header>
      <div className="settings-content">
        <section className="settings-section"><div className="section-heading"><h3>Theme</h3><span>Preset identity and type.</span></div><div className="theme-grid">{themes.map((theme) => <button type="button" key={theme.id} className={`theme-card ${themeId === theme.id ? "is-selected" : ""}`} onClick={() => setThemeId(theme.id)} aria-pressed={themeId === theme.id}><span className="theme-preview" style={{ background: theme.background }} /><span className="theme-card-copy"><strong>{theme.name}</strong><small>{theme.tagline}</small></span><span className="theme-check" aria-hidden="true">{themeId === theme.id ? "Selected" : "Use"}</span></button>)}</div></section>
        <section className="settings-section"><div className="section-heading"><h3>Accent color</h3><span>One signal color across NOVA.</span></div><div className="accent-row">{accentOptions.map((accent) => <button type="button" key={accent.id} className={`accent-swatch ${accentId === accent.id ? "is-selected" : ""}`} onClick={() => setAccentId(accent.id)} style={{ "--swatch": accent.value } as React.CSSProperties} aria-label={accent.label} aria-pressed={accentId === accent.id} />)}<label className={`custom-color ${accentId === "custom" ? "is-selected" : ""}`} title="Custom accent"><input type="color" value={customAccent} onChange={(event) => setCustomAccent(event.target.value)} aria-label="Custom accent color" /><span /></label></div></section>
        <section className="settings-section"><div className="section-heading"><h3>Bookmark display</h3><span>Choose how saved links sit in their window.</span></div><div className="option-row"><div><strong>Link arrangement</strong><small>List for reading, grid for scanning, compact for density.</small></div><div className="segmented-control" role="group" aria-label="Bookmark display mode">{(["list", "grid", "compact"] as BookmarkView[]).map((value) => <button type="button" key={value} onClick={() => setBookmarkView(value)} className={bookmarkView === value ? "is-active" : ""}>{value}</button>)}</div></div><label className="toggle-row"><span><strong>Bookmark icons</strong><small>Show site favicons beside saved links.</small></span><input type="checkbox" checked={showFavicons} onChange={(event) => setShowFavicons(event.target.checked)} /><span className="toggle-ui" /></label></section>
        <section className="settings-section"><div className="section-heading"><h3>Atmosphere</h3><span>Change the space behind your windows.</span></div><div className="background-grid">{backgroundOptions.map((option) => <button type="button" key={option.id} className={`background-option background-${option.id} ${backgroundMode === option.id ? "is-selected" : ""}`} onClick={() => setBackgroundMode(option.id)} aria-pressed={backgroundMode === option.id}><strong>{option.label}</strong><small>{option.description}</small></button>)}</div></section>
        <section className="settings-section"><div className="section-heading"><h3>Window material</h3><span>Tune the feel of every widget.</span></div><RangeControl label="Opacity" value={windowOpacity} min={55} max={100} suffix="%" onChange={setWindowOpacity} /><RangeControl label="Backdrop blur" value={windowBlur} min={0} max={32} suffix="px" onChange={setWindowBlur} /><div className="option-row"><div><strong>Corner shape</strong><small>Pick the radius used by panels and controls.</small></div><div className="segmented-control" role="group" aria-label="Corner shape">{(["sharp", "soft", "round"] as RadiusStyle[]).map((value) => <button type="button" key={value} onClick={() => setRadiusStyle(value)} className={radiusStyle === value ? "is-active" : ""}>{value}</button>)}</div></div></section>
        <section className="settings-section"><div className="section-heading"><h3>Workspace behavior</h3><span>Control what stays visible.</span></div><div className="option-row"><div><strong>Canvas density</strong><small>Choose how much breathing room widgets get.</small></div><div className="segmented-control" role="group" aria-label="Canvas density">{(["airy", "balanced", "compact"] as const).map((value) => <button type="button" key={value} onClick={() => setDensity(value)} className={density === value ? "is-active" : ""}>{value}</button>)}</div></div><div className="option-row"><div><strong>Dock style</strong><small>Choose a wide, compact, or minimal dock.</small></div><div className="segmented-control" role="group" aria-label="Dock style">{(["wide", "compact", "minimal"] as DockMode[]).map((value) => <button type="button" key={value} onClick={() => setDockMode(value)} className={dockMode === value ? "is-active" : ""}>{value}</button>)}</div></div><label className="toggle-row"><span><strong>Welcome copy</strong><small>Show the introductory workspace message.</small></span><input type="checkbox" checked={showWelcome} onChange={(event) => setShowWelcome(event.target.checked)} /><span className="toggle-ui" /></label><label className="toggle-row"><span><strong>Canvas grid</strong><small>Keep a quiet alignment grid behind your windows.</small></span><input type="checkbox" checked={showGrid} onChange={(event) => setShowGrid(event.target.checked)} /><span className="toggle-ui" /></label><label className="toggle-row"><span><strong>Snap windows to grid</strong><small>Use 16 pixel movement steps while dragging.</small></span><input type="checkbox" checked={snapToGrid} onChange={(event) => setSnapToGrid(event.target.checked)} /><span className="toggle-ui" /></label><label className="toggle-row"><span><strong>Window type labels</strong><small>Show the small widget type in each title bar.</small></span><input type="checkbox" checked={showWindowLabels} onChange={(event) => setShowWindowLabels(event.target.checked)} /><span className="toggle-ui" /></label><label className="toggle-row"><span><strong>24-hour clock</strong><small>Use 24-hour time in the local clock widget.</small></span><input type="checkbox" checked={use24HourTime} onChange={(event) => setUse24HourTime(event.target.checked)} /><span className="toggle-ui" /></label></section>
      </div>
      <footer className="settings-footer"><button type="button" className="text-button" onClick={resetAppearance}>Reset appearance</button><span>Preferences save automatically.</span></footer>
    </section>
  </div>;
}
