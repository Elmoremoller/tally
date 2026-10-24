/**
 * The dotted field behind the landing page's hero, and, held still, behind the quiz: a grid of small squares
 * in the brand colours, each growing and shrinking with the density under it (a halftone), laid out in three
 * spiral arms that wind clockwise round a clear middle. The inner part turns faster than the outer, so the
 * arms keep winding rather than spinning like a wheel. In the hero the dots also answer the visitor: they
 * swell and part around the pointer, a click or tap sends a ripple out, and on arrival they sweep in
 * clockwise from the top. This only draws; the component owns the canvas, the clock, the pointer and when
 * to stop.
 */

type Rgb = readonly [number, number, number];

export type DotPalette = { tan: Rgb; dusty: Rgb; sky: Rgb };

/** A small extra clear patch, such as the logo in the header above the hero: its centre and half size, in px. */
export type Hole = { x: number; y: number; halfW: number; halfH: number };

/**
 * The clear middle: half its width and half its height, and how far the dots take to come back in, all in
 * px. It is centred on the canvas unless `cx` and `cy` say where. The arms circle this point. `holes` are
 * kept clear too, with a short feather of their own.
 */
export type Clear = { x: number; y: number; feather: number; cx?: number; cy?: number; holes?: readonly Hole[] };

/** Everything about each square that stays the same from frame to frame, worked out once for a size. */
export type DotGrid = {
  width: number;
  height: number;
  cell: number;
  /** How many squares are outside the clear middle; only the first `count` entries below are used. */
  count: number;
  cx: number;
  cy: number;
  x: Float32Array;
  y: Float32Array;
  /** 0 in the clear middle, rising to 1 well outside it. */
  open: Float32Array;
  /** How much the arms show at this distance from the middle: little close in, full toward the corners. */
  reach: Float32Array;
  /** The angle round the middle, and the way round it at this point (clockwise). */
  angle: Float32Array;
  roundX: Float32Array;
  roundY: Float32Array;
  /** How fast the arms turn here, in radians a second, and how far they have wound by this distance. */
  spin: Float32Array;
  wind: Float32Array;
  /** When the entrance reaches this square: 0 at the top, going clockwise to 1. */
  sweep: Float32Array;
  /** 0 dusty blue, 1 tan, 2 sky. */
  tone: Uint8Array;
};

export type DotFrame = {
  /** Seconds into the motion. A field held still is just one fixed moment. */
  t: number;
  /** Scales the squares' size and opacity. 1 is the hero; less is a quiet backdrop. */
  size: number;
  alpha: number;
  /** The entrance, from 0 (nothing yet) to 1 (done). */
  reveal: number;
  /** Where the dots feel the pointer (or the ghost that stands in for it), and how strongly. */
  pointer: { x: number; y: number; strength: number } | null;
  ripples: readonly { x: number; y: number; born: number }[];
};

/** Seconds a ripple lasts. */
export const RIPPLE_LIFE = 1.8;
/** How far the pointer's pull reaches, how fast a ripple travels and how wide its ring is, in px. */
const POINTER_REACH = 150;
const RIPPLE_SPEED = 400;
const RIPPLE_WIDTH = 30;
/** How far the dots take to come back in round a hole, in px. */
const HOLE_FEATHER = 36;

const FALLBACK: DotPalette = { tan: [166, 138, 105], dusty: [122, 144, 168], sky: [174, 202, 232] };

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

export function makeGrid(width: number, height: number, clear: Clear): DotGrid {
  const cell = width < 600 ? 10 : 12;
  const cols = Math.ceil(width / cell);
  const rows = Math.ceil(height / cell);
  const cx = clear.cx ?? width / 2;
  const cy = clear.cy ?? height / 2;
  // Distances count against the farthest corner, so the arms reach the edges at every size
  const far = Math.max(Math.hypot(cx, cy), Math.hypot(width - cx, cy), Math.hypot(cx, height - cy), Math.hypot(width - cx, height - cy));
  const size = cols * rows;
  const grid: DotGrid = {
    width,
    height,
    cell,
    count: 0,
    cx,
    cy,
    x: new Float32Array(size),
    y: new Float32Array(size),
    open: new Float32Array(size),
    reach: new Float32Array(size),
    angle: new Float32Array(size),
    roundX: new Float32Array(size),
    roundY: new Float32Array(size),
    spin: new Float32Array(size),
    wind: new Float32Array(size),
    sweep: new Float32Array(size),
    tone: new Uint8Array(size),
  };

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = (col + 0.5) * cell;
      const y = (row + 0.5) * cell;
      let open = smooth(
        0,
        1,
        Math.hypot(Math.max(Math.abs(x - cx) - clear.x, 0), Math.max(Math.abs(y - cy) - clear.y, 0)) / clear.feather,
      );
      for (const hole of clear.holes ?? []) {
        const gap = Math.hypot(Math.max(Math.abs(x - hole.x) - hole.halfW, 0), Math.max(Math.abs(y - hole.y) - hole.halfH, 0));
        open = Math.min(open, smooth(0, 1, gap / HOLE_FEATHER));
      }
      if (open === 0) continue;

      const n = grid.count++;
      const distance = Math.hypot(x - cx, y - cy) / far;
      const angle = Math.atan2(y - cy, x - cx);
      const fromTop = angle + Math.PI / 2;
      const tone = scatter(col, row);
      grid.x[n] = x;
      grid.y[n] = y;
      grid.open[n] = open;
      grid.reach[n] = smooth(0.28, 1, distance);
      grid.angle[n] = angle;
      grid.roundX[n] = -Math.sin(angle);
      grid.roundY[n] = Math.cos(angle);
      grid.spin[n] = 0.42 / (0.22 + distance);
      grid.wind[n] = 5.5 * Math.log(distance + 0.12);
      grid.sweep[n] = (fromTop < 0 ? fromTop + Math.PI * 2 : fromTop) / (Math.PI * 2);
      grid.tone[n] = tone < 0.2 ? 1 : tone < 0.62 ? 0 : 2;
    }
  }
  return grid;
}

/** Each colour at nine strengths, so a frame never builds a colour string per square. */
function shades(palette: DotPalette, alpha: number) {
  return [palette.dusty, palette.tan, palette.sky].map(([r, g, b], tone) =>
    Array.from({ length: 9 }, (_, level) => `rgba(${r}, ${g}, ${b}, ${((0.5 + level / 16) * (tone === 2 ? 1 : 0.9) * alpha).toFixed(3)})`),
  );
}

export function paintDots(ctx: CanvasRenderingContext2D, grid: DotGrid, palette: DotPalette, frame: DotFrame) {
  const { t, size, alpha, reveal, pointer, ripples } = frame;
  const fills = shades(palette, alpha);
  const lead = reveal * 1.08;
  const reachSq = POINTER_REACH * POINTER_REACH;
  const feel = pointer && pointer.strength > 0.01 ? pointer : null;

  ctx.clearRect(0, 0, grid.width, grid.height);
  for (let n = 0; n < grid.count; n++) {
    const x = grid.x[n];
    const y = grid.y[n];

    // The arms, and the dots in them carried a little way round
    const arm = Math.pow(0.5 + 0.5 * Math.cos(3 * (grid.angle[n] - t * grid.spin[n]) + grid.wind[n]), 2.4);
    let density = (arm * 1.05 + 0.1) * grid.reach[n];
    let dx = grid.roundX[n] * arm * 3.5;
    let dy = grid.roundY[n] * arm * 3.5;

    // Near the pointer the dots swell and part
    if (feel) {
      const px = x - feel.x;
      const py = y - feel.y;
      const pp = px * px + py * py;
      if (pp < reachSq) {
        const pd = Math.sqrt(pp) + 0.01;
        const k = (1 - pd / POINTER_REACH) ** 2 * feel.strength;
        density += 0.9 * k;
        dx += (px / pd) * 18 * k;
        dy += (py / pd) * 18 * k;
      }
    }

    // A ripple is a ring that travels out, lifting and pushing the dots it passes
    for (const ripple of ripples) {
      const age = t - ripple.born;
      if (age < 0 || age > RIPPLE_LIFE) continue;
      const rx = x - ripple.x;
      const ry = y - ripple.y;
      const rd = Math.hypot(rx, ry) + 0.01;
      const ring = Math.exp(-(((rd - age * RIPPLE_SPEED) / RIPPLE_WIDTH) ** 2)) * (1 - age / RIPPLE_LIFE);
      if (ring < 0.01) continue;
      density += 0.9 * ring;
      dx += (rx / rd) * 12 * ring;
      dy += (ry / rd) * 12 * ring;
    }

    // The entrance: squares appear as the sweep passes, a little big at its leading edge
    let shown = 1;
    let pop = 0;
    if (reveal < 1) {
      const sweep = grid.sweep[n];
      shown = smooth(sweep - 0.06, sweep + 0.01, lead);
      pop = Math.exp(-(((lead - sweep) / 0.045) ** 2));
    }

    const open = grid.open[n];
    density = Math.min(1, density) * open * shown;
    if (density < 0.035) continue;

    const side = grid.cell * (0.11 + 0.67 * density) * (1 + 0.7 * pop) * size;
    ctx.fillStyle = fills[grid.tone[n]][Math.round(density * 8)];
    // Squares close to the clear middle barely move, so none can be pushed onto the copy
    ctx.fillRect(x + dx * open - side / 2, y + dy * open - side / 2, side, side);
  }
}
