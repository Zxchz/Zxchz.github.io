/* ============================================================
   Background shaders. Two tiny, dependency-free WebGL programs:
   ColorBends behind the hero, Aurora behind contact. Each is a
   single fullscreen triangle with one fragment shader, gated by
   IntersectionObserver + page visibility so only the one on
   screen ever runs. DPR is capped (lower on mobile). If WebGL is
   unavailable the canvas simply stays empty and the CSS gradient
   fallback on the wrapper shows instead. Static single frame
   under reduced motion.
   ============================================================ */

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

const VERT = `
attribute vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }
`;

/* ColorBends — flowing diagonal colour bands (indigo → blue → lime). */
const CB_FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 q = uv;
  q.x *= uRes.x / uRes.y;
  float ang = 1.8326;               // ~105deg
  vec2 dir = vec2(cos(ang), sin(ang));
  float d = dot(q, dir);
  float t = uTime * 0.12;
  float w = sin(d * 2.5 + t)
          + 0.5 * sin(d * 5.0 - t * 1.3 + sin(uv.y * 3.0 + t) * 0.6)
          + 0.25 * sin(d * 9.0 + t * 0.7);
  float m = clamp(w / 1.75 * 0.5 + 0.5, 0.0, 1.0);
  vec3 c1 = vec3(0.388, 0.400, 0.945);
  vec3 c2 = vec3(0.231, 0.510, 0.965);
  vec3 c3 = vec3(0.486, 1.000, 0.404);
  vec3 col = mix(c1, c2, smoothstep(0.0, 0.55, m));
  col = mix(col, c3, smoothstep(0.5, 1.0, m));
  col *= 0.5;                        // keep it moody behind white type
  gl_FragColor = vec4(col, 1.0);
}
`;

/* Aurora — soft flowing curtain (indigo / blue / emerald). Designed
   to be screen-blended so the dark areas read as transparent glow. */
const AU_FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
float hash(float n){ return fract(sin(n) * 43758.5453123); }
float noise(vec2 x){
  vec2 p = floor(x); vec2 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  float n = p.x + p.y * 57.0;
  return mix(mix(hash(n), hash(n + 1.0), f.x),
             mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  float t = uTime * 0.15;
  float wave = 0.52
             + 0.10 * sin(uv.x * 3.0 + t)
             + 0.06 * sin(uv.x * 6.3 - t * 1.4)
             + 0.06 * noise(vec2(uv.x * 3.0, t * 0.5));
  float dist = abs(uv.y - wave);
  float glow = pow(smoothstep(0.45, 0.0, dist), 1.7);
  float curt = 0.6 + 0.4 * sin(uv.x * 26.0 + t * 1.8 + noise(vec2(uv.x * 5.0, t)) * 6.0);
  glow *= curt;
  float cm = 0.5 + 0.5 * sin(uv.x * 2.0 + t * 0.6);
  vec3 a1 = vec3(0.388, 0.400, 0.945);
  vec3 a2 = vec3(0.231, 0.510, 0.965);
  vec3 a3 = vec3(0.063, 0.725, 0.506);
  vec3 col = mix(a1, a3, cm);
  col = mix(col, a2, 0.4 + 0.4 * sin(uv.x * 4.0 - t));
  gl_FragColor = vec4(col * glow * 1.15, 1.0);
}
`;

function makeBG(canvas, frag) {
  let gl;
  try {
    gl = canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: false, powerPreference: "low-power", depth: false });
  } catch (_) { return null; }
  if (!gl) return null;

  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
    return s;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.warn(gl.getProgramInfoLog(prog)); return null; }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, "uRes");
  const uTime = gl.getUniformLocation(prog, "uTime");

  const mobile = matchMedia("(max-width: 768px)").matches;
  const DPR = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);

  function resize() {
    const w = Math.max(1, Math.round(canvas.clientWidth * DPR));
    const h = Math.max(1, Math.round(canvas.clientHeight * DPR));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(uRes, w, h);
  }

  let raf = 0, running = false, elapsed = 0, last = 0;
  function frame(now) {
    if (!last) last = now;
    elapsed += (now - last) / 1000; last = now;
    resize();
    gl.uniform1f(uTime, elapsed);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(frame);
  }
  function start() { if (running) return; running = true; last = 0; raf = requestAnimationFrame(frame); }
  function stop() { running = false; cancelAnimationFrame(raf); }

  resize();
  if (reduce) { gl.uniform1f(uTime, 1.5); gl.drawArrays(gl.TRIANGLES, 0, 3); return { start() {}, stop() {} }; }

  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener("resize", resize, { passive: true });

  return { start, stop };
}

function gate(bg, target) {
  if (!bg) return;
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting && !document.hidden ? bg.start() : bg.stop()));
    }, { threshold: 0, rootMargin: "10% 0px 10% 0px" });
    io.observe(target);
  } else {
    bg.start();
  }
  document.addEventListener("visibilitychange", () => { if (document.hidden) bg.stop(); });
}

const cb = document.getElementById("cb");
const au = document.getElementById("au");
if (cb) gate(makeBG(cb, CB_FRAG), cb.closest(".hero-sticky") || cb);
if (au) gate(makeBG(au, AU_FRAG), au.closest("#contact") || au);
