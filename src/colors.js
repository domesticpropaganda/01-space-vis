// ── Scene colors & bloom settings ─────────────────────────────────────────────
// Edit here to change the look on load.
// controls.js reads these as GUI initial values; all modules import from here.

export const COLORS = {
  background:   '#5c5c5c', // scene background (was #606060)

  grid:         '#999999',
  structure:    '#7a7a7a',
  annotation:   '#7a7a7a',

  screenBg:     '#303030',
  screenBorder: '#949494',
  screenUI:     '#8894a0',

  planeFill:    '#a6a6a6',
  planeWire:    '#bababa',

  deskFill:     '#707070',

  silhouetteFill:    '#454545', // was #4a4a4a
  silhouetteOutline: '#949494',
}

export const BLOOM = {
  strength:  0.2,
  threshold: 0.18,
  radius:    0,
}

export const GRAIN = {
  intensity: 0.05,
  speed:     0,
}
