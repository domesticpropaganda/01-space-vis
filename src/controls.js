import GUI from 'lil-gui'
import { COLORS, BLOOM, GRAIN } from './colors.js'
import { CAM_PARAMS } from './camera.js'

export function createControls({ scene, bloomPass, grainPass, envMats, planeMats, planeAnnoMats, planeSvgMats, screenMats, silsMgr, deskMats }) {
  const gui = new GUI({ title: 'Scene Controls', width: 260 })

  // ── Scene ──────────────────────────────────────────────────────────────────
  const sceneF = gui.addFolder('Scene')
  const sceneP = { background: COLORS.background }
  sceneF.addColor(sceneP, 'background').name('Background').onChange(v => scene.background.set(v))

  // ── Environment ────────────────────────────────────────────────────────────
  const envF = gui.addFolder('Environment')
  const envP = { grid: COLORS.grid, structure: COLORS.structure }
  

  envF.addColor(envP, 'grid').name('Grid').onChange(v => {
    envMats.floorMat.color.set(v)
    envMats.ceilMat.color.set(v)
  })
  envF.addColor(envP, 'structure').name('Structure lines').onChange(v => {
    envMats.structMat.color.set(v)
  })
  envF.close()
  // ── Screen ─────────────────────────────────────────────────────────────────
  const screenF = gui.addFolder('Screen')
  const screenP = {
    background: COLORS.screenBg,
    border:     COLORS.screenBorder,
    uiLines:    COLORS.screenUI,
  }

  screenF.addColor(screenP, 'background').name('Background').onChange(v => {
    screenMats.bgMat.color.set(v)
  })
  screenF.addColor(screenP, 'border').name('Border').onChange(v => {
    screenMats.glowBorderMat.color.set(v)
    screenMats.innerBorderMat.color.set(v)
  })
  screenF.addColor(screenP, 'uiLines').name('UI lines').onChange(v => {
    screenMats.contentMats.forEach(m => m.color.set(v))
    planeSvgMats.forEach(m => m.color.set(v))
  })
screenF.close()
  // ── Planes ─────────────────────────────────────────────────────────────────
  const planesF = gui.addFolder('Planes')
  const planesP = { fill: COLORS.planeFill, wire: COLORS.planeWire }

  planesF.addColor(planesP, 'fill').name('Fill').onChange(v => {
    planeMats.forEach(p => p.fillMat.color.set(v))
  })
  planesF.addColor(planesP, 'wire').name('Wire').onChange(v => {
    planeMats.forEach(p => p.wireMat.color.set(v))
    planeAnnoMats.forEach(m => m.color.set(v))
  })
planesF.close()
  // ── Desk ───────────────────────────────────────────────────────────────────
  const deskF = gui.addFolder('Desk')
  const deskP = { fill: COLORS.deskFill }
  deskF.addColor(deskP, 'fill').name('Fill').onChange(v => deskMats.fillMat.color.set(v))
  deskF.close()

  // ── Silhouettes ────────────────────────────────────────────────────────────
  const silsF = gui.addFolder('Silhouettes')
  const silsP = { fill: COLORS.silhouetteFill, outline: COLORS.silhouetteOutline }

  silsF.addColor(silsP, 'fill').name('Fill').onChange(v => silsMgr.setFillColor(v))
  silsF.addColor(silsP, 'outline').name('Outline').onChange(v => silsMgr.setOutlineColor(v))
silsF.close()
  // ── Camera ─────────────────────────────────────────────────────────────────
  const camF = gui.addFolder('Camera')
  camF.add(CAM_PARAMS, 'orbitX', 0, 8,   0.1).name('Orbit X')
  camF.add(CAM_PARAMS, 'baseY',  0, 5,   0.1).name('Height')
  camF.add(CAM_PARAMS, 'swayY',  0, 1,   0.01).name('Sway Y')
  camF.add(CAM_PARAMS, 'camZ',   4, 20,  0.1).name('Distance Z')

  // ── Grain ──────────────────────────────────────────────────────────────────
  const grainF = gui.addFolder('Grain')
  const grainP = { intensity: GRAIN.intensity, speed: GRAIN.speed }
  grainF.add(grainP, 'intensity', 0, 0.5, 0.01).name('Intensity').onChange(v => { grainPass.uniforms.intensity.value = v })
  grainF.add(grainP, 'speed',     0, 5,   0.1 ).name('Speed')    .onChange(v => { grainPass.uniforms.speed.value     = v })
grainF.close()
  // ── Bloom ──────────────────────────────────────────────────────────────────
  const bloomF = gui.addFolder('Bloom')
  const bloomP = { strength: BLOOM.strength, threshold: BLOOM.threshold, radius: BLOOM.radius }

  bloomF.add(bloomP, 'strength',  0, 3,   0.01).name('Strength') .onChange(v => { bloomPass.strength  = v })
  bloomF.add(bloomP, 'threshold', 0, 1,   0.01).name('Threshold').onChange(v => { bloomPass.threshold = v })
  bloomF.add(bloomP, 'radius',    0, 1.5, 0.01).name('Radius')   .onChange(v => { bloomPass.radius    = v })
bloomF.close()
  return gui
}
