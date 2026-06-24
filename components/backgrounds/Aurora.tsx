"use client";

import { ShaderCanvas } from "./ShaderCanvas";

/* Soft flowing aurora curtain (indigo / blue / emerald). Screen-blended so the
   dark areas read as transparent glow. Pinned strictly behind contact. */
const FRAG = `
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

export function Aurora({ className = "" }: { className?: string }) {
  return (
    <ShaderCanvas
      frag={FRAG}
      className={`h-full w-full mix-blend-screen ${className}`}
    />
  );
}
