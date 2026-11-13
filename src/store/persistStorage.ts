import { createJSONStorage } from "zustand/middleware";

const legacyPrefix = ["no", "va-exe"].join("-");

export function gestaltStorage(suffix: string) {
  return createJSONStorage(() => ({
    getItem: (name: string) => {
      const current = localStorage.getItem(name);
      if (current !== null) return current;
      const legacyName = `${legacyPrefix}-${suffix}`;
      const legacy = localStorage.getItem(legacyName);
      if (legacy !== null) {
        localStorage.setItem(name, legacy);
        return legacy;
      }
      return null;
    },
    setItem: (name: string, value: string) => localStorage.setItem(name, value),
    removeItem: (name: string) => localStorage.removeItem(name),
  }));
}
