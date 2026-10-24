/**
 * The dotted field behind the landing page's hero, and, held still, behind the quiz: small squares in the
 * brand colours, gathered in soft lobes that circle a clear middle. Density is turned into dots with an
 * ordered dither, so a slow change in density reads as dots switching on and off, not as a fade. This only
 * draws; the component owns the canvas, the clock and when to stop.
 */

type Rgb = readonly [number, number, number];

export type DotPalette = { tan: Rgb; dusty: Rgb; sky: Rgb };

export type DotLook = {
  /** Seconds into the motion. A field held still is just one fixed moment. */
  t: number;
  /** Scales the squares' size and opacity. 1 is the hero; less is a quiet backdrop. */
  size: number;
  alpha: number;
  /**
   * The clear middle: half its width and half its height, and how far the dots take to come back in, all in
   * px. It is centred on the canvas unless `cx` and `cy` say where. The lobes circle this point.
   */
  clear: { x: number; y: number; feather: number; cx?: number; cy?: number };
};

const FALLBACK: DotPalette = { tan: [166, 138, 105], dusty: [122, 144, 168], sky: [174, 202, 232] };

/**
 * The lobes of density, all circling the clear middle clockwise. `start` is where each begins (radians, 0 at
 * the right, growing clockwise), `turn` the seconds it takes to go all the way round, `reach` how far out it
 * orbits as a share of the width and height (past 0.5 it is half off the edge), and `size` its radius as a
 * share of the width (never under 220px, so a phone, where only the top and bottom show, still sees them
 * most of the time). At the start there is a big lobe at the right, two at the left and a small one at the bottom.
 */
const LOBES = [
  { start: 0, turn: 30, reach: [0.5, 0.5], size: 0.26, weight: 1.15 },
  { start: -2.356, turn: 40, reach: [0.46, 0.5], size: 0.21, weight: 0.85 },
  { start: 2.356, turn: 52, reach: [0.5, 0.5], size: 0.17, weight: 0.75 },
  { start: 1, turn: 36, reach: [0.48, 0.5], size: 0.18, weight: 0.8 },
] as const;

/** Bayer 4x4: the thresholds a cell's density is compared with. */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

function hexToRgb(hex: string): Rgb | null {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const n = parseInt(match[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** The three dot colours, read from the brand tokens so the field never drifts from the palette. */
export function readPalette(root: HTMLElement = document.documentElement): DotPalette {
  const style = getComputedStyle(root);
  const pick = (token: string, fallback: Rgb) => hexToRgb(style.getPropertyValue(token)) ?? fallback;
  return {
    tan: pick("--tan", FALLBACK.tan),
    dusty: pick("--dusty-blue", FALLBACK.dusty),
    sky: pick("--sky", FALLBACK.sky),
  };
}

function smooth(from: number, to: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - from) / (to - from)));
  return t * t * (3 - 2 * t);
}

/** A steady pseudo-random number for a cell, so each square keeps its colour from frame to frame. */
function scatter(col: number, row: number) {
  const s = Math.sin(col * 127.1 + row * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function rgba([r, g, b]: Rgb, a: number) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function paintDots(ctx: CanvasRenderingContext2D, width: number, height: number, palette: DotPalette, look: DotLook) {
  const { t, size, alpha, clear } = look;
  const fills = {
    tan: rgba(palette.tan, 0.85 * alpha),
    dusty: rgba(palette.dusty, 0.8 * alpha),
    sky: rgba(palette.sky, alpha),
  };
  const cell = width < 600 ? 10 : 12;
  const cols = Math.ceil(width / cell);
  const rows = Math.ceil(height / cell);
  const midX = clear.cx ?? width / 2;
  const midY = clear.cy ?? height / 2;

  // Each lobe goes round its ellipse, wanders in a small circle of its own, and swells and shrinks a little
  const lobes = LOBES.map((lobe, i) => {
    const angle = lobe.start + (t / lobe.turn) * Math.PI * 2;
    const wander = t * 0.9 + i * 2.1;
    return {
      x: midX + Math.cos(angle) * lobe.reach[0] * width + Math.cos(wander) * 0.025 * width,
      y: midY + Math.sin(angle) * lobe.reach[1] * height + Math.sin(wander) * 0.025 * width,
      r: Math.max(lobe.size * width, 220) * (1 + 0.15 * Math.sin(t * 1.4 + i * 1.7)),
      weight: lobe.weight,
    };
  });

  ctx.clearRect(0, 0, width, height);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = (col + 0.5) * cell;
      const y = (row + 0.5) * cell;

      const open = smooth(
        0,
        1,
        Math.hypot(Math.max(Math.abs(x - midX) - clear.x, 0), Math.max(Math.abs(y - midY) - clear.y, 0)) / clear.feather,
      );
      if (open === 0) continue;

      let density = 0;
      for (const lobe of lobes) density += lobe.weight * Math.max(0, 1 - Math.hypot(x - lobe.x, y - lobe.y) / lobe.r);
      // A two-armed swirl turns through the lobes, so the dots circle inside them too
      density *= 1 + 0.3 * Math.sin(t * 1.2 - 2 * Math.atan2(y - midY, x - midX));
      density = Math.min(1, density * open);

      if (density <= 0.02 || density <= (BAYER[(row & 3) * 4 + (col & 3)] + 0.5) / 16) continue;

      const side = (2 + density * 5) * size;
      const tone = scatter(col, row);
      ctx.fillStyle = tone < 0.2 ? fills.tan : tone < 0.62 ? fills.dusty : fills.sky;
      ctx.fillRect(x - side / 2, y - side / 2, side, side);
    }
  }
}
