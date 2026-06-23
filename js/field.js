/* ============================================================
   Ambient field. A calm grid of soft dots that drift home and
   part around the cursor; a click sends a quiet ripple.

   Performance: the render loop SLEEPS when nothing is moving
   (no pointer, no ripple, all dots settled) and wakes on input.
   This removes the constant full-canvas repaint that makes an
   idle page drop frames. DPR capped at 2; pauses when hidden.
   ============================================================ */

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canvas = document.getElementById("field");
const ctx = canvas && canvas.getContext("2d");
if (canvas && ctx) start();

function start() {
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0, pts = [];
  const SPACING_BASE = 58;
  const ACCENT = [197, 240, 74];   // toned lime
  const BASE = [110, 116, 100];    // warm grey-green

  const pointer = { x: -9999, y: -9999, active: false };
  const REPEL = 108;
  let shock = null;
  let running = false;

  function build() {
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * DPR; canvas.height = h * DPR;
    canvas.style.width = w + "px"; canvas.style.height = h + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const spacing = w < 640 ? SPACING_BASE * 1.35 : SPACING_BASE;
    const cols = Math.ceil(w / spacing) + 1;
    const rows = Math.ceil(h / spacing) + 1;
    const offX = (w - (cols - 1) * spacing) / 2;
    const offY = (h - (rows - 1) * spacing) / 2;
    pts = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const hx = offX + c * spacing, hy = offY + r * spacing;
        pts.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0 });
      }
    draw(); // one static paint after layout
  }

  const mix = (t) => `rgba(${Math.round(BASE[0] + (ACCENT[0] - BASE[0]) * t)},${Math.round(BASE[1] + (ACCENT[1] - BASE[1]) * t)},${Math.round(BASE[2] + (ACCENT[2] - BASE[2]) * t)},`;

  // single static paint (used when idle / reduced motion)
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      const disp = Math.min(Math.hypot(p.x - p.hx, p.y - p.hy) / 30, 1);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1 + disp * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = mix(disp) + (0.10 + disp * 0.55) + ")";
      ctx.fill();
    }
  }

  function frame() {
    let energy = 0;

    let sw = null;
    if (shock) {
      shock.t += 1;
      const radius = shock.t * 8;
      if (radius > Math.hypot(w, h) + 100) shock = null;
      else { sw = { x: shock.x, y: shock.y, radius }; energy += 1; }
    }

    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      if (pointer.active) {
        const dx = p.x - pointer.x, dy = p.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < REPEL && dist > 0.01) {
          const f = (1 - dist / REPEL) * 3.4;
          p.vx += (dx / dist) * f; p.vy += (dy / dist) * f;
        }
      }
      if (sw) {
        const dx = p.x - sw.x, dy = p.y - sw.y;
        const dist = Math.hypot(dx, dy);
        const band = Math.abs(dist - sw.radius);
        if (band < 34 && dist > 0.01) {
          const f = (1 - band / 34) * 4;
          p.vx += (dx / dist) * f; p.vy += (dy / dist) * f;
        }
      }
      p.vx += (p.hx - p.x) * 0.045; p.vy += (p.hy - p.y) * 0.045;
      p.vx *= 0.87; p.vy *= 0.87;
      p.x += p.vx; p.y += p.vy;

      energy += Math.abs(p.vx) + Math.abs(p.vy);
      const disp = Math.min(Math.hypot(p.x - p.hx, p.y - p.hy) / 30, 1);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1 + disp * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = mix(disp) + (0.10 + disp * 0.55) + ")";
      ctx.fill();
    }

    // sleep when settled and the cursor is gone
    if (energy < 0.4 && !pointer.active && !shock) { running = false; draw(); return; }
    requestAnimationFrame(frame);
  }

  function wake() {
    if (running || prefersReduced || document.hidden) return;
    running = true; requestAnimationFrame(frame);
  }

  build();
  window.addEventListener("resize", build);
  window.addEventListener("pointermove", (e) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true; wake(); }, { passive: true });
  window.addEventListener("pointerleave", () => { pointer.active = false; });
  window.addEventListener("pointerdown", (e) => { shock = { x: e.clientX, y: e.clientY, t: 0 }; wake(); }, { passive: true });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) wake(); });
}
