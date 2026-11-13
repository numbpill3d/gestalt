import { create } from "zustand";
import { persist } from "zustand/middleware";
import { gestaltStorage } from "@/store/persistStorage";

export type WidgetType =
  | "bookmarks"
  | "notes"
  | "clock"
  | "calendar"
  | "website"
  | "todo"
  | "list"
  | "ascii"
  | "automata";

export type WidgetFont = "geneva" | "courier" | "arial" | "times";
export type WidgetFormat = "normal" | "compact" | "mono" | "large";

export interface WidgetInstance {
  id: string;
  type: WidgetType;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minimized: boolean;
  zIndex: number;
  headerColor?: string;
  headerTextColor?: string;
  bodyColor?: string;
  bodyTextColor?: string;
  headerFont?: WidgetFont;
  bodyFont?: WidgetFont;
  headerSize?: number;
  bodySize?: number;
  bodyFormat?: WidgetFormat;
}

interface WidgetState {
  widgets: WidgetInstance[];
  nextZ: number;
  addWidget: (widget: Omit<WidgetInstance, "zIndex">) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, patch: Partial<WidgetInstance>) => void;
  focusWidget: (id: string) => void;
  toggleMinimize: (id: string) => void;
  minimizeAll: () => void;
  restoreAll: () => void;
  resetLayout: () => void;
}

const defaultWidgets: WidgetInstance[] = [
  {
    id: "bookmarks-1",
    type: "bookmarks",
    title: "Bookmarks",
    x: 540,
    y: 188,
    w: 360,
    h: 420,
    minimized: false,
    zIndex: 1,
  },
  {
    id: "notes-1",
    type: "notes",
    title: "Scratchpad",
    x: 920,
    y: 188,
    w: 320,
    h: 300,
    minimized: false,
    zIndex: 2,
  },
  {
    id: "clock-1",
    type: "clock",
    title: "Local time",
    x: 920,
    y: 510,
    w: 360,
    h: 240,
    minimized: false,
    zIndex: 3,
  },
];

export const useWidgetStore = create<WidgetState>()(
  persist(
    (set, get) => ({
      widgets: defaultWidgets,
      nextZ: 4,
      addWidget: (widget) =>
        set((state) => {
          return {
            widgets: [...state.widgets, { ...widget, zIndex: state.nextZ }],
            nextZ: state.nextZ + 1,
          };
        }),
      removeWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
        })),
      updateWidget: (id, patch) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, ...patch } : w
          ),
        })),
      focusWidget: (id) => {
        const z = get().nextZ;
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, zIndex: z } : w
          ),
          nextZ: z + 1,
        }));
      },
      toggleMinimize: (id) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, minimized: !w.minimized } : w
          ),
        })),
      minimizeAll: () => set((state) => ({ widgets: state.widgets.map((widget) => ({ ...widget, minimized: true })) })),
      restoreAll: () => set((state) => ({ widgets: state.widgets.map((widget) => ({ ...widget, minimized: false })) })),
      resetLayout: () => set({ widgets: defaultWidgets, nextZ: 4 }),
    }),
    {
      name: "gestalt-widgets",
      storage: gestaltStorage("widgets"),
      version: 3,
      migrate: (persisted) => {
        const state = persisted as Partial<WidgetState>;
        return {
          ...state,
          widgets: state.widgets?.map((widget) => widget.type === "clock" ? { ...widget, w: 360, h: 240 } : widget),
        };
      },
    }
  )
);
