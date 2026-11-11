"use client";

import { useEffect, useRef } from "react";
import { themes } from "@/themes";
import { useThemeStore } from "@/store/themeStore";

const accentOptions = [
  { id: "mint", label: "Mint", value: "#82f7c5" },
  { id: "sky", label: "Sky", value: "#8cc8ff" },
  { id: "coral", label: "Coral", value: "#ff9b8c" },
  { id: "violet", label: "Violet", value: "#c7a7ff" },
  { id: "amber", label: "Amber", value: "#ffd166" },
];

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const themeId = useThemeStore((state) => state.themeId);
  const accentId = useThemeStore((state) => state.accentId);
  const density = useThemeStore((state) => state.density);
  const showGrid = useThemeStore((state) => state.showGrid);
  const use24HourTime = useThemeStore((state) => state.use24HourTime);
  const setThemeId = useThemeStore((state) => state.setThemeId);
  const setAccentId = useThemeStore((state) => state.setAccentId);
  const setDensity = useThemeStore((state) => state.setDensity);
  const setShowGrid = useThemeStore((state) => state.setShowGrid);
  const setUse24HourTime = useThemeStore((state) => state.setUse24HourTime);
  const resetAppearance = useThemeStore((state) => state.resetAppearance);

  useEffect(() => {
    panelRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section
        ref={panelRef}
        className="settings-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        tabIndex={-1}
      >
        <header className="settings-header">
          <div>
            <div className="eyebrow">Workspace controls</div>
            <h2 id="settings-title">Settings</h2>
            <p>Shape NOVA around the way you actually work.</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close settings">Close</button>
        </header>

        <div className="settings-content">
          <section className="settings-section">
            <div className="section-heading"><h3>Theme</h3><span>Presets live here now.</span></div>
            <div className="theme-grid">
              {themes.map((theme) => (
                <button
                  type="button"
                  key={theme.id}
                  className={`theme-card ${themeId === theme.id ? "is-selected" : ""}`}
                  onClick={() => setThemeId(theme.id)}
                  aria-pressed={themeId === theme.id}
                >
                  <span className="theme-preview" style={{ background: theme.background }} />
                  <span className="theme-card-copy"><strong>{theme.name}</strong><small>{theme.tagline}</small></span>
                  <span className="theme-check" aria-hidden="true">{themeId === theme.id ? "Selected" : "Use"}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="settings-section">
            <div className="section-heading"><h3>Accent color</h3><span>One color across the workspace.</span></div>
            <div className="accent-row">
              {accentOptions.map((accent) => (
                <button
                  type="button"
                  key={accent.id}
                  className={`accent-swatch ${accentId === accent.id ? "is-selected" : ""}`}
                  onClick={() => setAccentId(accent.id)}
                  style={{ "--swatch": accent.value } as React.CSSProperties}
                  aria-label={accent.label}
                  aria-pressed={accentId === accent.id}
                />
              ))}
            </div>
          </section>

          <section className="settings-section">
            <div className="section-heading"><h3>Workspace feel</h3><span>Small choices, less friction.</span></div>
            <div className="option-row">
              <div><strong>Canvas density</strong><small>Choose how much breathing room widgets get.</small></div>
              <div className="segmented-control" role="group" aria-label="Canvas density">
                {(["airy", "balanced", "compact"] as const).map((value) => (
                  <button type="button" key={value} onClick={() => setDensity(value)} className={density === value ? "is-active" : ""}>{value}</button>
                ))}
              </div>
            </div>
            <label className="toggle-row"><span><strong>Canvas grid</strong><small>Keep a quiet alignment grid behind your windows.</small></span><input type="checkbox" checked={showGrid} onChange={(event) => setShowGrid(event.target.checked)} /><span className="toggle-ui" /></label>
            <label className="toggle-row"><span><strong>24-hour clock</strong><small>Use 24-hour time in the local clock widget.</small></span><input type="checkbox" checked={use24HourTime} onChange={(event) => setUse24HourTime(event.target.checked)} /><span className="toggle-ui" /></label>
          </section>
        </div>

        <footer className="settings-footer"><button type="button" className="text-button" onClick={resetAppearance}>Reset appearance</button><span>Preferences save automatically.</span></footer>
      </section>
    </div>
  );
}
