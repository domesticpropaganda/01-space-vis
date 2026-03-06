import gsap from 'gsap'

// Total loop duration — forward pass + reverse pass
export const LOOP_DURATION = 54

/**
 * Timeline (ping-pong):
 *  ── FORWARD ──────────────────────────────────────────────────────────────
 *   0  –  5s  LARGE   (6 silhouettes, max content, all planes)
 *   5  –  8s  LARGE → MEDIUM transition
 *   8  – 13s  MEDIUM  (12 silhouettes, medium content)
 *  13  – 16s  MEDIUM → MANY transition
 *  16  – 20s  MANY    (18 silhouettes, minimal content)
 *  20  – 23s  MANY → XSMALL transition
 *  23  – 27s  XSMALL  (24 silhouettes, xsmall content)
 *  ── REVERSE ──────────────────────────────────────────────────────────────
 *  27  – 31s  XSMALL → MANY
 *  31  – 35s  MANY
 *  35  – 39s  MANY → MEDIUM
 *  39  – 44s  MEDIUM
 *  44  – 48s  MEDIUM → LARGE
 *  48  – 54s  LARGE
 */
export function startStateTimeline(silhouettes, screen, planes, desk) {
  const sils = silhouettes.meshes
  const {
    maxHeaderMat, maxCardsMat,
    mediumHeaderMat, mediumCardsMat,
    minimalHeaderMat, minimalCardsMat,
    xsmallHeaderMat, xsmallCardsMat,
  } = screen
  const CD = 0.75  // cards follow header by this many seconds
  const allPlanes = planes.getAll()

  const ease = 'power2.inOut'
  const tl = gsap.timeline({ repeat: -1, defaults: { ease } })

  // ── Desk — scales up from floor at t=2, collapses at t=44 ───────────────
  tl.call(() => { desk.group.visible = true }, [], 2)
  tl.to(desk.group.scale, { y: 1, duration: 1.5, ease: 'power2.out' }, 2)
  tl.to(desk.group.scale, { y: 0, duration: 1.5, ease: 'power2.in' }, 44)
  tl.call(() => { desk.group.visible = false }, [], 45.5)

  // ── FORWARD PASS ─────────────────────────────────────────────────────────────

  // ── t=5  LARGE → MEDIUM ───────────────────────────────────────────────────
  staggerIn(tl, sils, 6, 18, 5, 2.5)
  tl.to(maxHeaderMat,    { opacity: 0, duration: 1 }, 7)
  tl.to(mediumHeaderMat, { opacity: 1, duration: 1 }, 7)
  tl.to(maxCardsMat,     { opacity: 0, duration: 1 }, 7 + CD)
  tl.to(mediumCardsMat,  { opacity: 1, duration: 1 }, 7 + CD)
  tl.to(allPlanes[6].fillMat, { opacity: 0.018, duration: 2.5 }, 7)
  tl.to(allPlanes[7].fillMat, { opacity: 0.018, duration: 2.5 }, 7)
  tl.to(allPlanes[6].wireMat, { opacity: 0.055, duration: 2.5 }, 7)
  tl.to(allPlanes[7].wireMat, { opacity: 0.055, duration: 2.5 }, 7)
  tl.to(allPlanes[0].contentMats.panelBg, { opacity: 0.88, duration: 1.5 }, 8)
  tl.to(allPlanes[2].contentMats.panelBg, { opacity: 0.88, duration: 1.5 }, 8)
  tl.to(allPlanes[0].contentMats.medium, { opacity: 1, duration: 1.5 }, 8)
  tl.to(allPlanes[2].contentMats.medium, { opacity: 1, duration: 1.5 }, 8)

  // ── t=13  MEDIUM → MANY ───────────────────────────────────────────────────
  staggerIn(tl, sils, 18, 24, 13, 2.5)
  tl.to(mediumHeaderMat,  { opacity: 0, duration: 1 }, 14.5)
  tl.to(minimalHeaderMat, { opacity: 1, duration: 1 }, 14.5)
  tl.to(mediumCardsMat,   { opacity: 0, duration: 1 }, 14.5 + CD)
  tl.to(minimalCardsMat,  { opacity: 1, duration: 1 }, 14.5 + CD)
  tl.to(allPlanes[4].fillMat, { opacity: 0.014, duration: 2.5 }, 14.5)
  tl.to(allPlanes[5].fillMat, { opacity: 0.012, duration: 2.5 }, 14.5)
  tl.to(allPlanes[4].wireMat, { opacity: 0.042, duration: 2.5 }, 14.5)
  tl.to(allPlanes[5].wireMat, { opacity: 0.036, duration: 2.5 }, 14.5)
  tl.to(allPlanes[6].fillMat, { opacity: 0.010, duration: 2.5 }, 14.5)
  tl.to(allPlanes[7].fillMat, { opacity: 0.010, duration: 2.5 }, 14.5)
  tl.to(allPlanes[6].wireMat, { opacity: 0.030, duration: 2.5 }, 14.5)
  tl.to(allPlanes[7].wireMat, { opacity: 0.030, duration: 2.5 }, 14.5)
  tl.to(allPlanes[0].contentMats.medium, { opacity: 0, duration: 1 }, 15.5)
  tl.to(allPlanes[2].contentMats.medium, { opacity: 0, duration: 1 }, 15.5)
  tl.to(allPlanes[0].contentMats.small,  { opacity: 1, duration: 1.5 }, 15.5)
  tl.to(allPlanes[2].contentMats.small,  { opacity: 1, duration: 1.5 }, 15.5)

  // ── t=20  MANY → XSMALL ───────────────────────────────────────────────────
  staggerIn(tl, sils, 24, 36, 20, 2.5)
  tl.to(minimalHeaderMat, { opacity: 0, duration: 1 }, 21.5)
  tl.to(xsmallHeaderMat,  { opacity: 1, duration: 1 }, 21.5)
  tl.to(minimalCardsMat,  { opacity: 0, duration: 1 }, 21.5 + CD)
  tl.to(xsmallCardsMat,   { opacity: 1, duration: 1 }, 21.5 + CD)
  tl.to(allPlanes[0].contentMats.small,   { opacity: 0, duration: 1 }, 22.5)
  tl.to(allPlanes[2].contentMats.small,   { opacity: 0, duration: 1 }, 22.5)
  tl.to(allPlanes[0].contentMats.panelBg, { opacity: 0, duration: 1 }, 22.5)
  tl.to(allPlanes[2].contentMats.panelBg, { opacity: 0, duration: 1 }, 22.5)
  tl.to(allPlanes[1].contentMats.panelBg, { opacity: 0.88, duration: 1.5 }, 22.5)
  tl.to(allPlanes[3].contentMats.panelBg, { opacity: 0.88, duration: 1.5 }, 22.5)
  tl.to(allPlanes[1].contentMats.xsmall,  { opacity: 1, duration: 1.5 }, 22.5)
  tl.to(allPlanes[3].contentMats.xsmall,  { opacity: 1, duration: 1.5 }, 22.5)

  // ── REVERSE PASS ─────────────────────────────────────────────────────────────

  // ── t=27  XSMALL → MANY ───────────────────────────────────────────────────
  staggerOut(tl, sils, 24, 36, 27, 2.5)
  // sils finish at t=32.75 → screen reacts at t=31 (slight overlap, intentional)
  tl.to(xsmallHeaderMat,  { opacity: 0, duration: 1 }, 31)
  tl.to(minimalHeaderMat, { opacity: 1, duration: 1 }, 31)
  tl.to(xsmallCardsMat,   { opacity: 0, duration: 1 }, 31 + CD)
  tl.to(minimalCardsMat,  { opacity: 1, duration: 1 }, 31 + CD)
  tl.to(allPlanes[1].contentMats.xsmall,  { opacity: 0, duration: 1 }, 32)
  tl.to(allPlanes[3].contentMats.xsmall,  { opacity: 0, duration: 1 }, 32)
  tl.to(allPlanes[1].contentMats.panelBg, { opacity: 0, duration: 1 }, 32)
  tl.to(allPlanes[3].contentMats.panelBg, { opacity: 0, duration: 1 }, 32)
  tl.to(allPlanes[0].contentMats.panelBg, { opacity: 0.88, duration: 1.5 }, 32)
  tl.to(allPlanes[2].contentMats.panelBg, { opacity: 0.88, duration: 1.5 }, 32)
  tl.to(allPlanes[0].contentMats.small,   { opacity: 1, duration: 1.5 }, 32)
  tl.to(allPlanes[2].contentMats.small,   { opacity: 1, duration: 1.5 }, 32)

  // ── t=35  MANY → MEDIUM ───────────────────────────────────────────────────
  staggerOut(tl, sils, 18, 24, 35, 2.5)
  // sils finish at t=38.75 → screen reacts at t=39 (state boundary)
  tl.to(minimalHeaderMat, { opacity: 0, duration: 1 }, 39)
  tl.to(mediumHeaderMat,  { opacity: 1, duration: 1 }, 39)
  tl.to(minimalCardsMat,  { opacity: 0, duration: 1 }, 39 + CD)
  tl.to(mediumCardsMat,   { opacity: 1, duration: 1 }, 39 + CD)
  tl.to(allPlanes[4].fillMat, { opacity: 0.08,  duration: 2.5 }, 39)
  tl.to(allPlanes[5].fillMat, { opacity: 0.07,  duration: 2.5 }, 39)
  tl.to(allPlanes[4].wireMat, { opacity: 0.24,  duration: 2.5 }, 39)
  tl.to(allPlanes[5].wireMat, { opacity: 0.21,  duration: 2.5 }, 39)
  tl.to(allPlanes[6].fillMat, { opacity: 0.018, duration: 2.5 }, 39)
  tl.to(allPlanes[7].fillMat, { opacity: 0.018, duration: 2.5 }, 39)
  tl.to(allPlanes[6].wireMat, { opacity: 0.055, duration: 2.5 }, 39)
  tl.to(allPlanes[7].wireMat, { opacity: 0.055, duration: 2.5 }, 39)
  tl.to(allPlanes[0].contentMats.small,  { opacity: 0, duration: 1 }, 40)
  tl.to(allPlanes[2].contentMats.small,  { opacity: 0, duration: 1 }, 40)
  tl.to(allPlanes[0].contentMats.medium, { opacity: 1, duration: 1.5 }, 40)
  tl.to(allPlanes[2].contentMats.medium, { opacity: 1, duration: 1.5 }, 40)

  // ── t=44  MEDIUM → LARGE ──────────────────────────────────────────────────
  staggerOut(tl, sils, 6, 18, 44, 2.5)
  // sils finish at t=47.75 → screen reacts at t=48 (state boundary)
  tl.to(mediumHeaderMat, { opacity: 0, duration: 1 }, 48)
  tl.to(maxHeaderMat,    { opacity: 1, duration: 1 }, 48)
  tl.to(mediumCardsMat,  { opacity: 0, duration: 1 }, 48 + CD)
  tl.to(maxCardsMat,     { opacity: 1, duration: 1 }, 48 + CD)
  tl.to(allPlanes[6].fillMat, { opacity: 0.06, duration: 2.5 }, 48)
  tl.to(allPlanes[7].fillMat, { opacity: 0.06, duration: 2.5 }, 48)
  tl.to(allPlanes[6].wireMat, { opacity: 0.18, duration: 2.5 }, 48)
  tl.to(allPlanes[7].wireMat, { opacity: 0.18, duration: 2.5 }, 48)
  tl.to(allPlanes[0].contentMats.medium, { opacity: 0, duration: 1 }, 49)
  tl.to(allPlanes[2].contentMats.medium, { opacity: 0, duration: 1 }, 49)
  tl.to(allPlanes[0].contentMats.panelBg, { opacity: 0, duration: 1 }, 49)
  tl.to(allPlanes[2].contentMats.panelBg, { opacity: 0, duration: 1 }, 49)

  // Pad timeline to exactly LOOP_DURATION so it repeats cleanly
  tl.set({}, {}, LOOP_DURATION)
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function staggerIn(tl, meshes, start, end, startTime, dur, stagger = 0.25) {
  meshes.slice(start, end).forEach((m, j) => {
    tl.to(m.material, { opacity: 1, duration: dur, ease: 'power2.out' }, startTime + j * stagger)
  })
}

function staggerOut(tl, meshes, start, end, startTime, dur, stagger = 0.25) {
  meshes.slice(start, end).forEach((m, j) => {
    tl.to(m.material, { opacity: 0, duration: dur, ease: 'power2.in' }, startTime + j * stagger)
  })
}
