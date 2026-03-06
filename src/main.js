import * as THREE from 'three'
import { scene, camera, composer, bloomPass, onResize } from './scene.js'
import { createGrainPass } from './grain.js'
import { createEnvironment }  from './environment.js'
import { createPlanes }       from './planes.js'
import { createSilhouettes }  from './silhouettes.js'
import { createScreen }       from './screen.js'
import { createDesk }         from './desk.js'
import { startStateTimeline } from './state.js'
import { updateCamera }       from './camera.js'
import { createControls }     from './controls.js'

// Loading manager — hides the #loader overlay when all SVGs are done
const loaderEl = document.getElementById('loader')
const manager  = new THREE.LoadingManager()
manager.onLoad = () => {
  loaderEl.classList.add('hidden')
  loaderEl.addEventListener('transitionend', () => loaderEl.remove(), { once: true })
}

// Build scene elements
const envMats     = createEnvironment()
const planes      = createPlanes(manager)
const silhouettes = createSilhouettes(manager)
const screen      = createScreen(manager)
const desk        = createDesk()

// Add grain post-processing pass (after bloom)
const grainPass = createGrainPass()
composer.addPass(grainPass)

// Controls panel
createControls({
  scene,
  bloomPass,
  grainPass,
  envMats,
  planeMats: planes.getAll(),
  planeAnnoMats: planes.annoMats,
  planeSvgMats: planes.svgContentMats,
  screenMats: screen,
  deskMats:   desk,
  silsMgr: silhouettes,
})

// Start the state-driven animation timeline
startStateTimeline(silhouettes, screen, planes, desk)

// Resize handling
window.addEventListener('resize', onResize)

// Render loop
const startTime = performance.now()

function animate() {
  requestAnimationFrame(animate)
  const elapsed = (performance.now() - startTime) / 1000
  updateCamera(camera, elapsed)
  silhouettes.billboard(camera)
  planes.update(elapsed)
  grainPass.uniforms.time.value = elapsed
  composer.render()
}

animate()
