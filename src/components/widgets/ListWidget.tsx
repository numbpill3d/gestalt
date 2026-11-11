"use client";

import { useState } from "react";
import { useListStore } from "@/store/listStore";

export function ListWidget() {
  const items = useListStore((state) => state.items);
  const add = useListStore((state) => state.add);
  const remove = useListStore((state) => state.remove);
  const [label, setLabel] = useState("");
  function submit(event: React.FormEvent) { event.preventDefault(); if (!label.trim()) return; add(label.trim()); setLabel(""); }

  return <div className="list-widget"><div className="plain-list">{items.map((item, index) => <div className="plain-list-item" key={`${item}-${index}`}><span>{item}</span><button type="button" onClick={() => remove(index)} aria-label={`Remove ${item}`}>×</button></div>)}</div><form className="inline-add" onSubmit={submit}><input aria-label="New list item" value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Add an item" /><button type="submit" aria-label="Add list item">+</button></form></div>;
}
