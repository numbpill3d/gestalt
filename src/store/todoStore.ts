import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TodoItem { id: string; label: string; done: boolean; }
interface TodoState { items: TodoItem[]; add: (label: string) => void; toggle: (id: string) => void; remove: (id: string) => void; }

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      items: [
        { id: "todo-1", label: "Make this space useful", done: false },
        { id: "todo-2", label: "Pin the links I actually revisit", done: true },
      ],
      add: (label) => set((state) => ({ items: [...state.items, { id: `todo-${state.items.length + 1}`, label, done: false }] })),
      toggle: (id) => set((state) => ({ items: state.items.map((item) => item.id === id ? { ...item, done: !item.done } : item) })),
      remove: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
    }),
    { name: "nova-exe-todos" }
  )
);
