"use client";

import React, { useEffect, useRef, useState } from "react";

export const AmbientBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Ambient floating dust particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
    }> = [];

    const colors = [
      "rgba(34, 211, 238, ", // cyan
      "rgba(245, 158, 11, ", // gold
      "rgba(251, 113, 133, ", // rose
      "rgba(255, 255, 255, ", // white
    ];

    const particleCount = Math.min(38, Math.floor(width / 35));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: -Math.random() * 0.35 - 0.1,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < 0) {
          p.y = height + 5;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `${p.color}0.8)`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic Cursor Glow (Desktop) */}
      <div
        className="absolute rounded-full blur-[140px] opacity-25 transition-transform duration-700 ease-out will-change-transform"
        style={{
          width: "550px",
          height: "550px",
          background:
            "radial-gradient(circle, rgba(34, 211, 238, 0.35) 0%, rgba(245, 158, 11, 0.12) 40%, rgba(251, 113, 133, 0.08) 60%, transparent 80%)",
          left: `calc(${mousePos.x * 100}% - 275px)`,
          top: `calc(${mousePos.y * 100}% - 275px)`,
        }}
      />

      {/* Atmospheric Constant Halos */}
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-cyan-950/20 rounded-full blur-[120px]" />
      <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-amber-950/20 rounded-full blur-[120px]" />

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full opacity-60" />

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,5,0.75)_80%,rgba(5,5,5,0.98)_100%)] pointer-events-none" />

      {/* Film grain subtle texture */}
      <div className="absolute inset-0 film-grain opacity-40 mix-blend-overlay pointer-events-none" />
    </div>
  );
};
