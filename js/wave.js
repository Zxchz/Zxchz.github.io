/* ============================================================
   Hero waveform — the one signature flourish.
   A thin spectrum strip that idles with a slow breathing motion
   and rises toward the cursor as it nears the strip. A nod to the
   audio-model work, not a decorative blob. Cheap: one canvas,
   paused when offscreen or the tab is hidden, static under
   reduced-motion.
   ============================================================ */

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canvas = document.getElementById("wave");
if (canvas) initWave(canvas);

function initWave(canvas) {
  const ctx = canvas.getContext("2d");
  const STEP = 9;            // px per bar (bar + gap)
  const BAR = 3;             // bar width
  const FLOOR = 0.1;         // minimum bar height (fraction)
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let cssW = 0, cssH = 0, n = 0;
  const weights = [];        // stable per-bar variation
  let t = 0;
  let pointerX = -1, target = 0, strength = 0; // cursor proximity 0..1
  let raf = 0, running = false;

  function build() {
    const r = canvas.getBoundingClientRect();
    cssW = Math.max(1, r.width);
    cssH = Math.max(1, r.height);
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    n = Math.floor(cssW / STEP);
    weights.length = 0;
    for (let i = 0; i < n; i++) weights.push(0.4 + Math.random() * 0.6);
  }

  function barFraction(i, time) {
    const a = 0.5 + 0.5 * Math.sin(time * 1.5 + i * 0.5);     // 0..1
    const b = 0.5 + 0.5 * Math.sin(time * 0.7 - i * 0.17);    // 0..1
    let amp = (a * 0.62 + b * 0.38) * weights[i];
    if (strength > 0.01) {
      const bx = i * STEP + BAR / 2;
      const d = (bx - pointerX) / (STEP * 5);
      amp += strength * Math.exp(-d * d) * 0.95;
    }
    const f = FLOOR + amp * (1 - FLOOR);
    return f < 0 ? 0 : f > 1 ? 1 : f;
  }

  function draw() {
    ctx.clearRect(0, 0, cssW, cssH);
    ctx.fillStyle = "rgba(242,242,238,0.10)";
    ctx.fillRect(0, cssH - 1, cssW, 1); // baseline hairline
    const usable = cssH - 3;
    for (let i = 0; i < n; i++) {
      const h = barFraction(i, t) * usable;
      const x = i * STEP;
      const y = cssH - h;
      const tall = h / usable;
      ctx.fillStyle = "rgba(242,242,238," + (0.09 + tall * 0.2).toFixed(3) + ")";
      ctx.fillRect(x, y, BAR, h);
      // lime cap, brighter on peaks and when the cursor is near
      ctx.fillStyle = "rgba(200,241,53," + (0.22 + tall * 0.45 + strength * 0.25).toFixed(3) + ")";
      ctx.fillRect(x, y, BAR, 2);
    }
  }

  function frame() {
    t += 0.016;
    strength += (target - strength) * 0.08;
    draw();
    raf = requestAnimationFrame(frame);
  }
  function run() { if (running) return; running = true; raf = requestAnimationFrame(frame); }
  function stop() { running = false; cancelAnimationFrame(raf); }

  build();

  if (reduce) { draw(); return; }   // static frame, no loop / listeners

  window.addEventListener("pointermove", (e) => {
    if (!running) return;
    const r = canvas.getBoundingClientRect();
    pointerX = e.clientX - r.left;
    const dy = e.clientY < r.top ? r.top - e.clientY
             : e.clientY > r.bottom ? e.clientY - r.bottom : 0;
    target = Math.max(0, 1 - dy / 180);
  }, { passive: true });
  window.addEventListener("pointerout", (e) => { if (!e.relatedTarget) target = 0; });

  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(() => build());
    ro.observe(canvas);
  } else {
    window.addEventListener("resize", build);
  }

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting && !document.hidden ? run() : stop()));
    }, { threshold: 0 });
    io.observe(canvas);
  } else {
    run();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else if (canvas.getBoundingClientRect().bottom > 0) run();
  });
}
