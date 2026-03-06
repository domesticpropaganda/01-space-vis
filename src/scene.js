import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { COLORS, BLOOM } from './colors.js'

export const scene = new THREE.Scene()
scene.background = new THREE.Color(COLORS.background)

export const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)
camera.position.set(0, 1.5, 9)
camera.lookAt(0, 0.3, -4)

export const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1.2
// LinearSRGBColorSpace prevents the renderer from re-encoding the final
// ShaderPass output — OutputPass already converts linear → sRGB.
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
document.body.appendChild(renderer.domElement)

const renderPass = new RenderPass(scene, camera)
export const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  BLOOM.strength,
  BLOOM.radius,
  BLOOM.threshold
)

export const composer = new EffectComposer(renderer)
composer.addPass(renderPass)
composer.addPass(bloomPass)
// OutputPass converts the linear HDR render target → tonemapped sRGB.
// Any ShaderPass added after this (e.g. grain) works in display space.
composer.addPass(new OutputPass())

export function onResize() {
  const w = window.innerWidth
  const h = window.innerHeight
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
  composer.setSize(w, h)
}
