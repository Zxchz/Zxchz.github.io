/* ============================================================
   Ambient field — a calm grid of soft dots that drift back home
   and part gently around the cursor; a click sends a quiet ripple.
   Tuned to be subtle (depth, not spectacle) under the glass.
   Plain 2D canvas, no dependencies. Purely decorative.
   ============================================================ */

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canvas = document.getElementById("field");
const ctx = canvas && canvas.getContext("2d");
if (canvas && ctx) start();

function start() {
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0, pts = [];
  const SPACING_BASE = 54;

  const ACCENT = [100, 210, 255];   // cool cyan/blue
  const BASE = [120, 124, 140];     // cool grey

  const pointer = { x: -9999, y: -9999, active: false };
  const REPEL = 110;
  let shock = null;

  function build() {
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * DPR; canvas.height = h * DPR;
    canvas.style.width = w + "px"; canvas.style.height = h + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const spacing = w < 640 ? SPACING_BASE * 1.3 : SPACING_BASE;
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
  }
  build();
  window.addEventListener("resize", build);

  window.addEventListener("pointermove", (e) => {
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true;
  }, { passive: true });
  window.addEventListener("pointerleave", () => { pointer.active = false; pointer.x = -9999; });
  window.addEventListener("pointerdown", (e) => { shock = { x: e.clientX, y: e.clientY, t: 0 }; }, { passive: true });

  const mix = (t) => [
    Math.round(BASE[0] + (ACCENT[0] - BASE[0]) * t),
    Math.round(BASE[1] + (ACCENT[1] - BASE[1]) * t),
    Math.round(BASE[2] + (ACCENT[2] - BASE[2]) * t),
  ];

  function frame() {
    ctx.clearRect(0, 0, w, h);

    let sw = null;
    if (shock) {
      shock.t += 1;
      const radius = shock.t * 8;
      if (radius > Math.hypot(w, h) + 100) shock = null;
      else sw = { x: shock.x, y: shock.y, radius };
    }

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

      const disp = Math.min(Math.hypot(p.x - p.hx, p.y - p.hy) / 30, 1);
      const col = mix(disp);
      const alpha = 0.10 + disp * 0.55;
      const r = 1 + disp * 1.4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${alpha})`;
      ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  }

  let raf;
  if (prefersReduced) {
    for (const p of pts) {
      ctx.beginPath(); ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${BASE[0]},${BASE[1]},${BASE[2]},0.1)`; ctx.fill();
    }
  } else frame();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else if (!prefersReduced) frame();
  });
}
