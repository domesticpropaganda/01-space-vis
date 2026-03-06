import * as THREE from 'three'
import { scene } from './scene.js'
import { COLORS } from './colors.js'

const W = 3.2   // width
const H = 1.62  // height — chest-height relative to 2.5-unit silhouettes
const D = 0.85  // depth

export function createDesk() {
  const geo      = new THREE.BoxGeometry(W, H, D)
  const edgesGeo = new THREE.EdgesGeometry(geo)

  const fillMat = new THREE.MeshBasicMaterial({ color: COLORS.deskFill })

  const wireMat = new THREE.LineBasicMaterial({
    color:       COLORS.planeWire,
    transparent: true,
    opacity:     0.35,
    depthWrite:  false,
  })

  // Offset meshes up by H/2 so the desk's bottom sits at the group's local origin.
  // Animating group.scale.y 0→1 then grows the desk upward from the floor.
  const inner = new THREE.Group()
  inner.position.y = H / 2
  inner.add(new THREE.Mesh(geo, fillMat))
  inner.add(new THREE.LineSegments(edgesGeo, wireMat))

  const group = new THREE.Group()
  group.position.set(0, -2.5, -3.1)  // origin pinned to floor level
  group.scale.y = 0                   // start collapsed
  group.visible = false
  group.add(inner)

  scene.add(group)

  return { group, fillMat, wireMat }
}
