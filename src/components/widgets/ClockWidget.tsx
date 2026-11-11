"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "@/store/themeStore";

export function ClockWidget() {
  const use24HourTime = useThemeStore((state) => state.use24HourTime);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !use24HourTime,
  });

  return (
    <div className="clock-widget">
      <div className="widget-kicker">Your local time</div>
      <div className="clock-time">{time}</div>
      <div className="clock-date">
        {now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
      </div>
      <div className="clock-status"><span className="status-dot" /> Workspace ready</div>
    </div>
  );
}
