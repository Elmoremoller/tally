/**
 * The dotted field behind the landing page's hero, and, held still, behind the quiz: small squares in the
 * brand colours, thick toward the edges and thinning out toward a clear middle. Density is turned into dots
 * with an ordered dither, so a slow change in density reads as dots switching on and off, not as a fade.
 * This only draws; the component owns the canvas, the clock and when to stop.
 */

type Rgb = readonly [number, number, number];

export type DotPalette = { tan: Rgb; dusty: Rgb; sky: Rgb };

export type DotLook = {
  /** Seconds into the motion. A field held still is just one fixed moment. */
  t: number;
  /** How far the edge of the field slides back and forth, and how strongly its density swells in waves. 0 holds each still. */
  drift: number;
  pulse: number;
  /** Scales the squares' size and opacity. 1 is the hero; less is a quiet backdrop. */
  size: number;
  alpha: number;
  /**
   * The clear middle: half its width and half its height, and how far the dots take to come back in, all in
   * px. It is centred on the canvas unless `cx` and `cy` say where.
   */
  clear: { x: number; y: number; feather: number; cx?: number; cy?: number };
};

const FALLBACK: DotPalette = { tan: [166, 138, 105], dusty: [122, 144, 168], sky: [174, 202, 232] };

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
  const { t, drift, pulse, size, alpha, clear } = look;
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

  // Where the thick edge begins (it slides), and the top patch (it slides and swells)
  const edge = 0.6 + drift * 0.09 * Math.sin(t * 0.55);
  const patchX = (0.3 + drift * 0.06 * Math.sin(t * 0.4)) * width;
  const patchR = (0.3 + pulse * 0.04 * Math.sin(t * 1.5)) * width;

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

      const nx = x / width;
      const ny = y / height;
      let density = Math.pow(smooth(edge, 1.02, nx), 0.85) * (0.85 + 0.15 * Math.sin(ny * 5 + t * 0.8 * drift));
      density += 0.7 * Math.max(0, 1 - Math.hypot(x - patchX, y * 1.3) / patchR);
      density += 0.6 * Math.max(0, 1 - Math.hypot(x - 0.02 * width, (y - height) * 1.3) / (0.22 * width));
      density *= 1 + pulse * 0.45 * Math.sin(t * 1.5 - nx * 3.2 + ny * 1.5);
      density = Math.min(1, density * open);

      if (density <= 0.02 || density <= (BAYER[(row & 3) * 4 + (col & 3)] + 0.5) / 16) continue;

      const side = (2 + density * 5) * size;
      const tone = scatter(col, row);
      ctx.fillStyle = tone < 0.2 ? fills.tan : tone < 0.62 ? fills.dusty : fills.sky;
      ctx.fillRect(x - side / 2, y - side / 2, side, side);
    }
  }
}
