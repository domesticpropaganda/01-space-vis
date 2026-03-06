import * as THREE from 'three'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'
import { scene } from './scene.js'
import { COLORS } from './colors.js'

const POSITIONS = [
  // ── Group A: close to camera (z ≈ 3.0–3.9) — first 12 visible ──────────────
  [-4.00, -2.5,  3.5],
  [-1.60, -2.5,  3.2],
  [ 0.30, -2.5,  3.8],
  [ 1.80, -2.5,  3.0],
  [ 3.60, -2.5,  3.5],
  [-0.60, -2.5,  3.1],
  [-2.80, -2.5,  3.6],
  [ 2.40, -2.5,  3.3],
  [-3.30, -2.5,  3.9],
  [ 0.90, -2.5,  3.7],
  [ 3.00, -2.5,  3.2],
  [-1.10, -2.5,  3.4],
  // ── Group B: mid distance (z ≈ 0.5–1.9) — appear at MEDIUM ─────────────────
  [-3.80, -2.5,  0.8],
  [-1.20, -2.5,  1.4],
  [ 0.60, -2.5,  0.5],
  [ 2.80, -2.5,  1.1],
  [-0.40, -2.5,  1.9],
  [ 4.20, -2.5,  1.7],
  // ── Group C: near screen (z ≈ -1.0 to -2.5) — appear at MANY ───────────────
  [-3.00, -2.5, -1.2],
  [-0.60, -2.5, -2.0],
  [ 0.50, -2.5, -1.5],
  [ 2.50, -2.5, -2.4],
  [-1.80, -2.5, -1.8],
  [ 1.50, -2.5, -1.0],
  // ── Group D: wide flanks, near screen — appear at XSMALL ────────────────────
  [-5.00, -2.5, -1.0],
  [ 4.80, -2.5, -0.5],
  [-4.60, -2.5, -1.8],
  [ 5.00, -2.5, -2.5],
  [-4.80, -2.5, -3.0],
  [ 4.70, -2.5, -1.5],
  // ── Group E: deep, close to screen — appear at XSMALL ───────────────────────
  [-2.20, -2.5, -3.2],
  [ 1.00, -2.5, -3.5],
  [-0.20, -2.5, -3.8],
  [ 3.20, -2.5, -3.0],
  [-3.50, -2.5, -3.4],
  [ 2.00, -2.5, -3.7],
  // ── Desk staff: behind the desk, appears with it ─────────────────────────
  [ 0.00, -2.5, -3.75],
]

const HEIGHTS = Array(37).fill(2.5)

export function createSilhouettes() {
  const loader = new SVGLoader()
  const groups = []
  const fillMats = []
  const outlineMats = []

  const DESK_STAFF = POSITIONS.length - 1  // last entry — behind the desk

  POSITIONS.forEach((_, i) => {
    const staff = i === DESK_STAFF
    const v = Math.floor(69 + Math.random() * 21)  // 69–89 in sRGB
    const col = (v << 16) | (v << 8) | v            // e.g. 0x454545–0x595959
    fillMats.push(new THREE.MeshBasicMaterial({
      color: col,
      transparent: true,
      opacity: i < 6 ? 1 : 0,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: staff,   // staff lets the desk occlude them
    }))
    outlineMats.push(new THREE.LineBasicMaterial({
      color: COLORS.silhouetteOutline,
      transparent: true,
      opacity: i < 6 ? 0.8 : 0,
      depthWrite: false,
      depthTest: staff,
    }))
  })

  // Proxy: state.js tweens .opacity 0→1 / 1→0 for fade in/out.
  // Visibility is only ever set to true here — never back to false —
  // so opacity→0 produces a smooth fade rather than an instant pop.
  const meshes = POSITIONS.map((_, i) => ({
    material: {
      get opacity() { return fillMats[i].opacity },
      set opacity(v) {
        fillMats[i].opacity = v
        outlineMats[i].opacity = v * 0.8
        if (groups[i] && v > 0) groups[i].visible = true
      },
    },
  }))

  POSITIONS.forEach((pos, i) => {
    const h = HEIGHTS[i]
    const group = new THREE.Group()
    group.position.set(pos[0], pos[1] + h / 2, pos[2])
    group.scale.x = Math.random() < 0.5 ? 1 : -1
    group.visible = i < 6
    scene.add(group)
    groups.push(group)

    loader.load(`${import.meta.env.BASE_URL}images/S${i % 18}.svg`, (data) => {
      const vb = data.xml?.getAttribute('viewBox')?.split(' ').map(Number)
      const svgW = vb?.[2] ?? 62
      const svgH = vb?.[3] ?? 268
      const scale = h / svgH

      // SVG Y increases downward; flip with negative Y scale and offset to centre
      const tg = new THREE.Group()
      tg.scale.set(scale, -scale, 1)
      tg.position.set(-svgW * 0.5 * scale, svgH * 0.5 * scale, 0)
      group.add(tg)

      data.paths.forEach(path => {
        // Skip light paths (grey stroke-simulation fills, white mask paths)
        const c = path.color
        if (c.r + c.g + c.b > 0.5) return

        SVGLoader.createShapes(path).forEach(shape => {
          const mesh = new THREE.Mesh(new THREE.ShapeGeometry(shape), fillMats[i])
          mesh.renderOrder = 1
          tg.add(mesh)

          const pts = shape.getPoints(12)
          const outline = new THREE.LineLoop(
            new THREE.BufferGeometry().setFromPoints(pts),
            outlineMats[i]
          )
          outline.position.z = 0.01
          outline.renderOrder = 1
          tg.add(outline)
        })
      })
    })
  })

  return {
    meshes,
    billboard(camera) {
      groups.forEach(g => g.quaternion.copy(camera.quaternion))
    },
    setFillColor(v)    { fillMats.forEach(m => m.color.set(v)) },
    setOutlineColor(v) { outlineMats.forEach(m => m.color.set(v)) },

  }
}
