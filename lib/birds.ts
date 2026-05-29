// Bird flocking logic for the hero ambient scene (components/home/AmbientScene.tsx).
// Ported verbatim from design-reference/hero-F-final.html — same steering numbers,
// same wrap behaviour — but refactored to React idioms: the viewport and pointer
// are injected (no global `window` reads) so the math is pure and unit-testable,
// and update() RETURNS the transform string instead of mutating a DOM node.

export interface Viewport {
  width: number;
  height: number;
}

export interface Pointer {
  x: number;
  y: number;
}

/**
 * The render transform for a bird at (x, y) travelling at (vx, vy).
 *
 * The rotation rule is the part that breaks most often: a bird silhouette is
 * symmetric left/right but NOT top/bottom (the wings curve up). So we mirror
 * horizontally with scaleX(-1) when flying left and rotate ONLY by the small
 * banking angle atan2(vy, |vx|) — using |vx| keeps the angle within ±90°, so the
 * bird banks but never flips upside-down.
 */
export function birdTransform(x: number, y: number, vx: number, vy: number): string {
  const facingLeft = vx < 0;
  const bankAngle = (Math.atan2(vy, Math.abs(vx)) * 180) / Math.PI;
  const scaleX = facingLeft ? -1 : 1;
  return `translate(${x}px, ${y}px) scaleX(${scaleX}) rotate(${bankAngle}deg)`;
}

export class Bird {
  x: number;
  y: number;
  vx: number;
  vy: number;
  wanderPhase: number;
  wanderSpeed: number;
  baseDir: number; // intended drift direction (negative = leftward)
  cruiseSpeed: number;

  constructor(idx: number, vp: Viewport) {
    // Stagger horizontally across the right half so they don't all enter together.
    this.x = vp.width * 0.5 + idx * (vp.width * 0.18) + Math.random() * 80;
    this.y = vp.height * (0.15 + Math.random() * 0.32);
    this.vx = -(0.5 + Math.random() * 0.45);
    this.vy = (Math.random() - 0.5) * 0.18;
    this.wanderPhase = Math.random() * Math.PI * 2;
    this.wanderSpeed = 0.007 + Math.random() * 0.008;
    this.baseDir = -1;
    this.cruiseSpeed = 0.55 + Math.random() * 0.35;
  }

  /**
   * Advance one tick and return the CSS transform string for this frame.
   * Pass `pointer = null` to disable cursor avoidance (touch devices cruise).
   */
  update(vp: Viewport, pointer: Pointer | null): string {
    // 1. Gentle wandering — soft vertical sin perturbation
    this.wanderPhase += this.wanderSpeed;
    this.vy += Math.sin(this.wanderPhase) * 0.025;

    // 2. Cursor avoidance — strong push away when near (quadratic falloff)
    if (pointer) {
      const dx = this.x - pointer.x;
      const dy = this.y - pointer.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const avoidR = 180;
      if (dist < avoidR && dist > 0.01) {
        const f = Math.pow(1 - dist / avoidR, 2) * 1.2;
        this.vx += (dx / dist) * f;
        this.vy += (dy / dist) * f;
      }
    }

    // 3. Maintain general drift direction (gentle pull back to cruise)
    const targetVx = this.baseDir * this.cruiseSpeed;
    this.vx += (targetVx - this.vx) * 0.012;

    // 4. Damp vertical so birds don't fly straight up/down forever
    this.vy *= 0.98;

    // 5. Cap speed
    const sp = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    const maxSp = 1.6;
    if (sp > maxSp) {
      this.vx = (this.vx / sp) * maxSp;
      this.vy = (this.vy / sp) * maxSp;
    }

    // 6. Position
    this.x += this.vx;
    this.y += this.vy;

    // 7. Wrap around screen edges
    const margin = 80;
    if (this.x < -margin) {
      this.x = vp.width + margin;
      this.y = vp.height * (0.15 + Math.random() * 0.25);
      this.vx = -this.cruiseSpeed;
      this.vy = 0;
    } else if (this.x > vp.width + margin) {
      this.x = -margin;
      this.y = vp.height * (0.15 + Math.random() * 0.25);
      this.vx = this.cruiseSpeed * (this.baseDir > 0 ? 1 : -1);
      this.vy = 0;
    }
    if (this.y < 40) {
      this.y = 40;
      this.vy = Math.abs(this.vy);
    }
    if (this.y > vp.height * 0.55) {
      this.y = vp.height * 0.55;
      this.vy = -Math.abs(this.vy);
    }

    // 8. Render
    return birdTransform(this.x, this.y, this.vx, this.vy);
  }
}
