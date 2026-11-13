# GESTALT

GESTALT is an experimental browser desktop and customizable start-page interface built with Next.js. It presents bookmark tools as draggable, resizable windows and supports switchable visual themes with locally persisted UI state.

## Features

- Draggable, focusable, minimizable, and resizable desktop-style windows
- Bookmark widget with locally persisted entries
- Rotating ASCII art widget sourced through a server-side ASCIIArt.eu proxy
- Cellular automata widget with configurable rule, speed, density, cell size, palette, and grid
- Winamp-style local audio player with playlist controls and local `.wsz` / image skin loading

## Browser extension packaging

Gestalt includes a Manifest V3 browser extension shell for Chrome and Firefox. It opens the configured Gestalt URL, saves the active tab directly into the bookmark widget, and adds a “Save page to GESTALT” context-menu action.

Run `npm run extension:package`, then load `dist/extension-chrome` as an unpacked extension in Chrome or `dist/extension-firefox` through Firefox’s `about:debugging` page. Use Extension Settings to point the shell at a deployed Gestalt URL instead of the default local development URL.
- Switchable visual themes
- Responsive full-screen canvas
- Client-side state powered by Zustand

## Run locally

Requirements: a current Node.js release and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production build

```bash
npm run build
npm start
```

## Checks

```bash
npm run lint
npm run build
```

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- dnd-kit
- Zustand
- Framer Motion

## Status

GESTALT is an early-stage prototype. APIs and interface behavior may change.
