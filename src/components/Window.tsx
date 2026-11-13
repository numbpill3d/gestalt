"use client";

import { useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { WidgetInstance } from "@/store/widgetStore";
import { useWidgetStore } from "@/store/widgetStore";

const MIN_W = 160;
const MIN_H = 140;

function fontFamily(font: WidgetInstance["headerFont"]): string {
  switch (font) {
    case "courier": return '"Courier New", monospace';
    case "arial": return 'Arial, sans-serif';
    case "times": return '"Times New Roman", serif';
    default: return '"Geneva", "Arial", sans-serif';
  }
}

export function Window({
  widget,
  children,
  onCustomize,
}: {
  widget: WidgetInstance;
  children: React.ReactNode;
  onCustomize: (id: string) => void;
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
    ["--gestalt-widget-header-bg" as string]: widget.headerColor ?? "var(--gestalt-window-bar)",
    ["--gestalt-widget-header-text" as string]: widget.headerTextColor ?? "var(--gestalt-text)",
    ["--gestalt-widget-body-bg" as string]: widget.bodyColor ?? "var(--gestalt-surface)",
    ["--gestalt-widget-body-text" as string]: widget.bodyTextColor ?? "var(--gestalt-text)",
    ["--gestalt-widget-header-font" as string]: fontFamily(widget.headerFont),
    ["--gestalt-widget-body-font" as string]: fontFamily(widget.bodyFont),
    ["--gestalt-widget-header-size" as string]: `${widget.headerSize ?? 11}px`,
    ["--gestalt-widget-body-size" as string]: `${widget.bodySize ?? 12}px`,
  };

  const format = widget.bodyFormat ?? "normal";

  function onResizePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation();
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    focusWidget(widget.id);
    resizeState.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: widget.w,
      startH: widget.h,
    };
  }

  function onResizePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const state = resizeState.current;
    if (!state) return;
    const maxW = Math.max(MIN_W, window.innerWidth - widget.x - 16);
    const maxH = Math.max(MIN_H, window.innerHeight - widget.y - 24);
    const nextW = Math.min(maxW, Math.max(MIN_W, state.startW + (e.clientX - state.startX)));
    const nextH = Math.min(maxH, Math.max(MIN_H, state.startH + (e.clientY - state.startY)));
    updateWidget(widget.id, { w: nextW, h: nextH });
  }

  function onResizePointerUp(e?: React.PointerEvent<HTMLDivElement>) {
    resizeState.current = null;
    if (e && e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

  function onResizeKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowDown" && e.key !== "ArrowLeft" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const horizontal = e.key === "ArrowRight" || e.key === "ArrowLeft";
    const amount = e.key === "ArrowRight" || e.key === "ArrowDown" ? 24 : -24;
    updateWidget(widget.id, horizontal ? { w: Math.max(MIN_W, widget.w + amount) } : { h: Math.max(MIN_H, widget.h + amount) });
  }

  return (
    <div
      ref={setNodeRef}
      id={`gestalt-window-${widget.id}`}
      style={style}
      onPointerDown={() => focusWidget(widget.id)}
      className="gestalt-window"
      data-dragging={isDragging || undefined}
    >
      <div
        {...listeners}
        {...attributes}
        className="gestalt-window-bar select-none touch-none"
        style={{
          background: "var(--gestalt-widget-header-bg)",
          color: "var(--gestalt-widget-header-text)",
          cursor: "grab",
          fontFamily: "var(--gestalt-widget-header-font)",
          fontSize: "var(--gestalt-widget-header-size)",
        }}
      >
        <div className="window-controls">
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => toggleMinimize(widget.id)}
            className="window-control window-control-minimize"
            title={widget.minimized ? "Restore" : "Minimize"}
            aria-label={`${widget.minimized ? "Restore" : "Minimize"} ${widget.title}`}
            aria-pressed={widget.minimized}
          />
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => removeWidget(widget.id)}
            className="window-control window-control-close"
            title="Close"
            aria-label={`Close ${widget.title}`}
          />
          <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={() => onCustomize(widget.id)} className="window-control window-control-customize" title="Customize" aria-label={`Customize ${widget.title}`}>+</button>
        </div>
        <span className="window-title truncate">{widget.title}</span>
        <span className="window-type">{widget.type}</span>
      </div>

      {!widget.minimized && (
        <div
          className={`gestalt-window-body widget-body-${widget.type} widget-format-${format}`}
          style={{
            background: "var(--gestalt-widget-body-bg)",
            color: "var(--gestalt-widget-body-text)",
            fontFamily: "var(--gestalt-widget-body-font)",
            fontSize: "var(--gestalt-widget-body-size)",
            borderColor: "var(--gestalt-border)",
          }}
        >
          {children}
          <div
            onPointerDown={onResizePointerDown}
            onPointerMove={onResizePointerMove}
            onPointerUp={onResizePointerUp}
            onPointerCancel={onResizePointerUp}
            onKeyDown={onResizeKeyDown}
            className="window-resize-handle"
            role="separator"
            tabIndex={0}
            aria-label={`Resize ${widget.title}`}
          />
        </div>
      )}
    </div>
  );
}
