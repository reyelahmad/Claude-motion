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
  price: { x: 540, y: 562, fontSize: 92 },
  sizeLabel: { x: 765, y: 522, rotate: 8 },
  count: { x: 540, y: 658, fontSize: 46 },
  delivery: { x: 540, y: 732, scale: 0.58 },
  ctaLine: { y: 866, fontSize: 68 },
  button: { y: 1024, width: 990, height: 196, fontSize: 102 },
  pizzas: [
    { x: 250, y: 1352, size: 260 },
    { x: 540, y: 1336, size: 300 },
    { x: 830, y: 1352, size: 260 },
  ] as Slot[],
} as const;

export const LOGO_LAYOUT = {
  small: { left: 60, top: 232, width: 150, height: 150 },
  big: { width: 260, height: 260, top: 226 },
} as const;
