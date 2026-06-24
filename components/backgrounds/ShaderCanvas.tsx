"use client";

import { useEffect, useRef } from "react";

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

type Props = {
  frag: string;
  className?: string;
};

/**
 * A single dependency-free WebGL fullscreen-triangle shader, gated by
 * IntersectionObserver + page visibility so it only runs while on screen.
 * DPR is capped (lower on mobile). Renders one static frame under reduced
 * motion. If WebGL is unavailable the canvas stays empty (the parent's CSS
 * fallback shows through).
 */
export function ShaderCanvas({ frag, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl", {
        antialias: false,
        alpha: true,
        premultipliedAlpha: false,
        powerPreference: "low-power",
        depth: false,
      }) as WebGLRenderingContext | null;
    } catch {
      return;
    }
    if (!gl) return;
    const ctx = gl;

    const compile = (type: number, src: string) => {
      const s = ctx.createShader(type)!;
      ctx.shaderSource(s, src);
      ctx.compileShader(s);
      if (!ctx.getShaderParameter(s, ctx.COMPILE_STATUS)) {
        console.warn(ctx.getShaderInfoLog(s));
        return null;
      }
      return s;
    };

    const vs = compile(ctx.VERTEX_SHADER, VERT);
    const fs = compile(ctx.FRAGMENT_SHADER, frag);
    if (!vs || !fs) return;

    const prog = ctx.createProgram()!;
    ctx.attachShader(prog, vs);
    ctx.attachShader(prog, fs);
    ctx.linkProgram(prog);
    if (!ctx.getProgramParameter(prog, ctx.LINK_STATUS)) {
      console.warn(ctx.getProgramInfoLog(prog));
      return;
    }
    ctx.useProgram(prog);

    const buf = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buf);
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), ctx.STATIC_DRAW);
    const loc = ctx.getAttribLocation(prog, "p");
    ctx.enableVertexAttribArray(loc);
    ctx.vertexAttribPointer(loc, 2, ctx.FLOAT, false, 0, 0);

    const uRes = ctx.getUniformLocation(prog, "uRes");
    const uTime = ctx.getUniformLocation(prog, "uTime");

    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const DPR = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);

    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * DPR));
      const h = Math.max(1, Math.round(canvas.clientHeight * DPR));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        ctx.viewport(0, 0, w, h);
      }
      ctx.uniform2f(uRes, w, h);
    };

    let raf = 0;
    let running = false;
    let elapsed = 0;
    let last = 0;

    const frame = (now: number) => {
      if (!last) last = now;
      elapsed += (now - last) / 1000;
      last = now;
      resize();
      ctx.uniform1f(uTime, elapsed);
      ctx.drawArrays(ctx.TRIANGLES, 0, 3);
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

    resize();

    if (reduce) {
      ctx.uniform1f(uTime, 1.5);
      ctx.drawArrays(ctx.TRIANGLES, 0, 3);
      return;
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) =>
          e.isIntersecting && !document.hidden ? start() : stop()
        );
      },
      { threshold: 0, rootMargin: "10% 0px 10% 0px" }
    );
    io.observe(canvas);

    const onVis = () => {
      if (document.hidden) stop();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      const lose = ctx.getExtension("WEBGL_lose_context");
      lose?.loseContext();
    };
  }, [frag]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
