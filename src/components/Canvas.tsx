"use client";

import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { useWidgetStore } from "@/store/widgetStore";
import { Window } from "@/components/Window";
import { BookmarkWidget } from "@/components/widgets/BookmarkWidget";

function WidgetContent({ type }: { type: string }) {
  switch (type) {
    case "bookmarks":
      return <BookmarkWidget />;
    default:
      return null;
  }
}

export function Canvas() {
  const widgets = useWidgetStore((s) => s.widgets);
  const updateWidget = useWidgetStore((s) => s.updateWidget);

  function onDragEnd(event: DragEndEvent) {
    const { active, delta } = event;
    const widget = widgets.find((w) => w.id === active.id);
    if (!widget) return;
    updateWidget(widget.id, {
      x: widget.x + delta.x,
      y: widget.y + delta.y,
    });
  }

  return (
    <DndContext modifiers={[restrictToParentElement]} onDragEnd={onDragEnd}>
      <div className="relative w-screen h-screen overflow-hidden">
        {widgets.map((widget) => (
          <Window key={widget.id} widget={widget}>
            <WidgetContent type={widget.type} />
          </Window>
        ))}
      </div>
    </DndContext>
  );
}
