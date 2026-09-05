import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  phase: number;
};

export function CelestialStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let stars: Star[] = [];
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(220, Math.floor((width * height) / 7200));
      stars = Array.from({ length: count }, (_, index) => ({
        x: (Math.sin(index * 387.13) * 0.5 + 0.5) * width,
        y: (Math.sin(index * 91.77 + 2) * 0.5 + 0.5) * height,
        radius: 0.35 + ((index * 13) % 17) / 13,
        alpha: 0.25 + ((index * 19) % 60) / 100,
        speed: 0.0008 + ((index * 7) % 10) / 8000,
        phase: index * 0.73,
      }));
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const style = getComputedStyle(document.documentElement);
      const starColor = style.getPropertyValue("--star").trim() || "white";
      const goldColor = style.getPropertyValue("--gold").trim() || "white";

      stars.forEach((star, index) => {
        const twinkle = reducedMotion ? 0.8 : 0.55 + Math.sin(time * star.speed + star.phase) * 0.4;
        context.globalAlpha = Math.max(0.08, star.alpha * twinkle);
        context.fillStyle = index % 11 === 0 ? goldColor : starColor;
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fill();
      });

      context.globalAlpha = 1;
      if (!reducedMotion) animationFrame = requestAnimationFrame(draw);
    };

    resize();
    draw(0);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden />;
}
