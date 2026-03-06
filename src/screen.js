import * as THREE from 'three'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'
import { scene } from './scene.js'
import { COLORS } from './colors.js'

// Screen world position — y raised to keep bottom edge at y=−1.1 after 20% scale
export const SCREEN_POS = new THREE.Vector3(0, 0.58, -4)

// Screen dimensions — matches Figma artboard 1920×1080px, scaled ×1.2
const SW    = 5.974
const SH    = 3.36
const SCALE = SW / 1920  // ≈ 0.00311

// SVG content sits just in front of the screen plane
const Z = 0.025

export function createScreen() {
  const group = new THREE.Group()
  group.position.copy(SCREEN_POS)
  scene.add(group)

  // Dark background fill
  const bgMat = new THREE.MeshBasicMaterial({ color: COLORS.screenBg })
  group.add(new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), bgMat))

  // Glowing border
  const glowBorderMat = new THREE.LineBasicMaterial({
    color: COLORS.screenBorder, transparent: true, opacity: 0.85,
  })
  group.add(new THREE.LineSegments(borderGeo(-SW/2, SH/2, SW/2, -SH/2, 0.005), glowBorderMat))

  // Inner border
  const innerBorderMat = new THREE.LineBasicMaterial({
    color: COLORS.screenBorder, transparent: true, opacity: 0.5,
  })
  group.add(new THREE.LineSegments(
    borderGeo(-(SW/2 - 0.06), SH/2 - 0.06, SW/2 - 0.06, -(SH/2 - 0.06), 0.01),
    innerBorderMat
  ))

  // ── Content layers — two mats per state (header + cards) ────────────────────
  // Materials created synchronously so GSAP can tween them before SVGs load.
  const maxHeaderMat     = svgMat(1);  const maxCardsMat     = svgMat(1)
  const mediumHeaderMat  = svgMat(0);  const mediumCardsMat  = svgMat(0)
  const minimalHeaderMat = svgMat(0);  const minimalCardsMat = svgMat(0)
  const xsmallHeaderMat  = svgMat(0);  const xsmallCardsMat  = svgMat(0)

  const STATES = [
    { mats: [maxHeaderMat,     maxCardsMat    ], files: ['header-full',   'cards-large'  ] },
    { mats: [mediumHeaderMat,  mediumCardsMat ], files: ['header-medium', 'cards-medium' ] },
    { mats: [minimalHeaderMat, minimalCardsMat], files: ['header-small',  'cards-small'  ] },
    { mats: [xsmallHeaderMat,  xsmallCardsMat ], files: ['header-xsmall', 'cards-xsmall' ] },
  ]

  const loader = new SVGLoader()

  STATES.forEach(({ mats, files }) => {
    const stateGroup = new THREE.Group()
    group.add(stateGroup)

    files.forEach((name, fi) => {
      const mat = mats[fi]
      loader.load(`${import.meta.env.BASE_URL}images/${name}.svg`, (data) => {
        // Transform group: scale SVG px → world units, flip Y, center on screen origin
        const tg = new THREE.Group()
        tg.scale.set(SCALE, -SCALE, 1)
        tg.position.set(-1920 * 0.5 * SCALE, 1080 * 0.5 * SCALE, Z + fi * 0.002)
        stateGroup.add(tg)

        data.paths.forEach(path => {
          if (path.userData.style.fill === 'none') return

          // Skip very dark paths — these are artboard background rects from Figma.
          // Layout elements use a mid-range grey; backgrounds are near-black.
          const c = path.color
          if (c.r + c.g + c.b < 0.5) return

          SVGLoader.createShapes(path).forEach(shape => {
            tg.add(new THREE.Mesh(new THREE.ShapeGeometry(shape), mat))
          })
        })
      })
    })
  })

  // Flat array of all content mats — used by controls.js for colour updates
  const contentMats = [
    maxHeaderMat, maxCardsMat,
    mediumHeaderMat, mediumCardsMat,
    minimalHeaderMat, minimalCardsMat,
    xsmallHeaderMat, xsmallCardsMat,
  ]

  return {
    bgMat, glowBorderMat, innerBorderMat, contentMats,
    maxHeaderMat, maxCardsMat,
    mediumHeaderMat, mediumCardsMat,
    minimalHeaderMat, minimalCardsMat,
    xsmallHeaderMat, xsmallCardsMat,
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function svgMat(opacity) {
  return new THREE.MeshBasicMaterial({
    color: COLORS.screenUI,
    transparent: true,
    opacity,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -4,
  })
}

function borderGeo(x1, y1, x2, y2, z) {
  const pts = [
    x1, y1, z,   x2, y1, z,
    x2, y1, z,   x2, y2, z,
    x2, y2, z,   x1, y2, z,
    x1, y2, z,   x1, y1, z,
  ]
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  return geo
}
