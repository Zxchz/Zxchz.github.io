/* ============================================================
   Physics playground — a grid of little "+" marks (graph paper
   for a lab notebook). Each one springs back to its home and
   scatters away from the cursor; a click sends a shockwave
   through the field. Plain 2D canvas, no dependencies.
   Purely decorative: if it fails, the page is unaffected.
   ============================================================ */

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canvas = document.getElementById("field");
const ctx = canvas && canvas.getContext("2d");
if (canvas && ctx) start();

function start() {
  let DPR = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0;
  let pts = [];
  const SPACING_BASE = 46;

  const ACCENT = [200, 255, 0];
  const BASE = [120, 120, 116];

  // pointer
  const pointer = { x: -9999, y: -9999, active: false };
  const REPEL = 120;      // radius of cursor influence
  let shock = null;       // {x,y,t}

  function build() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * DPR;
    canvas.height = h * DPR;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const spacing = w < 640 ? SPACING_BASE * 1.25 : SPACING_BASE;
    const cols = Math.ceil(w / spacing) + 1;
    const rows = Math.ceil(h / spacing) + 1;
    const offX = (w - (cols - 1) * spacing) / 2;
    const offY = (h - (rows - 1) * spacing) / 2;

    pts = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const hx = offX + c * spacing;
        const hy = offY + r * spacing;
        pts.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0 });
      }
    }
  }
  build();
  window.addEventListener("resize", build);

  window.addEventListener("pointermove", (e) => {
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true;
  }, { passive: true });
  window.addEventListener("pointerleave", () => { pointer.active = false; pointer.x = -9999; });
  window.addEventListener("pointerdown", (e) => { shock = { x: e.clientX, y: e.clientY, t: 0 }; }, { passive: true });

  function lerpColor(t) {
    return [
      Math.round(BASE[0] + (ACCENT[0] - BASE[0]) * t),
      Math.round(BASE[1] + (ACCENT[1] - BASE[1]) * t),
      Math.round(BASE[2] + (ACCENT[2] - BASE[2]) * t),
    ];
  }

  function plus(x, y, s, col, a) {
    ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${a})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - s, y); ctx.lineTo(x + s, y);
    ctx.moveTo(x, y - s); ctx.lineTo(x, y + s);
    ctx.stroke();
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);

    // advance shockwave
    let sw = null;
    if (shock) {
      shock.t += 1;
      const radius = shock.t * 9;
      if (radius > Math.hypot(w, h) + 120) shock = null;
      else sw = { x: shock.x, y: shock.y, radius };
    }

    for (const p of pts) {
      // cursor repulsion
      if (pointer.active) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < REPEL && dist > 0.01) {
          const force = (1 - dist / REPEL) * 5.5;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }
      // shockwave push
      if (sw) {
        const dx = p.x - sw.x, dy = p.y - sw.y;
        const dist = Math.hypot(dx, dy);
        const band = Math.abs(dist - sw.radius);
        if (band < 40 && dist > 0.01) {
          const force = (1 - band / 40) * 6;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }
      // spring home + damping
      p.vx += (p.hx - p.x) * 0.05;
      p.vy += (p.hy - p.y) * 0.05;
      p.vx *= 0.86; p.vy *= 0.86;
      p.x += p.vx; p.y += p.vy;

      // displacement drives color + size
      const disp = Math.min(Math.hypot(p.x - p.hx, p.y - p.hy) / 26, 1);
      const col = lerpColor(disp);
      const alpha = 0.18 + disp * 0.72;
      plus(p.x, p.y, 3 + disp * 2.5, col, alpha);
    }

    raf = requestAnimationFrame(frame);
  }

  let raf;
  if (prefersReduced) {
    // static field, no motion
    for (const p of pts) plus(p.x, p.y, 3, BASE, 0.16);
  } else {
    frame();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else if (!prefersReduced) frame();
  });
}
