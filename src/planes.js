import * as THREE from 'three'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { scene } from './scene.js'
import { COLORS } from './colors.js'

const { PI } = Math

// Wall-mounted secondary displays.
// Indices 0–7 are preserved — state.js dims 4,5 in MANY and 6,7 in MEDIUM+MANY.
const DEFS = [
  // ── LEFT WALL  (x=-6.4, rotY=+π/2 → normal faces +X into room) ─────────────
  { pos: [-6.4,  0.8, -0.5], size: [2.8, 2.2], grid: [2, 3], rotY:  PI/2, rotX: 0, base: 0.10, dA: 0.07, dS: 0.28 }, // 0 large
  { pos: [-6.4,  0.8,  1.8], size: [1.8, 1.4], grid: [3, 1], rotY:  PI/2, rotX: 0, base: 0.08, dA: 0.06, dS: 0.35 }, // 1 medium
  // ── RIGHT WALL (x=+6.4, rotY=-π/2 → normal faces -X into room) ─────────────
  { pos: [ 6.4,  0.8, -0.5], size: [2.4, 2.0], grid: [2, 3], rotY: -PI/2, rotX: 0, base: 0.09, dA: 0.07, dS: 0.31 }, // 2 large
  { pos: [ 6.4, -0.4,  1.5], size: [1.8, 1.4], grid: [3, 1], rotY: -PI/2, rotX: 0, base: 0.07, dA: 0.05, dS: 0.42 }, // 3 medium
  // ── FRONT WALL (z=+5.8, rotY=0 → normal faces +Z toward audience) ───────────
  { pos: [-2.0,  1.8,  5.8], size: [1.0, 0.8], grid: [2, 2], rotY:  0,    rotX: 0, base: 0.08, dA: 0.08, dS: 0.25 }, // 4 accent L (dims in MANY)
  { pos: [ 2.0,  1.6,  5.8], size: [1.2, 0.8], grid: [4, 1], rotY:  0,    rotX: 0, base: 0.07, dA: 0.07, dS: 0.38 }, // 5 accent R (dims in MANY)
  // ── LEFT / RIGHT BACKGROUND (further back, dims in MEDIUM+MANY) ─────────────
  { pos: [-6.4,  0.3, -3.5], size: [2.0, 1.8], grid: [2, 4], rotY:  PI/2, rotX: 0, base: 0.06, dA: 0.05, dS: 0.22 }, // 6 bg L
  { pos: [ 6.4,  0.2, -3.0], size: [1.8, 1.6], grid: [3, 2], rotY: -PI/2, rotX: 0, base: 0.06, dA: 0.06, dS: 0.30 }, // 7 bg R
]

// SVG content shown on side-wall planes per animation state
// key must match what state.js reads from plane.contentMats
const CONTENT_DEFS = {
  0: [
    { url: '/images/side-2x3-medium-left.svg', key: 'medium', svgW: 400, svgH: 600 },
    { url: '/images/side-2x3-small-left.svg',  key: 'small',  svgW: 400, svgH: 600 },
  ],
  1: [{ url: '/images/side-3x1-xsmall-left.svg',  key: 'xsmall', svgW: 600, svgH: 200 }],
  2: [
    { url: '/images/side-2x3-medium-right.svg', key: 'medium', svgW: 400, svgH: 600 },
    { url: '/images/side-2x3-small-right.svg',  key: 'small',  svgW: 400, svgH: 600 },
  ],
  3: [{ url: '/images/side-3x1-xsmall-right.svg', key: 'xsmall', svgW: 600, svgH: 200 }],
}

const svgLoader = new SVGLoader()

const planes = []
const annoMats = []
const svgContentMats = []

function attachSvgContent(group, gw, gh, entries) {
  // Solid background that matches the screen fill — fades in with content
  const panelBgMat = new THREE.MeshBasicMaterial({
    color: COLORS.screenBg,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  })
  const bgMesh = new THREE.Mesh(new THREE.PlaneGeometry(gw, gh), panelBgMat)
  bgMesh.position.z = 0.015
  group.add(bgMesh)

  const contentMats = { panelBg: panelBgMat }
  entries.forEach(({ url, key, svgW, svgH }) => {
    const mat = new THREE.MeshBasicMaterial({
      color: COLORS.screenUI,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    contentMats[key] = mat

    const scale = gh / svgH
    const svgGroup = new THREE.Group()
    svgGroup.scale.set(scale, -scale, 1)
    svgGroup.position.set(-svgW * 0.5 * scale, svgH * 0.5 * scale, 0.03)
    group.add(svgGroup)

    svgLoader.load(url, data => {
      const geos = []
      data.paths.forEach(path => {
        SVGLoader.createShapes(path).forEach(shape => {
          geos.push(new THREE.ShapeGeometry(shape))
        })
      })
      if (geos.length > 0) {
        const merged = mergeGeometries(geos)
        const mesh = new THREE.Mesh(merged, mat)
        mesh.renderOrder = 1
        svgGroup.add(mesh)
        geos.forEach(g => g.dispose())
      }
    })
  })
  return contentMats
}

export function createPlanes() {
  DEFS.forEach((def, i) => {
    const group = new THREE.Group()

    const { pts: linePts, gw, gh } = buildPlaneLines(def.size[0], def.size[1], def.grid[0], def.grid[1])

    // Fill uses the actual square-grid footprint, not the raw size
    const fillMat = new THREE.MeshBasicMaterial({
      color: COLORS.planeFill,
      transparent: true,
      opacity: def.base,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    group.add(new THREE.Mesh(new THREE.PlaneGeometry(gw, gh), fillMat))

    // Border + interior grid lines share one material
    const wireMat = new THREE.LineBasicMaterial({
      color: COLORS.planeWire,
      transparent: true,
      opacity: def.base * 3,
    })

    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePts, 3))
    group.add(new THREE.LineSegments(lineGeo, wireMat))

    // Measurement reference lines on selected planes
    if ([0, 2, 7].includes(i)) {
      addMeasureLines(group, gw, gh, annoMats)
    } else {
      addEdgeMarkers(group, gw, gh, def.pos[1], annoMats)
    }

    group.position.set(...def.pos)
    group.rotation.y = def.rotY
    group.rotation.x = def.rotX
    scene.add(group)

    const contentMats = CONTENT_DEFS[i]
      ? attachSvgContent(group, gw, gh, CONTENT_DEFS[i])
      : {}

    // Collect svg content mats (excluding panelBg) for GUI color control
    Object.entries(contentMats).forEach(([key, mat]) => {
      if (key !== 'panelBg') svgContentMats.push(mat)
    })

    planes.push({
      group,
      fillMat,
      wireMat,
      baseOpacity: def.base,
      wireBaseOpacity: def.base * 3,
      baseY: def.pos[1],
      driftOffset: i * 1.37,
      driftAmp: def.dA,
      driftSpeed: def.dS,
      contentMats,
    })
  })

  return { update, getAll: () => planes, annoMats, svgContentMats }
}

function update(elapsed) {
  planes.forEach(p => {
    p.group.position.y = p.baseY + Math.sin(elapsed * p.driftSpeed + p.driftOffset) * p.driftAmp
  })
}

// Blueprint-style measurement lines: dashed, extend slightly past panel edges
function addMeasureLines(group, gw, gh, annoMats) {
  const dashMat = new THREE.LineDashedMaterial({
    color: COLORS.planeWire,
    transparent: true,
    opacity: 0.35,
    dashSize: 0.07,
    gapSize: 0.05,
  })
  annoMats.push(dashMat)
  const z = 0.02 // slightly in front of panel surface

  const hw = gw / 2
  const hh = gh / 2

  // Horizontal dimension line — runs along the bottom edge, overshoots casually
  const overL = 0.28 + Math.random() * 0.08
  const overR = 0.16 + Math.random() * 0.10
  const lineY = -hh - 0.22
  const hLine = makeMeasureLine(
    new THREE.Vector3(-hw - overL, lineY, z),
    new THREE.Vector3( hw + overR, lineY, z),
    dashMat
  )
  group.add(hLine)

  // Vertical dimension line — runs along the right edge, overshoots casually
  const overB = 0.20 + Math.random() * 0.08
  const overT = 0.28 + Math.random() * 0.10
  const lineX = hw + 0.22
  const vLine = makeMeasureLine(
    new THREE.Vector3(lineX, -hh - overB, z),
    new THREE.Vector3(lineX,  hh + overT, z),
    dashMat
  )
  group.add(vLine)

  // Small tick crosses at the four dimension line endpoints
  const tickMat = new THREE.LineBasicMaterial({
    color: COLORS.planeWire,
    transparent: true,
    opacity: 0.30,
  })
  annoMats.push(tickMat)
  const tickLen = 0.09
  // Horizontal line endpoints
  group.add(makeCross(-hw - overL, lineY, z, tickLen, tickMat))
  group.add(makeCross( hw + overR, lineY, z, tickLen, tickMat))
  // Vertical line endpoints
  group.add(makeCross(lineX, -hh - overB, z, tickLen, tickMat))
  group.add(makeCross(lineX,  hh + overT, z, tickLen, tickMat))
}

// Vertical edge markers: dashed lines spanning floor→ceiling in world space
function addEdgeMarkers(group, gw, _gh, groupY, annoMats) {
  const dashMat = new THREE.LineDashedMaterial({
    color: COLORS.planeWire,
    transparent: true,
    opacity: 0.32,
    dashSize: 0.07,
    gapSize: 0.05,
  })
  const arrowMat = new THREE.LineBasicMaterial({
    color: COLORS.planeWire,
    transparent: true,
    opacity: 0.28,
  })
  annoMats.push(dashMat, arrowMat)

  const z = 0.02
  const hw = gw / 2

  // Convert world floor/ceiling to panel-local Y, with a small casual overshoot
  const topY = (3.5 - groupY) + 0.12 + Math.random() * 0.10
  const botY = (-2.5 - groupY) - 0.12 - Math.random() * 0.10

  for (const x of [-hw, hw]) {
    group.add(makeMeasureLine(new THREE.Vector3(x, botY, z), new THREE.Vector3(x, topY, z), dashMat))
    group.add(makeArrow(x, topY, z, 'up',   arrowMat))
    group.add(makeArrow(x, botY, z, 'down', arrowMat))
  }
}

function makeArrow(x, y, z, dir, mat) {
  const aw = 0.07 // half-width of chevron
  const ah = 0.11 // height of chevron
  const sy = dir === 'up' ? -1 : 1
  const pts = [
    x - aw, y + sy * ah, z,  x, y, z,
    x + aw, y + sy * ah, z,  x, y, z,
  ]
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  return new THREE.LineSegments(geo, mat)
}

function makeMeasureLine(from, to, mat) {
  const geo = new THREE.BufferGeometry().setFromPoints([from, to])
  const line = new THREE.Line(geo, mat)
  line.computeLineDistances()
  return line
}

function makeCross(x, y, z, len, mat) {
  const pts = [
    x - len, y, z,  x + len, y, z,
    x, y - len, z,  x, y + len, z,
  ]
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  return new THREE.LineSegments(geo, mat)
}

// Returns border + interior grid lines with square cells.
// Cell size = min(w/gX, h/gY). Border and fill both use the grid footprint.
function buildPlaneLines(w, h, gX, gY) {
  const cell = Math.min(w / gX, h / gY)
  const gw = cell * gX
  const gh = cell * gY
  const hw = gw / 2, hh = gh / 2
  const pts = []

  // Border exactly matches the grid footprint
  pts.push(
    -hw, -hh, 0,   hw, -hh, 0,
     hw, -hh, 0,   hw,  hh, 0,
     hw,  hh, 0,  -hw,  hh, 0,
    -hw,  hh, 0,  -hw, -hh, 0,
  )

  // Interior vertical dividers
  for (let i = 1; i < gX; i++) {
    const x = -hw + cell * i
    pts.push(x, -hh, 0, x, hh, 0)
  }
  // Interior horizontal dividers
  for (let i = 1; i < gY; i++) {
    const y = -hh + cell * i
    pts.push(-hw, y, 0, hw, y, 0)
  }

  return { pts, gw, gh }
}
