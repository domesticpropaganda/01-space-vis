# Adaptive Screen Environment — Three.js Animation

## Project Overview

Create a looping 3D animation that visualizes a **digital screen adapting to its surrounding environment**.

The environment contains:
- a wireframe architectural space
- silhouettes representing people
- a screen displaying adaptive content
- floating UI planes
- a slowly orbiting camera

The animation continuously cycles through different states where **the number of people influences the density of screen content**.

The animation will be built in **Three.js** and recorded from the canvas.

---

# Core Concept

The installation visualizes a responsive digital display.

When **few people are present**, the screen shows **rich content**.

When **many people are present**, the screen simplifies to **minimal messaging**.

The environment visually supports this concept through changing spatial elements.

---

# Visual Style

## General aesthetic


The scene should resemble:

- architectural wireframe diagrams
- technical drawings
- conceptual installation renderings

Visual references:
- The reference image is stored under public/references/ folder. View it for the visual style.
- exhibition concept diagrams
- architectural visualization
- wireframe UI prototypes
- blueprint-style layouts

---

# Scene Elements

## 1. Environment

### Floor and Ceiling

The floor and ceiling are wireframe grids.

Characteristics:

- evenly spaced grid lines
- perspective depth
- subtle glow or light tone
- dark background

Suggested implementation:
THREE.LineSegments or grid helpers with custom materials.

Grids should feel like **technical construction space**.

---

### Spatial Planes

Floating planes appear throughout the space.

Properties:

- semi-transparent
- fade in and out
- different sizes
- not full height walls
- positioned at varying depths

Purpose:

These planes act like **UI surfaces or spatial data layers**.

They should feel like **information architecture appearing in space**.

Animations:

- opacity fade
- slow positional drift
- occasional appearance/disappearance

---

## 2. People

People are represented as **black silhouettes**.

Characteristics:

- simple human outlines
- no detail
- facing toward the screen
- slightly different heights and stances

Movement:

People do **not need to walk or animate**.

Instead they:

- fade in
- fade out
- appear in groups

Population states:
Few people state: 2–3 silhouettes
Medium state: 5–6 silhouettes
Crowded state: 8–10 silhouettes

Placement:

People should appear within the viewing area in front of the screen.

---

## 3. The Screen

The screen is the focal point of the scene.

Characteristics:

- glowing blue display
- rectangular format

Possible aspect ratios:
16:9
9:16

The screen contains **wireframe UI content blocks**.

Content elements should be represented as **simple rectangles**.

---

# Screen Content Types

The screen adapts based on crowd density.

## Maximum Content (few people)

Layout:

- large headline
- subtitle
- three content blocks

Each content block includes:

- title
- paragraph placeholder
- image placeholder

Representation:

Rectangular wireframe shapes.

---

## Medium Content

Layout:

- headline
- subtitle
- one or two content blocks

---

## Minimal Content (crowded)

Layout:

- large headline only

---

# Animation Behavior

The entire scene should run as a **looping animation**.

Recommended loop duration:
20–30 seconds
---

# Scene Timeline

Example cycle:

### Phase 1 — Few people

- 2–3 silhouettes
- maximum screen content
- multiple floating planes
- space feels open

### Phase 2 — Increasing audience

- silhouettes fade in
- screen content simplifies
- some planes disappear

### Phase 3 — Crowd

- many silhouettes
- minimal screen content
- fewer spatial planes

### Phase 4 — Return to minimal crowd

- silhouettes fade out
- screen content expands again
- planes reappear

Loop seamlessly back to phase 1.

---

# Camera

The camera slowly orbits the scene.

Movement pattern:
left → center → right → center
Characteristics:

- very slow
- smooth
- continuous
- loopable

Suggested orbit duration:
one full cycle per animation loop
---

# Lighting

Lighting should remain subtle.

Suggested approach:

- dark environment
- emissive materials for UI
- light bloom for screen
- silhouettes remain dark

---

# Rendering Style

Important characteristics:

- technical
- minimal
- architectural
- diagrammatic

Avoid photorealism.

Focus on **line graphics and spatial clarity**.

---

# Technical Stack

Preferred stack:
Three.js
WebGL

Suggested helpers:
OrbitControls (optional)
EffectComposer
BloomPass

Optional libraries:
gsap
for smooth transitions.

---

# Animation System

Animation should be **state-driven** rather than random.

Recommended system:
sceneState = {
crowdLevel: few | medium | many
screenContent: max | medium | minimal
}
Transitions between states should be animated.

---

# Performance Considerations

The scene must remain lightweight.

Guidelines:

- reuse geometry where possible
- limit polygon counts
- use instancing for silhouettes if needed
- use simple materials

---

# Output

The final animation should:

- loop seamlessly
- render in real-time
- be recordable from the browser canvas

Recording options:
canvas.captureStream()
MediaRecorder or external screen capture.

Recommended resolution:
1920 x 1080
or
3840 x 2160

---

# Deliverables

Claude Code should generate:

1. Three.js project scaffold
2. Scene setup
3. Environment grid system
4. Floating plane system
5. Silhouette system
6. Adaptive screen component
7. Animation timeline
8. Camera orbit animation
9. Loop-safe timing system

---

# Optional Future Extensions

Potential improvements later:

- real sensor-driven audience detection
- dynamic content generation
- UI motion design improvements
- interactive installations
- projection environments

---

# Summary

The project visualizes a **responsive digital display adapting to audience presence**.

Key ideas:

- spatial wireframe environment
- silhouettes representing viewers
- adaptive screen content
- architectural diagram aesthetic
- slow looping motion

The result should feel like a **conceptual installation prototype** or **future exhibition visualization**.