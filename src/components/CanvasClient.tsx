"use client";

import dynamic from "next/dynamic";

const Canvas = dynamic(
  () => import("@/components/Canvas").then((m) => m.Canvas),
  { ssr: false }
);

export function CanvasClient({ onCustomize }: { onCustomize: (id: string) => void }) {
  return <Canvas onCustomize={onCustomize} />;
}
