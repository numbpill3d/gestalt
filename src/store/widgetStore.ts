import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WidgetType =
  | "bookmarks"
  | "notes"
  | "clock"
  | "calendar"
  | "website"
  | "todo"
  | "list";

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
}

interface WidgetState {
  widgets: WidgetInstance[];
  nextZ: number;
  addWidget: (widget: Omit<WidgetInstance, "zIndex">) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, patch: Partial<WidgetInstance>) => void;
  focusWidget: (id: string) => void;
  toggleMinimize: (id: string) => void;
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
    w: 180,
    h: 120,
    minimized: false,
    zIndex: 3,
  },
];

export const useWidgetStore = create<WidgetState>()(
  persist(
    (set, get) => ({
      widgets: defaultWidgets,
      nextZ: 2,
      addWidget: (widget) =>
        set((state) => {
          if (state.widgets.some((item) => item.type === widget.type)) return state;
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
    }),
    {
      name: "nova-exe-widgets",
      version: 2,
      migrate: (persisted) => {
        const state = persisted as Partial<WidgetState>;
        return {
          ...state,
          widgets: state.widgets?.map((widget) => widget.type === "clock" ? { ...widget, w: Math.min(widget.w, 180), h: Math.min(widget.h, 120) } : widget),
        };
      },
    }
  )
);
