# GESTALT

GESTALT is an experimental browser desktop and customizable start-page interface built with Next.js. It presents bookmark tools as draggable, resizable windows and supports switchable visual themes with locally persisted UI state.

## Features

- Draggable, focusable, minimizable, and resizable desktop-style windows
- Bookmark widget with locally persisted entries
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
