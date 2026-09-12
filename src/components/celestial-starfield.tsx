import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  phase: number;
};

type ShootingStar = {
  x: number;
  y: number;
  length: number;
  speed: number;
  alpha: number;
};

export function CelestialStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    // Paralaxe suave com amortecimento (lerp)
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let targetScrollY = 0;
    let currentScrollY = 0;

    let lastTime = 0;
    let nextShootingStarAt = 3000 + Math.random() * 2000;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onPointerMove = (e: PointerEvent) => {
      targetMouseX = (e.clientX / (window.innerWidth || 1) - 0.5) * 2;
      targetMouseY = (e.clientY / (window.innerHeight || 1) - 0.5) * 2;
    };

    const onScroll = () => {
      targetScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(620, Math.floor((width * height) / 2800));
      stars = Array.from({ length: count }, (_, index) => ({
        x: (Math.sin(index * 387.13) * 0.5 + 0.5) * width,
        y: (Math.sin(index * 91.77 + 2) * 0.5 + 0.5) * height,
        radius: 0.35 + ((index * 13) % 19) / 12,
        alpha: 0.3 + ((index * 19) % 68) / 100,
        speed: 0.0007 + ((index * 7) % 14) / 7000,
        phase: index * 0.73,
      }));
    };

    const draw = (time: number) => {
      const elapsed = lastTime === 0 ? 0 : Math.min(time - lastTime, 40);
      lastTime = time;
      context.clearRect(0, 0, width, height);

      // Interpolação suave do mouse e scroll
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;
      currentScrollY += (targetScrollY - currentScrollY) * 0.06;

      const style = getComputedStyle(document.documentElement);
      const starColor = style.getPropertyValue("--star").trim() || "white";
      const silverColor = style.getPropertyValue("--silver").trim() || "white";

      // Deslocamento de paralaxe: estrelas se movem bem devagar (0.015 no mouse, 0.08 no scroll)
      const mouseShiftX = reducedMotion ? 0 : currentMouseX * 12;
      const mouseShiftY = reducedMotion ? 0 : currentMouseY * 10;
      const scrollShiftY = reducedMotion ? 0 : -currentScrollY * 0.08;

      stars.forEach((star, index) => {
        const depthFactor = 0.4 + star.radius * 0.4;
        let px = star.x + mouseShiftX * depthFactor;
        let py = star.y + (mouseShiftY + scrollShiftY) * depthFactor;

        // Manter estrelas dentro da tela com wrap contínuo
        px = ((px % width) + width) % width;
        py = ((py % height) + height) % height;

        const twinkle = reducedMotion ? 0.8 : 0.5 + Math.sin(time * star.speed + star.phase) * 0.5;
        context.globalAlpha = Math.max(0.08, star.alpha * twinkle);
        context.fillStyle = index % 9 === 0 ? silverColor : starColor;
        context.beginPath();
        context.arc(px, py, star.radius, 0, Math.PI * 2);
        context.fill();
      });

      if (!reducedMotion && time >= nextShootingStarAt) {
        shootingStars.push({
          x: width + 140,
          y: height * (0.08 + Math.random() * 0.3),
          length: 120 + Math.random() * 100,
          speed: 0.55 + Math.random() * 0.22,
          alpha: 1,
        });
        nextShootingStarAt = time + 3000 + Math.random() * 2000;
      }

      shootingStars.forEach((shootingStar) => {
        const tailX = shootingStar.x + shootingStar.length;
        const tailY = shootingStar.y - shootingStar.length * 0.42;
        const gradient = context.createLinearGradient(shootingStar.x, shootingStar.y, tailX, tailY);
        gradient.addColorStop(0, silverColor);
        gradient.addColorStop(0.18, silverColor);
        gradient.addColorStop(1, "transparent");

        context.globalAlpha = shootingStar.alpha;
        context.strokeStyle = gradient;
        context.lineWidth = 1.4;
        context.beginPath();
        context.moveTo(shootingStar.x, shootingStar.y);
        context.lineTo(tailX, tailY);
        context.stroke();

        context.fillStyle = starColor;
        context.shadowColor = silverColor;
        context.shadowBlur = 12;
        context.beginPath();
        context.arc(shootingStar.x, shootingStar.y, 1.8, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;

        shootingStar.x -= shootingStar.speed * elapsed;
        shootingStar.y += shootingStar.speed * elapsed * 0.42;
        shootingStar.alpha = Math.max(0, shootingStar.alpha - elapsed / 1800);
      });
      shootingStars = shootingStars.filter(
        (shootingStar) => shootingStar.alpha > 0 && shootingStar.x > -shootingStar.length,
      );

      context.globalAlpha = 1;
      if (!reducedMotion) animationFrame = requestAnimationFrame(draw);
    };

    resize();
    draw(0);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[1]" aria-hidden />;
}
