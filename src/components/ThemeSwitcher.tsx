"use client";

import { themes } from "@/themes";
import { useThemeStore } from "@/store/themeStore";

export function ThemeSwitcher() {
  const themeId = useThemeStore((s) => s.themeId);
  const setThemeId = useThemeStore((s) => s.setThemeId);

  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex gap-2 p-2 rounded-[var(--nova-radius)] border"
      style={{
        background: "var(--nova-surface)",
        borderColor: "var(--nova-border)",
        boxShadow: "2px 2px 0 var(--nova-shadow)",
        fontFamily: "var(--nova-font)",
      }}
    >
      {themes.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => setThemeId(t.id)}
          title={t.tagline}
          className="px-3 py-1.5 text-xs font-bold border cursor-pointer transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nova-accent)]"
          style={{
            borderColor: "var(--nova-border)",
            borderRadius: "var(--nova-radius)",
            background:
              themeId === t.id ? "var(--nova-accent)" : "var(--nova-surface-alt)",
            color:
              themeId === t.id
                ? "var(--nova-accent-text)"
                : "var(--nova-text)",
          }}
        >
          {t.name}
        </button>
      ))}
    </div>
  );
}
