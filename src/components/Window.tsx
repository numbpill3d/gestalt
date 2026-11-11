"use client";

import { useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { WidgetInstance } from "@/store/widgetStore";
import { useWidgetStore } from "@/store/widgetStore";

const MIN_W = 220;
const MIN_H = 140;

export function Window({
  widget,
  children,
}: {
  widget: WidgetInstance;
  children: React.ReactNode;
}) {
  const updateWidget = useWidgetStore((s) => s.updateWidget);
  const removeWidget = useWidgetStore((s) => s.removeWidget);
  const focusWidget = useWidgetStore((s) => s.focusWidget);
  const toggleMinimize = useWidgetStore((s) => s.toggleMinimize);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: widget.id });

  const resizeState = useRef<{
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  } | null>(null);

  const style: React.CSSProperties = {
    position: "absolute",
    left: widget.x,
    top: widget.y,
    width: widget.w,
    maxWidth: "calc(100vw - 2rem)",
    height: widget.minimized ? "auto" : widget.h,
    zIndex: widget.zIndex,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  function onResizePointerDown(e: React.PointerEvent) {
    e.stopPropagation();
    e.preventDefault();
    focusWidget(widget.id);
    resizeState.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: widget.w,
      startH: widget.h,
    };
    window.addEventListener("pointermove", onResizePointerMove);
    window.addEventListener("pointerup", onResizePointerUp);
  }

  function onResizePointerMove(e: PointerEvent) {
    const state = resizeState.current;
    if (!state) return;
    const nextW = Math.max(MIN_W, state.startW + (e.clientX - state.startX));
    const nextH = Math.max(MIN_H, state.startH + (e.clientY - state.startY));
    updateWidget(widget.id, { w: nextW, h: nextH });
  }

  function onResizePointerUp() {
    resizeState.current = null;
    window.removeEventListener("pointermove", onResizePointerMove);
    window.removeEventListener("pointerup", onResizePointerUp);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onPointerDown={() => focusWidget(widget.id)}
      className="flex flex-col border shadow-[2px_2px_0_var(--nova-shadow)]"
      data-dragging={isDragging || undefined}
    >
      <div
        {...listeners}
        {...attributes}
        className="flex items-center justify-between px-2 py-1 select-none touch-none"
        style={{
          background: "var(--nova-accent)",
          color: "var(--nova-accent-text)",
          borderColor: "var(--nova-border)",
          borderBottom: "1px solid var(--nova-border)",
          cursor: "grab",
          fontFamily: "var(--nova-heading-font)",
        }}
      >
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => toggleMinimize(widget.id)}
            className="w-3 h-3 rounded-full inline-block border border-black/40 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nova-accent)]"
            style={{ background: "#ffbd44" }}
            title={widget.minimized ? "Restore" : "Minimize"}
            aria-label={`${widget.minimized ? "Restore" : "Minimize"} ${widget.title}`}
            aria-pressed={widget.minimized}
          />
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => removeWidget(widget.id)}
            className="w-3 h-3 rounded-full inline-block border border-black/40 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nova-accent)]"
            style={{ background: "#ff605c" }}
            title="Close"
            aria-label={`Close ${widget.title}`}
          />
        </div>
        <span className="text-xs font-bold truncate px-1">{widget.title}</span>
        <span className="w-3" />
      </div>

      {!widget.minimized && (
        <div
          className="flex-1 overflow-auto p-2 relative"
          style={{
            background: "var(--nova-surface)",
            color: "var(--nova-text)",
            borderColor: "var(--nova-border)",
          }}
        >
          {children}
          <div
            onPointerDown={onResizePointerDown}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
            style={{
              background:
                "linear-gradient(135deg, transparent 50%, var(--nova-border) 50%)",
            }}
          />
        </div>
      )}
    </div>
  );
}
