"use client";

import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef } from "react";

/* react-bits ColorBends — the original shader, rendered with ogl instead of
   Three.js to keep it light. Mouse/parallax disabled (no listeners) for a
   clean, efficient hero background. Gated to run only while on screen. */

const VERT = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
#define MAX_COLORS 8
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer;
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
uniform int uIterations;
uniform float uIntensity;
uniform float uBandWidth;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  vec2 toward = (uPointer - rp);
  q += toward * uMouseInfluence * 0.2;

    for (int j = 0; j < 5; j++) {
      if (j >= uIterations - 1) break;
      vec2 rr = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
      q += (rr - q) * 0.15;
    }

    vec3 col = vec3(0.0);
    float a = 1.0;

    if (uColorCount > 0) {
      vec2 s = q;
      vec3 sumCol = vec3(0.0);
      float cover = 0.0;
      for (int i = 0; i < MAX_COLORS; ++i) {
            if (i >= uColorCount) break;
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3);
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float m = mix(m0, m1, kMix);
            float w = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
            sumCol += uColors[i] * w;
            cover = max(cover, w);
      }
      col = clamp(sumCol, 0.0, 1.0);
      a = uTransparent > 0 ? cover : 1.0;
    } else {
        vec2 s = q;
        for (int k = 0; k < 3; ++k) {
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3);
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float m = mix(m0, m1, kMix);
            col[k] = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
        }
        a = uTransparent > 0 ? max(max(col.r, col.g), col.b) : 1.0;
    }

    col *= uIntensity;

    if (uNoise > 0.0001) {
      float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
      col += (n - 0.5) * uNoise;
      col = clamp(col, 0.0, 1.0);
    }

    vec3 rgb = (uTransparent > 0) ? col * a : col;
    gl_FragColor = vec4(rgb, a);
}`;

type Props = {
  rotation?: number;
  speed?: number;
  colors?: string[];
  scale?: number;
  frequency?: number;
  bandWidth?: number;
  intensity?: number;
  className?: string;
};

export function ColorBends({
  rotation = 105,
  speed = 0.2,
  colors = ["#6366F1", "#3B82F6", "#7cff67"],
  scale = 1,
  frequency = 1,
  bandWidth = 6,
  intensity = 1,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = ref.current;
    if (!ctn) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 768px)").matches;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: !mobile,
      dpr: Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = "transparent";
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    gl.canvas.style.display = "block";

    const geometry = new Triangle(gl);

    const rad = (rotation * Math.PI) / 180;
    const colorsRGB: number[][] = [];
    for (let i = 0; i < 8; i++) {
      if (i < colors.length) {
        const c = new Color(colors[i]);
        colorsRGB.push([c.r, c.g, c.b]);
      } else {
        colorsRGB.push([0, 0, 0]);
      }
    }

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uCanvas: { value: [1, 1] },
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uRot: { value: [Math.cos(rad), Math.sin(rad)] },
        uColorCount: { value: colors.length },
        uColors: { value: colorsRGB },
        uTransparent: { value: 1 },
        uScale: { value: scale },
        uFrequency: { value: frequency },
        uWarpStrength: { value: 0 },
        uPointer: { value: [0, 0] },
        uMouseInfluence: { value: 0 },
        uParallax: { value: 0 },
        uNoise: { value: 0 },
        uIterations: { value: 1 },
        uIntensity: { value: intensity },
        uBandWidth: { value: bandWidth },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    const resize = () => {
      const w = ctn.offsetWidth;
      const h = ctn.offsetHeight;
      renderer.setSize(w, h);
      program.uniforms.uCanvas.value = [w, h];
    };
    const ro = new ResizeObserver(resize);
    ro.observe(ctn);
    resize();

    let raf = 0;
    let running = false;
    let last = 0;
    let elapsed = 0;

    const frame = (t: number) => {
      if (!last) last = t;
      elapsed += t - last;
      last = t;
      program.uniforms.uTime.value = elapsed * 0.001;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    if (reduce) {
      program.uniforms.uTime.value = 4;
      renderer.render({ scene: mesh });
      return () => {
        ro.disconnect();
        if (gl.canvas.parentNode === ctn) ctn.removeChild(gl.canvas);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => (e.isIntersecting && !document.hidden ? start() : stop())),
      { threshold: 0, rootMargin: "10% 0px 10% 0px" }
    );
    io.observe(ctn);
    const onVis = () => {
      if (document.hidden) stop();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      if (gl.canvas.parentNode === ctn) ctn.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ref} aria-hidden className={className} />;
}
