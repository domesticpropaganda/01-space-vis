import { LOOP_DURATION } from './state.js'
import { SCREEN_POS } from './screen.js'

export const CAM_PARAMS = {
  orbitX: 4.5,   // max lateral offset
  baseY:  1.4,   // camera height
  swayY:  0.2,   // vertical sway amplitude
  camZ:   11.0,   // camera depth
}

export function updateCamera(camera, elapsed) {
  const phase = (elapsed / LOOP_DURATION) * Math.PI * 2
  camera.position.x = Math.sin(phase) * CAM_PARAMS.orbitX
  camera.position.y = CAM_PARAMS.baseY + Math.sin(phase * 2 + 0.5) * CAM_PARAMS.swayY
  camera.position.z = CAM_PARAMS.camZ
  camera.lookAt(SCREEN_POS)
}
