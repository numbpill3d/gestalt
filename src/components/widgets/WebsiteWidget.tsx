"use client";

import { useState } from "react";
import { useWebsiteStore } from "@/store/websiteStore";

function safeUrl(value: string) {
  if (/^[a-z][a-z\d+.-]*:/i.test(value) && !/^https?:\/\//i.test(value)) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch { return null; }
}

export function WebsiteWidget() {
  const savedUrl = useWebsiteStore((state) => state.url);
  const setUrl = useWebsiteStore((state) => state.setUrl);
  const [value, setValue] = useState(savedUrl);
  const [error, setError] = useState("");
  const [frameUrl, setFrameUrl] = useState(savedUrl);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const next = safeUrl(value.trim());
    if (!next) { setError("Use a valid HTTP or HTTPS URL."); return; }
    setUrl(next); setFrameUrl(next); setValue(next); setError("");
  }

  return <div className="website-widget"><form className="website-bar" onSubmit={submit}><input aria-label="Website URL" value={value} onChange={(event) => setValue(event.target.value)} /><button type="submit">Go</button></form>{error && <p className="widget-error" role="alert">{error}</p>}<iframe title="Embedded website" src={frameUrl} loading="lazy" referrerPolicy="no-referrer" /></div>;
}
