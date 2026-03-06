# Space Vis — Adaptive Screen Environment

A looping 3D installation animation built with Three.js, visualising a digital screen that adapts its content density based on the number of people present in the space.

## Concept

When **few people** are present, the screen shows rich, detailed content. As the **crowd grows**, the screen simplifies to minimal messaging. The environment responds in parallel — silhouettes appear in waves, a registration desk rises from the floor, and floating spatial planes shift in opacity and content.

## Stack

- [Three.js](https://threejs.org/) — 3D rendering
- [GSAP](https://greensock.com/gsap/) — animation timeline
- [Vite](https://vitejs.dev/) — dev server and build

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Scene overview

| File | Responsibility |
|---|---|
| `src/main.js` | Entry point, render loop |
| `src/scene.js` | Three.js scene, camera, EffectComposer |
| `src/state.js` | GSAP timeline — 54s ping-pong loop |
| `src/screen.js` | Glowing screen at world origin |
| `src/silhouettes.js` | 39 SVG people silhouettes |
| `src/desk.js` | Registration desk prop |
| `src/planes.js` | Floating spatial UI planes |
| `src/environment.js` | Floor/ceiling grids, structural lines |
| `src/camera.js` | Pendulum orbit animation |
| `src/grain.js` | Film grain post-processing pass |
| `src/colors.js` | All scene color and effect defaults |
| `src/controls.js` | lil-gui debug panel |

## Animation loop

The timeline runs for **54 seconds** and repeats seamlessly:

| Phase | Time | State |
|---|---|---|
| LARGE | 0–5s | 6 silhouettes, max screen content |
| → MEDIUM | 5–13s | 18 silhouettes, medium content |
| → MANY | 13–20s | 24 silhouettes, minimal content |
| → XSMALL | 20–27s | 36 silhouettes, xsmall content |
| ← MANY | 27–35s | reverse |
| ← MEDIUM | 35–44s | reverse |
| ← LARGE | 44–54s | reverse |

## SVG assets

Silhouette shapes (`S0`–`S17`) and screen UI states are loaded from `public/images/`. Screen SVGs are exported from a 1920×1080px Figma artboard.
