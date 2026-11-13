"use client";

import { themes } from "@/themes";
import { useThemeStore } from "@/store/themeStore";

export function ThemeSwitcher() {
  const themeId = useThemeStore((s) => s.themeId);
  const setThemeId = useThemeStore((s) => s.setThemeId);

  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex gap-2 p-2 rounded-[var(--gestalt-radius)] border"
      style={{
        background: "var(--gestalt-surface)",
        borderColor: "var(--gestalt-border)",
        boxShadow: "2px 2px 0 var(--gestalt-shadow)",
        fontFamily: "var(--gestalt-font)",
      }}
    >
      {themes.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => setThemeId(t.id)}
          title={t.tagline}
          className="px-3 py-1.5 text-xs font-bold border cursor-pointer transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gestalt-accent)]"
          style={{
            borderColor: "var(--gestalt-border)",
            borderRadius: "var(--gestalt-radius)",
            background:
              themeId === t.id ? "var(--gestalt-accent)" : "var(--gestalt-surface-alt)",
            color:
              themeId === t.id
                ? "var(--gestalt-accent-text)"
                : "var(--gestalt-text)",
          }}
        >
          {t.name}
        </button>
      ))}
    </div>
  );
}
