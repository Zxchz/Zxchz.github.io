/* ============================================================
   Signal — a quiet oscilloscope.
   A few thin monochrome lines that breathe like an idle audio
   trace and lean toward the cursor. Restrained on purpose: it
   lives behind the hero and fades away as you scroll. If WebGL
   or three.js is unavailable the page still reads perfectly.
   ============================================================ */

import * as THREE from "three";

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canvas = document.getElementById("field");
if (canvas) init();

function init() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (err) {
    canvas.style.display = "none";
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene = new THREE.Scene();
  let aspect = window.innerWidth / window.innerHeight;
  const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 10);
  camera.position.z = 2;

  // a few stacked traces, the centre one brightest
  const SEG = 240;
  const LINES = [
    { y: 0.00, amp: 0.085, freq: 2.1, speed: 0.55, opacity: 0.40 },
    { y: 0.06, amp: 0.050, freq: 3.0, speed: -0.40, opacity: 0.16 },
    { y: -0.07, amp: 0.060, freq: 1.5, speed: 0.32, opacity: 0.16 },
  ];

  const traces = LINES.map((cfg) => {
    const positions = new Float32Array((SEG + 1) * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.LineBasicMaterial({
      color: 0xece9e3,
      transparent: true,
      opacity: cfg.opacity,
    });
    const line = new THREE.Line(geo, mat);
    scene.add(line);
    return { cfg, geo, positions };
  });

  // pointer (normalised -aspect..aspect on x, -1..1 on y)
  let mouseX = 0, mouseTargetX = 0, mouseEnergy = 0, mouseTargetEnergy = 0;
  window.addEventListener("pointermove", (e) => {
    mouseTargetX = ((e.clientX / window.innerWidth) * 2 - 1) * aspect;
    mouseTargetEnergy = 1;
  }, { passive: true });
  window.addEventListener("pointerleave", () => { mouseTargetEnergy = 0; });

  function onResize() {
    aspect = window.innerWidth / window.innerHeight;
    camera.left = -aspect; camera.right = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  }
  window.addEventListener("resize", onResize);

  const clock = new THREE.Clock();
  let frame;

  function build(t) {
    mouseX += (mouseTargetX - mouseX) * 0.06;
    mouseEnergy += (mouseTargetEnergy - mouseEnergy) * 0.05;
    mouseTargetEnergy *= 0.96;

    for (const { cfg, geo, positions } of traces) {
      for (let i = 0; i <= SEG; i++) {
        const u = i / SEG;
        const x = -aspect + u * 2 * aspect;
        // taper ends so lines dissolve at the edges
        const envelope = Math.sin(Math.PI * u);
        // resting audio-like trace
        let y =
          Math.sin(x * cfg.freq + t * cfg.speed) * cfg.amp +
          Math.sin(x * cfg.freq * 2.3 - t * cfg.speed * 0.7) * cfg.amp * 0.35;
        // local lift toward the cursor
        const d = x - mouseX;
        const bump = Math.exp(-d * d * 7.0) * 0.16 * mouseEnergy;
        y = cfg.y + (y + bump) * envelope;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = 0;
      }
      geo.attributes.position.needsUpdate = true;
    }
  }

  function render() {
    const t = clock.getElapsedTime();
    build(t);
    // fade the whole field out across the first screenful of scroll
    const s = window.__scrollPct || 0;
    canvas.style.opacity = String(Math.max(0, 1 - s * 6));
    renderer.render(scene, camera);
    frame = requestAnimationFrame(render);
  }

  if (prefersReduced) {
    build(0.6);
    renderer.render(scene, camera);
  } else {
    render();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(frame);
    else if (!prefersReduced) render();
  });
}
