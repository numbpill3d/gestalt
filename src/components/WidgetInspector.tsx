"use client";

import { useWidgetStore, type WidgetFont, type WidgetFormat } from "@/store/widgetStore";

const fontOptions: Array<{ value: WidgetFont; label: string }> = [
  { value: "geneva", label: "Geneva / Arial" },
  { value: "courier", label: "Courier New" },
  { value: "arial", label: "Arial" },
  { value: "times", label: "Times New Roman" },
];

export function WidgetInspector({ widgetId, onClose }: { widgetId: string; onClose: () => void }) {
  const widget = useWidgetStore((state) => state.widgets.find((item) => item.id === widgetId));
  const updateWidget = useWidgetStore((state) => state.updateWidget);
  if (!widget) return null;

  const update = (patch: Parameters<typeof updateWidget>[1]) => updateWidget(widget.id, patch);
  const font = (value?: WidgetFont) => value ?? "geneva";

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="widget-inspector" role="dialog" aria-modal="true" aria-labelledby="widget-inspector-title">
        <header className="settings-header">
          <div><div className="eyebrow">Window attributes</div><h2 id="widget-inspector-title">Customize {widget.title}</h2><p>These settings belong to this box only.</p></div>
          <button type="button" className="icon-button" onClick={onClose}>Close</button>
        </header>
        <div className="inspector-content">
          <label className="inspector-field inspector-field-wide"><span>Window title</span><input value={widget.title} onChange={(event) => update({ title: event.target.value })} /></label>
          <div className="inspector-section-label">HEADER</div>
          <div className="inspector-grid">
            <label className="inspector-field"><span>Header color</span><input type="color" value={widget.headerColor ?? "#d4d0c8"} onChange={(event) => update({ headerColor: event.target.value })} /></label>
            <label className="inspector-field"><span>Header text</span><input type="color" value={widget.headerTextColor ?? "#111111"} onChange={(event) => update({ headerTextColor: event.target.value })} /></label>
            <label className="inspector-field"><span>Header font</span><select value={font(widget.headerFont)} onChange={(event) => update({ headerFont: event.target.value as WidgetFont })}>{fontOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            <label className="inspector-field"><span>Header size</span><input type="number" min="9" max="24" value={widget.headerSize ?? 11} onChange={(event) => update({ headerSize: Number(event.target.value) })} /></label>
          </div>
          <div className="inspector-section-label">BODY</div>
          <div className="inspector-grid">
            <label className="inspector-field"><span>Body color</span><input type="color" value={widget.bodyColor ?? "#f2f2f2"} onChange={(event) => update({ bodyColor: event.target.value })} /></label>
            <label className="inspector-field"><span>Body text</span><input type="color" value={widget.bodyTextColor ?? "#111111"} onChange={(event) => update({ bodyTextColor: event.target.value })} /></label>
            <label className="inspector-field"><span>Body font</span><select value={font(widget.bodyFont)} onChange={(event) => update({ bodyFont: event.target.value as WidgetFont })}>{fontOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            <label className="inspector-field"><span>Body size</span><input type="number" min="9" max="24" value={widget.bodySize ?? 12} onChange={(event) => update({ bodySize: Number(event.target.value) })} /></label>
            <label className="inspector-field inspector-field-wide"><span>Body formatting</span><select value={widget.bodyFormat ?? "normal"} onChange={(event) => update({ bodyFormat: event.target.value as WidgetFormat })}><option value="normal">Normal</option><option value="compact">Compact spacing</option><option value="mono">Monospace reading</option><option value="large">Large text</option></select></label>
          </div>
        </div>
        <footer className="settings-footer"><span>Changes save with this window.</span><button type="button" className="text-button" onClick={() => update({ headerColor: undefined, headerTextColor: undefined, bodyColor: undefined, bodyTextColor: undefined, headerFont: undefined, bodyFont: undefined, headerSize: undefined, bodySize: undefined, bodyFormat: undefined })}>Reset box style</button></footer>
      </section>
    </div>
  );
}
