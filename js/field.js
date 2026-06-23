/* ============================================================
   WebGL "signal field"
   A GPU particle lattice that behaves like an audio waveform
   crossed with a neuron cloud: it breathes on its own and
   ripples toward the cursor. Purely decorative — if WebGL or
   three.js is unavailable the page still reads perfectly.
   ============================================================ */

import * as THREE from "three";

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canvas = document.getElementById("field");
if (canvas) initField();

function initField() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
  } catch (err) {
    canvas.style.display = "none";
    return;
  }

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(DPR);
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 14);

  /* --- build the lattice --- */
  const isSmall = window.innerWidth < 760;
  const COLS = isSmall ? 90 : 160;
  const ROWS = isSmall ? 56 : 96;
  const SPREAD_X = 34;
  const SPREAD_Y = 20;

  const count = COLS * ROWS;
  const positions = new Float32Array(count * 3);
  const aRand = new Float32Array(count);

  let i = 0;
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      positions[i * 3] = (x / (COLS - 1) - 0.5) * SPREAD_X;
      positions[i * 3 + 1] = (y / (ROWS - 1) - 0.5) * SPREAD_Y;
      positions[i * 3 + 2] = 0;
      aRand[i] = Math.random();
      i++;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aRand", new THREE.BufferAttribute(aRand, 1));

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uMouseStrength: { value: 0 },
    uSize: { value: DPR * (isSmall ? 2.0 : 2.6) },
    uColorLo: { value: new THREE.Color("#13414a") },
    uColorHi: { value: new THREE.Color("#5eead4") },
  };

  const vertexShader = /* glsl */ `
    uniform float uTime;
    uniform vec2  uMouse;
    uniform float uMouseStrength;
    uniform float uSize;
    attribute float aRand;
    varying float vGlow;

    void main() {
      vec3 pos = position;

      // layered travelling waves -> "audio waveform"
      float w = 0.0;
      w += sin(pos.x * 0.32 + uTime * 0.9) * 0.9;
      w += sin(pos.y * 0.40 - uTime * 0.7) * 0.7;
      w += sin((pos.x + pos.y) * 0.22 + uTime * 1.3) * 0.5;
      w += cos(length(pos.xy) * 0.5 - uTime * 1.1) * 0.6;
      pos.z += w;

      // cursor ripple -> "neuron" excitation
      vec2 m = uMouse * vec2(17.0, 10.0);
      float d = distance(pos.xy, m);
      float ripple = exp(-d * 0.28) * uMouseStrength;
      pos.z += ripple * 3.2;
      pos.xy += normalize(pos.xy - m + 0.0001) * ripple * 0.5;

      vGlow = clamp((w + ripple * 3.0) * 0.22 + 0.35, 0.0, 1.0);

      vec4 mv = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mv;

      float twinkle = 0.7 + 0.3 * sin(uTime * 2.0 + aRand * 6.2831);
      gl_PointSize = uSize * twinkle * (300.0 / -mv.z);
    }
  `;

  const fragmentShader = /* glsl */ `
    precision mediump float;
    uniform vec3 uColorLo;
    uniform vec3 uColorHi;
    varying float vGlow;

    void main() {
      vec2 c = gl_PointCoord - 0.5;
      float r = length(c);
      if (r > 0.5) discard;
      float alpha = smoothstep(0.5, 0.05, r);
      vec3 col = mix(uColorLo, uColorHi, vGlow);
      gl_FragColor = vec4(col, alpha * (0.35 + vGlow * 0.65));
    }
  `;

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  points.rotation.x = -0.62;
  scene.add(points);

  /* --- pointer tracking --- */
  const targetMouse = new THREE.Vector2(0, 0);
  let targetStrength = 0;

  function setPointer(clientX, clientY, boost) {
    targetMouse.x = (clientX / window.innerWidth) * 2 - 1;
    targetMouse.y = -((clientY / window.innerHeight) * 2 - 1);
    targetStrength = boost || 1;
  }
  window.addEventListener("pointermove", (e) => setPointer(e.clientX, e.clientY), { passive: true });
  window.addEventListener("pointerdown", (e) => setPointer(e.clientX, e.clientY, 1.6), { passive: true });
  window.addEventListener("pointerleave", () => { targetStrength = 0; });

  /* --- resize --- */
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  }
  window.addEventListener("resize", onResize);

  /* --- loop --- */
  const clock = new THREE.Clock();
  let frame;

  function render() {
    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;

    uniforms.uMouse.value.lerp(targetMouse, 0.06);
    uniforms.uMouseStrength.value += (targetStrength - uniforms.uMouseStrength.value) * 0.05;
    targetStrength *= 0.96;

    const s = window.__scrollPct || 0;
    camera.position.y = -s * 6.0;
    camera.position.z = 14 - s * 4.0;
    points.rotation.z = s * 0.12;
    camera.position.x += (uniforms.uMouse.value.x * 1.4 - camera.position.x) * 0.04;
    camera.lookAt(0, camera.position.y * 0.4, 0);

    renderer.render(scene, camera);
    frame = requestAnimationFrame(render);
  }

  if (prefersReduced) {
    uniforms.uTime.value = 1.2;
    renderer.render(scene, camera);
  } else {
    render();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
    } else if (!prefersReduced) {
      render();
    }
  });
}
