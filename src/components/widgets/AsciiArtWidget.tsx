"use client";

import { useEffect, useState } from "react";

const fallbackArt = `      /\\_/\\
     ( o.o )
      > ^ <

  LOCAL ASCII SIGNAL`;

interface ArtResponse {
  art: string;
  category: string;
  source: string;
}

export function AsciiArtWidget() {
  const [result, setResult] = useState<ArtResponse>({ art: fallbackArt, category: "local fallback", source: "https://www.asciiart.eu/" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadArt(signal?: AbortSignal) {
    setLoading(true);
    try {
      const response = await fetch("/api/ascii-art", { cache: "no-store", signal });
      if (!response.ok) throw new Error("Remote art unavailable");
      const next = await response.json() as ArtResponse;
      setResult(next);
      setError("");
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") return;
      setError("Showing local fallback; retrying on the next cycle.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    const initialLoad = window.setTimeout(() => void loadArt(controller.signal), 0);
    const timer = window.setInterval(() => void loadArt(), 40_000);
    return () => {
      controller.abort();
      window.clearTimeout(initialLoad);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="ascii-art-widget">
      <div className="ascii-art-toolbar"><span className="widget-kicker">{loading ? "Fetching signal..." : `Random / ${result.category}`}</span><button type="button" onClick={() => void loadArt()} disabled={loading}>{loading ? "..." : "REFRESH"}</button></div>
      <pre className="ascii-art-display">{result.art}</pre>
      <div className="ascii-art-footer"><span>{error || "Auto refresh: 40 seconds"}</span><a href={result.source} target="_blank" rel="noreferrer">ASCIIART.EU ↗</a></div>
    </div>
  );
}
