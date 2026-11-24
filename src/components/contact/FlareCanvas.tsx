"use client";

import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";

const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

// Anamorphic lens flare: a thin horizontal streak, a hot core, a soft halo and
// a few ghosts mirrored through the frame centre, plus a little grain.
const FRAGMENT = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = uv - uMouse;
  p.x *= aspect;

  float breathe = 0.86 + 0.14 * sin(uTime * 0.9);
  float streak = exp(-abs(p.y) * 42.0) * exp(-abs(p.x) * 0.75) * breathe;
  float streakWide = exp(-abs(p.y) * 9.0) * exp(-abs(p.x) * 1.6) * 0.35;
  float core = exp(-length(p) * 9.0);
  float halo = exp(-length(p) * 2.4) * 0.22;

  vec3 blue = vec3(0.22, 0.45, 1.0);
  vec3 cyan = vec3(0.56, 0.86, 1.0);
  vec3 col = blue * (streak * 1.5 + streakWide) + cyan * core * 1.1 + blue * halo;

  vec2 axis = vec2(0.5) - uMouse;
  for (int i = 1; i <= 3; i++) {
    float k = float(i) * 0.55;
    vec2 g = uMouse + axis * (1.0 + k);
    vec2 d = uv - g;
    d.x *= aspect;
    float r = 0.05 + 0.035 * float(i);
    float ring = smoothstep(r, r - 0.012, length(d)) * 0.05;
    col += mix(blue, cyan, float(i) / 3.0) * ring;
  }

  col += (hash(gl_FragCoord.xy + fract(uTime) * 100.0) - 0.5) * 0.035;
  col = col / (1.0 + col);
  col += vec3(0.018, 0.022, 0.03);
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Flare shader failed to compile:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Full-bleed WebGL flare behind the contact section. The hot spot eases toward
 * the cursor (or drifts on its own on touch screens), renders only while
 * visible, and falls back to the section's CSS gradient if WebGL is missing.
 */
export default function FlareCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
    if (!gl) {
      canvas.style.display = "none";
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vs || !fs || !program) {
      canvas.style.display = "none";
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Flare program failed to link:", gl.getProgramInfoLog(program));
      canvas.style.display = "none";
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uMouse = gl.getUniformLocation(program, "uMouse");

    const reduce = prefersReducedMotion();
    const fine = hasFinePointer();
    const mouse = { x: 0.62, y: 0.55 };
    const target = { x: 0.62, y: 0.55 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const render = (seconds: number) => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, seconds);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    resize();
    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduce) render(0);
    });
    resizeObserver.observe(canvas);

    if (reduce) {
      render(0);
      return () => {
        resizeObserver.disconnect();
      };
    }

    const host = canvas.parentElement ?? canvas;
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      target.x = (event.clientX - rect.left) / rect.width;
      target.y = 1 - (event.clientY - rect.top) / rect.height;
    };
    if (fine) host.addEventListener("pointermove", onMove);

    let raf = 0;
    let running = false;
    const start = performance.now();
    const frame = (now: number) => {
      const t = (now - start) / 1000;
      if (!fine) {
        target.x = 0.5 + Math.sin(t * 0.35) * 0.28;
        target.y = 0.55 + Math.sin(t * 0.5 + 1.3) * 0.12;
      }
      mouse.x += (target.x - mouse.x) * 0.06;
      mouse.y += (target.y - mouse.y) * 0.06;
      render(t);
      if (running) raf = requestAnimationFrame(frame);
    };

    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(frame);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    visibility.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      visibility.disconnect();
      resizeObserver.disconnect();
      host.removeEventListener("pointermove", onMove);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
