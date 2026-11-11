"use client";

import { useMemo, useState } from "react";

export function CalendarWidget() {
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const today = new Date();
  const days = useMemo(() => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [...Array(firstDay).fill(null), ...Array.from({ length: count }, (_, index) => index + 1)];
  }, [month]);

  function shiftMonth(amount: number) { setMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1)); }
  const isToday = (day: number) => today.getFullYear() === month.getFullYear() && today.getMonth() === month.getMonth() && today.getDate() === day;

  return <div className="calendar-widget"><div className="calendar-toolbar"><button type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month">‹</button><strong>{month.toLocaleDateString([], { month: "long", year: "numeric" })}</strong><button type="button" onClick={() => shiftMonth(1)} aria-label="Next month">›</button></div><div className="calendar-weekdays">{["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div><div className="calendar-grid">{days.map((day, index) => <span key={`${day}-${index}`} className={day && isToday(day) ? "is-today" : ""}>{day}</span>)}</div></div>;
}
