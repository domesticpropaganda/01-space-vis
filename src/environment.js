import * as THREE from 'three'
import { scene } from './scene.js'
import { COLORS } from './colors.js'

export function createEnvironment() {
  // Custom grids (uniform color so mat.color.set() works in controls)
  const { mesh: floorMesh, mat: floorMat } = buildGrid(14, 14, COLORS.grid, 0.9)
  floorMesh.position.y = -2.5
  scene.add(floorMesh)

  const { mesh: ceilMesh, mat: ceilMat } = buildGrid(14, 14, COLORS.grid, 0.5)
  ceilMesh.position.y = 3.5
  scene.add(ceilMesh)

  // Vertical corner lines + top frame — shared material
  const structMat = new THREE.LineBasicMaterial({ color: COLORS.structure, transparent: true, opacity: 0.5 })
  const corners = [[-7, -7], [-7, 7], [7, -7], [7, 7]]
  corners.forEach(([x, z]) => scene.add(makeLine([x, -2.5, z], [x, 3.5, z], structMat)))

  const ty = 3.5
  ;[
    [[-7, ty, -7], [ 7, ty, -7]],
    [[ 7, ty, -7], [ 7, ty,  7]],
    [[ 7, ty,  7], [-7, ty,  7]],
    [[-7, ty,  7], [-7, ty, -7]],
  ].forEach(([a, b]) => scene.add(makeLine(a, b, structMat)))

  return { floorMat, ceilMat, structMat }
}

// Custom grid with uniform LineBasicMaterial (no vertex colors)
function buildGrid(size, divs, color, opacity) {
  const step = size / divs
  const half = size / 2
  const pts  = []
  for (let i = 0; i <= divs; i++) {
    const p = -half + step * i
    pts.push(p, 0, -half,   p, 0, half)    // lines parallel to Z
    pts.push(-half, 0, p,   half, 0, p)    // lines parallel to X
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity })
  return { mesh: new THREE.LineSegments(geo, mat), mat }
}

function makeLine(from, to, mat) {
  const geo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(...from),
    new THREE.Vector3(...to),
  ])
  return new THREE.Line(geo, mat)
}
