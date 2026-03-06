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

// Build scene elements
const envMats     = createEnvironment()
const planes      = createPlanes()
const silhouettes = createSilhouettes()
const screen      = createScreen()
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
