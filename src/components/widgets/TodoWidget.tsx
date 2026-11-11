"use client";

import { useState } from "react";
import { useTodoStore } from "@/store/todoStore";

export function TodoWidget() {
  const items = useTodoStore((state) => state.items);
  const add = useTodoStore((state) => state.add);
  const toggle = useTodoStore((state) => state.toggle);
  const remove = useTodoStore((state) => state.remove);
  const [label, setLabel] = useState("");
  function submit(event: React.FormEvent) { event.preventDefault(); if (!label.trim()) return; add(label.trim()); setLabel(""); }

  return <div className="todo-widget"><div className="todo-list">{items.map((item) => <div className={`todo-item ${item.done ? "is-done" : ""}`} key={item.id}><button type="button" className="todo-check" onClick={() => toggle(item.id)} aria-label={`${item.done ? "Mark incomplete" : "Mark complete"}: ${item.label}`} aria-pressed={item.done}>{item.done ? "✓" : ""}</button><span>{item.label}</span><button type="button" className="todo-remove" onClick={() => remove(item.id)} aria-label={`Remove ${item.label}`}>×</button></div>)}</div><form className="inline-add" onSubmit={submit}><input aria-label="New to-do" value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Add a task" /><button type="submit" aria-label="Add to-do">+</button></form></div>;
}
