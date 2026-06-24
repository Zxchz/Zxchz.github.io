"use client";

import { ShaderCanvas } from "./ShaderCanvas";

/* Flowing diagonal colour bands (indigo -> blue -> lime), toned down so the
   large hero type stays readable. Pinned strictly behind the hero. */
const FRAG = `
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
  float ang = 1.8326; // ~105deg
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
  col *= 0.5;
  gl_FragColor = vec4(col, 1.0);
}
`;

export function ColorBends({ className = "" }: { className?: string }) {
  return (
    <ShaderCanvas
      frag={FRAG}
      className={`h-full w-full ${className}`}
    />
  );
}
