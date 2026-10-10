/**
 * Design layout for the 1080×1920 canvas (px). Everything important stays
 * between y = 220 (safe top) and y = 1540 (safe bottom).
 */
export type Slot = { x: number; y: number; size: number };

export const PHONE = { width: 780, height: 1260, top: 262, tilt: -4 } as const;

export const OFFER_LAYOUT = {
  price: { x: 540, y: 560, fontSize: 300 },
  sizeLabel: { x: 860, y: 402, rotate: 8 },
  count: { x: 540, y: 805, fontSize: 84 },
  pizzas: [
    { x: 258, y: 1085, size: 330 },
    { x: 540, y: 1060, size: 390 },
    { x: 822, y: 1085, size: 330 },
  ] as Slot[],
  delivery: { x: 540, y: 1388, scale: 1 },
} as const;

export const CTA_LAYOUT = {
  price: { x: 540, y: 492, fontSize: 92 },
  sizeLabel: { x: 760, y: 450, rotate: 8 },
  count: { x: 540, y: 590, fontSize: 46 },
  delivery: { x: 540, y: 665, scale: 0.58 },
  ctaLine: { y: 825, fontSize: 68 },
  button: { y: 990, width: 990, height: 196, fontSize: 102 },
  pizzas: [
    { x: 250, y: 1340, size: 270 },
    { x: 540, y: 1320, size: 310 },
    { x: 830, y: 1340, size: 270 },
  ] as Slot[],
} as const;

export const LOGO_LAYOUT = {
  small: { left: 64, top: 236, width: 300, height: 96 },
  big: { width: 560, height: 168, top: 236 },
} as const;
