"use client";

import { useEffect, useRef, useState } from "react";
import { useAutomataStore, type AutomataPalette, type AutomataRule } from "@/store/automataStore";

const paletteColors: Record<AutomataPalette, { dead: string; live: string; dying: string; grid: string }> = {
  mono: { dead: "#f2f2f2", live: "#111111", dying: "#777777", grid: "#d4d0c8" },
  amber: { dead: "#17130b", live: "#f0b84b", dying: "#765b27", grid: "#332816" },
  green: { dead: "#07130c", live: "#55d68a", dying: "#237349", grid: "#173b26" },
  ice: { dead: "#08131a", live: "#9ee8ff", dying: "#3e8193", grid: "#173542" },
};

function neighbors(world: Uint8Array, width: number, height: number, x: number, y: number): number {
  let total = 0;
  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      if (dx === 0 && dy === 0) continue;
      const nx = (x + dx + width) % width;
      const ny = (y + dy + height) % height;
      total += world[ny * width + nx] === 1 ? 1 : 0;
    }
  }
  return total;
}

function evolve(world: Uint8Array, width: number, height: number, rule: AutomataRule): Uint8Array {
  const next = new Uint8Array(world.length);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      const state = world[index];
      if (rule === "brian") {
        next[index] = state === 1 ? 2 : state === 2 ? 0 : neighbors(world, width, height, x, y) === 2 ? 1 : 0;
        continue;
      }
      const count = neighbors(world, width, height, x, y);
      const survives = rule === "seeds" ? false : count === 2 || count === 3;
      const born = rule === "highlife" ? count === 3 || count === 6 : count === 3;
      next[index] = state === 1 ? (survives ? 1 : 0) : born ? 1 : 0;
    }
  }
  return next;
}

function seedWorld(width: number, height: number, density: number): Uint8Array {
  const world = new Uint8Array(width * height);
  for (let index = 0; index < world.length; index += 1) world[index] = Math.random() * 100 < density ? 1 : 0;
  return world;
}

export function AutomataWidget() {
  const rule = useAutomataStore((state) => state.rule);
  const speed = useAutomataStore((state) => state.speed);
  const density = useAutomataStore((state) => state.density);
  const cellSize = useAutomataStore((state) => state.cellSize);
  const palette = useAutomataStore((state) => state.palette);
  const showGrid = useAutomataStore((state) => state.showGrid);
  const running = useAutomataStore((state) => state.running);
  const seed = useAutomataStore((state) => state.seed);
  const setRule = useAutomataStore((state) => state.setRule);
  const setSpeed = useAutomataStore((state) => state.setSpeed);
  const setDensity = useAutomataStore((state) => state.setDensity);
  const setCellSize = useAutomataStore((state) => state.setCellSize);
  const setPalette = useAutomataStore((state) => state.setPalette);
  const setShowGrid = useAutomataStore((state) => state.setShowGrid);
  const toggleRunning = useAutomataStore((state) => state.toggleRunning);
  const reseed = useAutomataStore((state) => state.reseed);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stepRef = useRef<(() => void) | null>(null);
  const configRef = useRef({ palette, showGrid, running, speed, rule });
  configRef.current = { palette, showGrid, running, speed, rule };
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    const canvasElement = canvasRef.current as HTMLCanvasElement | null;
    if (!canvasElement) return;
    const stage = canvasElement.parentElement as HTMLElement | null;
    if (!stage) return;
    const renderingContext = canvasElement.getContext("2d") as CanvasRenderingContext2D | null;
    if (!renderingContext) return;
    const canvas = canvasElement;
    const parent = stage;
    const context = renderingContext;
    let width = 0;
    let height = 0;
    let world: Uint8Array<ArrayBufferLike> = new Uint8Array();
    let lastFrame = 0;
    let animationFrame = 0;
    let resizeObserver: ResizeObserver | null = null;

    function resize() {
      const rect = parent.getBoundingClientRect();
      const nextWidth = Math.max(12, Math.floor(rect.width / cellSize));
      const nextHeight = Math.max(8, Math.floor(rect.height / cellSize));
      if (nextWidth === width && nextHeight === height && world.length) return;
      width = nextWidth;
      height = nextHeight;
      canvas.width = width * cellSize * window.devicePixelRatio;
      canvas.height = height * cellSize * window.devicePixelRatio;
      canvas.style.width = `${width * cellSize}px`;
      canvas.style.height = `${height * cellSize}px`;
      context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      world = seedWorld(width, height, density);
    }

    function draw() {
      const colors = paletteColors[configRef.current.palette];
      context.fillStyle = colors.dead;
      context.fillRect(0, 0, width * cellSize, height * cellSize);
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const state = world[y * width + x];
          if (!state) continue;
          context.fillStyle = state === 2 ? colors.dying : colors.live;
          context.fillRect(x * cellSize + 1, y * cellSize + 1, Math.max(1, cellSize - 1), Math.max(1, cellSize - 1));
        }
      }
      if (configRef.current.showGrid && cellSize >= 5) {
        context.strokeStyle = colors.grid;
        context.lineWidth = 1;
        for (let x = 0; x <= width; x += 1) { context.beginPath(); context.moveTo(x * cellSize + 0.5, 0); context.lineTo(x * cellSize + 0.5, height * cellSize); context.stroke(); }
        for (let y = 0; y <= height; y += 1) { context.beginPath(); context.moveTo(0, y * cellSize + 0.5); context.lineTo(width * cellSize, y * cellSize + 0.5); context.stroke(); }
      }
    }

    function step() {
      if (!world.length) resize();
      world = evolve(world, width, height, configRef.current.rule);
      setGeneration((current) => current + 1);
      draw();
    }

    stepRef.current = step;
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);
    resize();
    draw();
    function animate(timestamp: number) {
      if (configRef.current.running && timestamp - lastFrame >= 1000 / configRef.current.speed) { lastFrame = timestamp; step(); }
      draw();
      animationFrame = window.requestAnimationFrame(animate);
    }
    animationFrame = window.requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      stepRef.current = null;
    };
  }, [cellSize, density, rule, seed]);

  return (
    <div className="automata-widget">
      <div className="automata-stage"><canvas ref={canvasRef} aria-label="Cellular automata simulation" /></div>
      <div className="automata-toolbar">
        <button type="button" onClick={toggleRunning}>{running ? "PAUSE" : "PLAY"}</button><button type="button" onClick={() => stepRef.current?.()}>STEP</button><button type="button" onClick={reseed}>RESEED</button>
        <span className="automata-generation">GEN {generation}</span>
      </div>
      <div className="automata-controls">
        <label>RULE<select value={rule} onChange={(event) => setRule(event.target.value as AutomataRule)}><option value="life">Game of Life</option><option value="highlife">HighLife</option><option value="seeds">Seeds</option><option value="brian">Brian&apos;s Brain</option></select></label>
        <label>SPEED<input type="range" min="1" max="24" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} /><output>{speed}</output></label>
        <label>DENSITY<input type="range" min="5" max="75" value={density} onChange={(event) => setDensity(Number(event.target.value))} /><output>{density}%</output></label>
        <label>CELL SIZE<select value={cellSize} onChange={(event) => setCellSize(Number(event.target.value))}><option value="5">5 px</option><option value="8">8 px</option><option value="11">11 px</option><option value="14">14 px</option></select></label>
        <label>PALETTE<select value={palette} onChange={(event) => setPalette(event.target.value as AutomataPalette)}><option value="mono">Monochrome</option><option value="amber">Amber terminal</option><option value="green">Green screen</option><option value="ice">Ice terminal</option></select></label>
        <label className="automata-toggle"><input type="checkbox" checked={showGrid} onChange={(event) => setShowGrid(event.target.checked)} /> GRID</label>
      </div>
    </div>
  );
}
