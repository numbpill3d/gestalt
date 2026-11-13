"use client";

import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { useEffect } from "react";
import { useWidgetStore } from "@/store/widgetStore";
import { useThemeStore } from "@/store/themeStore";
import { Window } from "@/components/Window";
import { BookmarkWidget } from "@/components/widgets/BookmarkWidget";
import { NotesWidget } from "@/components/widgets/NotesWidget";
import { ClockWidget } from "@/components/widgets/ClockWidget";
import { CalendarWidget } from "@/components/widgets/CalendarWidget";
import { WebsiteWidget } from "@/components/widgets/WebsiteWidget";
import { TodoWidget } from "@/components/widgets/TodoWidget";
import { ListWidget } from "@/components/widgets/ListWidget";
import { AsciiArtWidget } from "@/components/widgets/AsciiArtWidget";
import { AutomataWidget } from "@/components/widgets/AutomataWidget";
import { WinampWidget } from "@/components/widgets/WinampWidget";

function WidgetContent({ type }: { type: string }) {
  switch (type) {
    case "bookmarks":
      return <BookmarkWidget />;
    case "notes":
      return <NotesWidget />;
    case "clock":
      return <ClockWidget />;
    case "calendar":
      return <CalendarWidget />;
    case "website":
      return <WebsiteWidget />;
    case "todo":
      return <TodoWidget />;
    case "list":
      return <ListWidget />;
    case "ascii":
      return <AsciiArtWidget />;
    case "automata":
      return <AutomataWidget />;
    case "winamp":
      return <WinampWidget />;
    default:
      return null;
  }
}

export function Canvas({ onCustomize }: { onCustomize: (id: string) => void }) {
  const widgets = useWidgetStore((s) => s.widgets);
  const updateWidget = useWidgetStore((s) => s.updateWidget);
  const snapToGrid = useThemeStore((s) => s.snapToGrid);

  useEffect(() => {
    const clampWidgets = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      widgets.forEach((widget) => {
        const maxX = Math.max(12, width - Math.min(widget.w, width - 24) - 12);
        const maxY = Math.max(92, height - Math.min(widget.h, height - 116) - 92);
        const x = Math.min(Math.max(12, widget.x), maxX);
        const y = Math.min(Math.max(92, widget.y), maxY);
        if (x !== widget.x || y !== widget.y) updateWidget(widget.id, { x, y });
      });
    };
    clampWidgets();
    window.addEventListener("resize", clampWidgets);
    return () => window.removeEventListener("resize", clampWidgets);
  }, [updateWidget, widgets]);

  function onDragEnd(event: DragEndEvent) {
    const { active, delta } = event;
    const widget = widgets.find((w) => w.id === active.id);
    if (!widget) return;
    const nextX = widget.x + delta.x;
    const nextY = widget.y + delta.y;
    updateWidget(widget.id, {
      x: snapToGrid ? Math.round(nextX / 16) * 16 : nextX,
      y: snapToGrid ? Math.round(nextY / 16) * 16 : nextY,
    });
  }

  return (
    <DndContext id="gestalt-dnd-context" modifiers={[restrictToParentElement]} onDragEnd={onDragEnd}>
      <div className="gestalt-canvas" aria-label="GESTALT workspace canvas">
        {widgets.map((widget) => (
          <Window key={widget.id} widget={widget} onCustomize={onCustomize}>
            <WidgetContent type={widget.type} />
          </Window>
        ))}
      </div>
    </DndContext>
  );
}
