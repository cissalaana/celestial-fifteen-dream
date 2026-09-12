import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { CelestialStarfield } from "@/components/celestial-starfield";
import { SparkleCluster, FourPointSparkle } from "@/components/celestial-sparkle";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gabriela — Save the Date | 15 anos" },
      {
        name: "description",
        content:
          "Reserve a data: 12 de dezembro de 2026. Uma noite de sonhos e estrelas nos espera.",
      },
      { property: "og:title", content: "Gabriela — Save the Date | 15 anos" },
      {
        property: "og:description",
        content: "12 de dezembro de 2026 — uma noite de sonhos e estrelas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "google", content: "notranslate" },
    ],
  }),
  component: Index,
});

const sceneDuration = [5200, 6500, 6800];
const WHATSAPP_LINK =
  "https://wa.me/5581992895842?text=Pode%20contar%20com%20a%20minha%20presen%C3%A7a!%20Te%20vejo%20l%C3%A1";

// Novo vetor/PNG transparente da personagem
const CHARACTER_IMAGE_SRC = "/assets/personagem.png";

/**
 * Hook de Mouse Parallax suave com interpolação contínua (lerp)
 */
function useMouseParallax() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onPointerMove = (e: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX / (innerWidth || 1) - 0.5) * 2;
      targetY = (e.clientY / (innerHeight || 1) - 0.5) * 2;
    };

    const update = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      setOffset({ x: currentX, y: currentY });
      animationFrame = requestAnimationFrame(update);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    animationFrame = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return offset;
}

/**
 * Hook de Scroll Parallax suave
 */
function useScrollParallax() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let animationFrame = 0;
    let targetY = 0;
    let currentY = 0;

    const onScroll = () => {
      targetY = window.scrollY || document.documentElement.scrollTop || 0;
    };

    const update = () => {
      currentY += (targetY - currentY) * 0.08;
      setScrollY(currentY);
      animationFrame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    animationFrame = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return scrollY;
}

function Index() {
  const [scene, setScene] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mouse = useMouseParallax();
  const scrollY = useScrollParallax();

  useEffect(() => {
    if (scene >= 3) return;
    const timeout = window.setTimeout(
      () => setScene((current) => current + 1),
      sceneDuration[scene],
    );
    return () => window.clearTimeout(timeout);
  }, [scene]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0;

    const playAudio = () => {
      audio
        .play()
        .then(() => {
          setSoundOn(true);
          let volume = audio.volume;
          const fade = window.setInterval(() => {
            volume = Math.min(0.28, volume + 0.02);
            audio.volume = volume;
            if (volume >= 0.28) window.clearInterval(fade);
          }, 160);
        })
        .catch(() => setSoundOn(false));
    };

    playAudio();

    const handleFirstInteraction = () => {
      if (audio.paused) {
        playAudio();
      }
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };

    window.addEventListener("pointerdown", handleFirstInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, []);

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (soundOn) {
      audio.pause();
      setSoundOn(false);
      return;
    }
    audio.volume = 0.28;
    void audio.play();
    setSoundOn(true);
  };

  const replay = () => {
    setScene(0);
  };

  return (
    <main className="celestial-stage relative min-h-[100svh] overflow-x-hidden text-star selection:bg-silver/20">
      {/* Camada 0: Fundo estelar com paralaxe lenta */}
      <CelestialStarfield />

      {/* Sistema de Iluminação de Nebulosa Flutuante (Lava Lamp / Nebulosa Dinâmica) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        {/* Glow Inferior Esquerdo (Luz Principal): Movimento lento e transição suave de azul para roxo (16s) */}
        <div
          className="nebula-lava-primary absolute -bottom-[20%] -left-[15%] size-[min(130vw,70rem)] rounded-full"
          aria-hidden
        />

        {/* Glow Superior Direito (Luz Secundária): Movimento diagonal suave e transição de roxo para azul (20s) */}
        <div
          className="nebula-lava-secondary absolute -top-[18%] -right-[15%] size-[min(120vw,60rem)] rounded-full"
          aria-hidden
        />

        {/* Glow Intermediário Suave: Movimento orgânico com variação sutil (18s) */}
        <div
          className="nebula-lava-tertiary absolute left-[25%] top-[50%] size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
          aria-hidden
        />
      </div>

      {/* Camada 1: Vinheta suave em direção ao tom escuro base (#080C2A) para contraste periférico */}
      <div className="celestial-vignette" aria-hidden />

      {/* Áudio ambiente e ruído celestial sutil */}
      <audio ref={audioRef} src="/audio/celestial-ambient.mp3" loop preload="auto" />
      <div className="celestial-grain pointer-events-none fixed inset-0 z-10" aria-hidden />

      {/* Estrela cadente com asset flexível */}
      <ArcShootingStar mouse={mouse} scrollY={scrollY} />

      {/* Camada de Conteúdo com Mouse e Scroll Parallax */}
      <div className="relative z-20 flex min-h-[100svh] items-center justify-center px-6 py-16 sm:px-8 sm:py-24">
        <AnimatePresence mode="wait">
          {scene === 0 && <GateScene key="gate" mouse={mouse} />}
          {scene === 1 && <SaveTheDateScene key="save" mouse={mouse} scrollY={scrollY} />}
          {scene === 2 && <DateScene key="date" mouse={mouse} scrollY={scrollY} />}
          {scene === 3 && <FinalScene key="final" mouse={mouse} scrollY={scrollY} />}
        </AnimatePresence>
      </div>

      {/* Barra de navegação inferior com escala e acessibilidade */}
      <nav
        aria-label="Progresso do convite"
        className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full border border-silver/10 bg-space-black/60 px-4 py-2 backdrop-blur-md"
      >
        {[0, 1, 2, 3].map((step) => (
          <button
            key={step}
            type="button"
            onClick={() => setScene(step)}
            aria-label={`Ir para cena ${step + 1}`}
            aria-current={scene === step ? "step" : undefined}
            className={`h-1 cursor-pointer rounded-full transition-all duration-500 ${
              scene === step
                ? "w-8 bg-silver shadow-[0_0_8px_var(--silver)]"
                : "w-3 bg-silver/30 hover:bg-silver/70"
            }`}
          />
        ))}
      </nav>

      {/* Botões de controle de topo */}
      {scene < 3 && (
        <Button
          type="button"
          variant="ghost"
          onClick={() => setScene(3)}
          className="fixed right-16 top-4 z-40 font-label text-[0.6rem] uppercase tracking-[0.2em] text-silver/70 hover:bg-silver/10 hover:text-star sm:right-20 sm:top-7"
        >
          Pular <ChevronRight className="ml-1 size-3.5" />
        </Button>
      )}

      {scene === 3 && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={replay}
          aria-label="Rever animação"
          title="Rever animação"
          className="fixed right-16 top-4 z-40 text-silver/70 hover:bg-silver/10 hover:text-star sm:right-20 sm:top-7"
        >
          <RotateCcw className="size-4" />
        </Button>
      )}

      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={toggleSound}
        aria-label={soundOn ? "Desativar música" : "Ativar música"}
        title={soundOn ? "Desativar música" : "Ativar música"}
        className="fixed right-4 top-4 z-40 text-silver/70 hover:bg-silver/10 hover:text-star sm:right-8 sm:top-7"
      >
        {soundOn ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
      </Button>
    </main>
  );
}

/**
 * Estrela cadente flexível apontando para /assets/estrela-cadente.png
 */
function ArcShootingStar({
  mouse,
  scrollY,
}: {
  mouse: { x: number; y: number };
  scrollY: number;
}) {
  return (
    <div
      className="pointer-events-none fixed left-1/2 top-[4%] z-30 w-[min(90vw,56rem)] -translate-x-1/2 transition-transform duration-75"
      style={{
        transform: `translate3d(calc(-50% + ${mouse.x * 16}px), ${mouse.y * 12 - scrollY * 0.15}px, 0)`,
      }}
      aria-hidden
    >
      <img
        src="/assets/estrela-cadente.png"
        alt=""
        className="shooting-star-asset h-auto w-full object-contain"
        onError={(event) => {
          event.currentTarget.style.visibility = "hidden";
        }}
      />
    </div>
  );
}

/**
 * Cena 0: Portões Celestiais abrindo
 */
function GateScene({ mouse }: { mouse: { x: number; y: number } }) {
  return (
    <motion.section
      aria-label="Abertura do convite"
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.6 } }}
    >
      {/* Névoa central difusa vazando pela abertura dos portões */}
      <div
        className="celestial-nebula-mist size-[min(80vw,34rem)] -translate-x-1/2 -translate-y-1/2 opacity-40"
        style={{
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) translate3d(${mouse.x * 10}px, ${mouse.y * 10}px, 0)`,
        }}
        aria-hidden
      />

      <motion.div
        className="gate-panel absolute inset-y-0 left-0 w-1/2 origin-left border-r"
        initial={{ x: 0, rotateY: 0 }}
        animate={{ x: "-98%", rotateY: 18 }}
        transition={{ duration: 4.2, delay: 0.5, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.div
        className="gate-panel absolute inset-y-0 right-0 w-1/2 origin-right border-l"
        initial={{ x: 0, rotateY: 0 }}
        animate={{ x: "98%", rotateY: -18 }}
        transition={{ duration: 4.2, delay: 0.5, ease: [0.65, 0, 0.35, 1] }}
      />

      <motion.div
        className="z-10 flex flex-col items-center text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [0.9, 1, 1, 1.05],
          y: [-4, 4, -4],
        }}
        transition={{
          opacity: { duration: 4.5, times: [0, 0.25, 0.75, 1] },
          scale: { duration: 4.5, times: [0, 0.25, 0.75, 1] },
          y: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{
          transform: `translate3d(${mouse.x * 20}px, ${mouse.y * 16}px, 0)`,
        }}
      >
        <FourPointSparkle size={22} className="mb-4 text-silver" delay={0.2} />
        <p className="font-label text-[0.65rem] uppercase tracking-[0.45em] text-silver/90 sm:text-xs">
          Uma noite especial se aproxima
        </p>
      </motion.div>
    </motion.section>
  );
}

/**
 * Cena 1: Save The Date
 */
function SaveTheDateScene({
  mouse,
  scrollY,
}: {
  mouse: { x: number; y: number };
  scrollY: number;
}) {
  const particles = Array.from({ length: 18 });

  return (
    <motion.section
      aria-labelledby="save-title"
      className="relative flex flex-col items-center text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06, filter: "blur(8px)" }}
      transition={{ duration: 1.6 }}
      style={{
        transform: `translate3d(${mouse.x * 22}px, ${mouse.y * 18 - scrollY * 0.25}px, 0)`,
      }}
    >
      {/* Névoa de iluminação difusa (blur-3xl) em tom azul-púrpura (#2b3068) com opacidade suave */}
      <div
        className="celestial-nebula-mist size-[min(88vw,42rem)] -translate-x-1/2 -translate-y-1/2 opacity-40"
        style={{
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) translate3d(${mouse.x * 12}px, ${mouse.y * 12}px, 0)`,
        }}
        aria-hidden
      />

      {/* Partículas orgânicas dispersas */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-[min(80vw,32rem)] -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      >
        {particles.map((_, index) => (
          <motion.span
            key={index}
            className="absolute left-1/2 top-1/2 size-1 rounded-full bg-star shadow-celestial"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: Math.cos(index * 0.95) * (85 + (index % 5) * 24),
              y: [
                Math.sin(index * 0.95) * (50 + (index % 6) * 18),
                Math.sin(index * 0.95) * (50 + (index % 6) * 18) - 10,
                Math.sin(index * 0.95) * (50 + (index % 6) * 18),
              ],
              opacity: [0, 1, 0.35],
              scale: [0.4, 1.3, 0.7],
            }}
            transition={{
              x: { duration: 2.2, delay: index * 0.05, ease: "easeOut" },
              y: {
                duration: 2.8 + (index % 4) * 0.6,
                repeat: Infinity,
                ease: "easeInOut",
              },
              opacity: { duration: 2.2, delay: index * 0.05 },
              scale: { duration: 2.2, delay: index * 0.05 },
            }}
          />
        ))}
      </div>

      {/* Órbita de partículas com rotação celestial */}
      <div
        className="particle-orbit pointer-events-none absolute left-1/2 top-1/2 size-[min(92vw,38rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-silver/15"
        aria-hidden
      >
        {Array.from({ length: 20 }).map((_, index) => (
          <span
            key={index}
            className="absolute left-1/2 top-1/2 size-1 rounded-full bg-silver shadow-celestial"
            style={{ transform: `rotate(${index * 18}deg) translateX(min(46vw,19rem))` }}
          />
        ))}
      </div>

      {/* Brilhos em formato de cruz de 4 pontas */}
      <SparkleCluster
        sparkles={[
          { top: "-10%", left: "15%", size: 22, delay: 0.2, duration: 3.2, floatAmplitude: 8 },
          { top: "15%", right: "12%", size: 18, delay: 0.8, duration: 3.6, floatAmplitude: 10 },
          { bottom: "8%", left: "18%", size: 20, delay: 1.4, duration: 3.4, floatAmplitude: 7 },
          { bottom: "-12%", right: "20%", size: 24, delay: 2.0, duration: 4.0, floatAmplitude: 9 },
        ]}
      />

      {/* Subtítulo: flutuação com amplitude de 4px em 4.2s */}
      <motion.p
        className="font-label text-[0.62rem] uppercase tracking-[0.52em] text-silver sm:text-xs"
        initial={{ opacity: 0, y: 15 }}
        animate={{
          opacity: 1,
          y: [-4, 4, -4],
        }}
        transition={{
          opacity: { delay: 0.5, duration: 1.2 },
          y: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        Reserve esta noite
      </motion.p>

      {/* Título: flutuação com amplitude de 6px em 3.5s */}
      <motion.h1
        id="save-title"
        className="mt-8 font-script text-6xl text-silver drop-shadow-[0_0_24px_rgba(235,238,255,0.7)] sm:text-8xl md:text-9xl"
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [-6, 6, -6],
        }}
        transition={{
          opacity: { delay: 0.8, duration: 1.6, ease: [0.16, 1, 0.3, 1] },
          scale: { delay: 0.8, duration: 1.6, ease: [0.16, 1, 0.3, 1] },
          y: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 },
        }}
      >
        Save The Date
      </motion.h1>

      <motion.div
        className="mt-10 h-px w-40 bg-gradient-to-r from-transparent via-silver to-transparent sm:w-64"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.4, duration: 1.2 }}
      />
    </motion.section>
  );
}

/**
 * Cena 2: Seção da Data (Reestruturação Rigorosa na Escala de 8px)
 * - Mês 'Dezembro' no topo com espaçamento de 32px (mb-8) em relação ao número '12'.
 * - Ano '2026' posicionado exatamente a 8px (mt-2) da base do número 12.
 * - Brilhos em formato de cruz de 4 pontas com pulsação sutil (twinkle) ao redor da data.
 * - Névoa difusa (blur-3xl) em tom azul-púrpura (#2b3068).
 */
function DateScene({
  mouse,
  scrollY,
}: {
  mouse: { x: number; y: number };
  scrollY: number;
}) {
  return (
    <motion.section
      aria-labelledby="date-title"
      className="relative flex flex-col items-center text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 1.6 }}
      style={{
        transform: `translate3d(${mouse.x * 24}px, ${mouse.y * 18 - scrollY * 0.28}px, 0)`,
      }}
    >
      {/* Névoa de iluminação difusa (blur-3xl) em tom azul-púrpura (#2b3068) com opacidade suave */}
      <div
        className="celestial-nebula-mist size-[min(90vw,44rem)] -translate-x-1/2 -translate-y-1/2 opacity-40"
        style={{
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) translate3d(${mouse.x * 14}px, ${mouse.y * 14}px, 0)`,
        }}
        aria-hidden
      />

      {/* Subtítulo no topo estático */}
      <motion.p
        className="mb-8 font-label text-[0.62rem] uppercase tracking-[0.52em] text-silver sm:mb-10 sm:text-xs"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1.0 }}
      >
        Quando as estrelas se alinharem
      </motion.p>

      <h1 id="date-title" className="sr-only">
        12 de dezembro de 2026
      </h1>

      {/* Container da Data: leitura de cima para baixo (12 -> dezembro -> 2026) estático */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Brilhos em formato de cruz de 4 pontas com pulsação sutil (twinkle) ao redor do bloco da data */}
        <SparkleCluster
          sparkles={[
            { top: "-18%", left: "-10%", size: 24, delay: 0.1, duration: 3.2, floatAmplitude: 8 },
            { top: "6%", right: "-16%", size: 20, delay: 0.6, duration: 3.6, floatAmplitude: 10 },
            { bottom: "16%", left: "-14%", size: 26, delay: 1.2, duration: 3.4, floatAmplitude: 9 },
            { bottom: "-12%", right: "-8%", size: 22, delay: 1.8, duration: 4.0, floatAmplitude: 7 },
            { top: "42%", left: "-22%", size: 16, delay: 0.4, duration: 2.8, floatAmplitude: 6 },
            { top: "35%", right: "-20%", size: 18, delay: 1.5, duration: 3.5, floatAmplitude: 8 },
          ]}
        />

        {/* 1. Número '12' no topo - estático */}
        <motion.span
          className="font-display text-[9.5rem] leading-none text-star drop-shadow-[0_0_32px_rgba(255,255,255,0.65)] sm:text-[13rem] md:text-[15rem]"
          initial={{ opacity: 0, scale: 0.75, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{
            delay: 0.6,
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          12
        </motion.span>

        {/* 2. Mês 'dezembro' no meio - estático */}
        <motion.span
          className="mt-3 font-script text-5xl text-silver drop-shadow-[0_0_22px_rgba(235,238,255,0.75)] sm:mt-5 sm:text-6xl md:text-7xl"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.9,
            duration: 1.0,
          }}
        >
          dezembro
        </motion.span>

        {/* 3. Ano '2026' na base - estático */}
        <motion.span
          className="mt-3 font-display text-2xl tracking-[0.55em] text-star drop-shadow-[0_0_14px_rgba(235,238,255,0.5)] sm:mt-5 sm:text-3xl md:text-4xl"
          initial={{ opacity: 0, letterSpacing: "0.85em" }}
          animate={{ opacity: 1, letterSpacing: "0.55em" }}
          transition={{
            delay: 1.2,
            duration: 1.0,
          }}
        >
          2026
        </motion.span>
      </div>
    </motion.section>
  );
}

/**
 * Cena Final: GABRIELA, Personagem, 15 Anos e Confirmação
 * - Personagem com flutuação de amplitude de 12px em 5s e proporção flexível.
 * - Brilhos em formato de cruz de 4 pontas com pulsação sutil (twinkle).
 * - Seção do Nome: 'GABRIELA' centralizado de forma ampla com no mínimo 48px (my-12) de distância dos blocos adjacentes.
 * - Flutuação assíncrona com frequências distintas para cada elemento.
 */
function FinalScene({
  mouse,
  scrollY,
}: {
  mouse: { x: number; y: number };
  scrollY: number;
}) {
  return (
    <motion.section
      aria-labelledby="gabi-title"
      className="relative flex w-full max-w-4xl flex-col items-center justify-between text-center pt-2 pb-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.8 }}
      style={{
        transform: `translate3d(${mouse.x * 22}px, ${mouse.y * 16 - scrollY * 0.28}px, 0)`,
      }}
    >
      {/* Névoa de iluminação difusa (blur-3xl) em tom azul-púrpura (#2b3068) com opacidade suave */}
      <div
        className="celestial-nebula-mist size-[min(92vw,48rem)] -translate-x-1/2 -translate-y-1/2 opacity-40"
        style={{
          left: "50%",
          top: "38%",
          transform: `translate(-50%, -50%) translate3d(${mouse.x * 12}px, ${mouse.y * 12}px, 0)`,
        }}
        aria-hidden
      />

      {/* Bloco de Conteúdo Superior e Intermediário com Textos Parados (Estáticos) */}
      <div className="relative z-20 flex w-full flex-col items-center">
        {/* Seção do Nome: 'GABI' centralizado e aproximado da linha do 15 anos */}
        <motion.h1
          id="gabi-title"
          className="mt-8 mb-2 font-display text-[clamp(3.8rem,13vw,8.5rem)] leading-none tracking-[0.15em] text-star drop-shadow-[0_0_32px_rgba(235,238,255,0.7)] sm:mt-10 sm:mb-3"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.4,
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          GABI
        </motion.h1>

        {/* Linha de celebração dos 15 Anos - estático com largura balanceada */}
        <motion.div
          className="flex w-full max-w-[19rem] items-center justify-center gap-3 sm:max-w-[27rem] sm:gap-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.7,
            duration: 1.0,
          }}
        >
          <span className="h-px flex-1 bg-silver/75" />
          <div className="flex items-baseline gap-3 sm:gap-5">
            <span className="font-script text-6xl leading-none text-silver sm:text-7xl">15</span>
            <YearsWord />
          </div>
          <span className="h-px flex-1 bg-silver/75" />
        </motion.div>

        {/* Frase poética - estático */}
        <motion.p
          className="mt-8 max-w-2xl font-label text-[0.7rem] uppercase leading-7 tracking-[0.24em] text-silver sm:text-sm sm:leading-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1.0,
            duration: 1.0,
          }}
        >
          Sob um céu de sonhos e estrelas,
          <br className="hidden sm:block" /> uma noite inesquecível nos espera!
        </motion.p>

        {/* Bloco de Confirmação e Chamada - com a mesma largura da linha do 15 anos e frase balanceada sem palavra órfã */}
        <motion.div
          className="mt-10 flex w-full flex-col items-center gap-6 sm:mt-14 sm:gap-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1.3,
            duration: 1.0,
          }}
        >
          <p className="max-w-md text-balance text-center font-label text-[0.80rem] uppercase leading-6 tracking-[0.22em] text-silver/90 sm:text-[0.92rem] sm:leading-7">
            Confirme a sua presença
            <br />
            para receber o convite oficial
          </p>
          <Button
            asChild
            variant="celestial"
            size="celestial"
            className="h-14 w-full max-w-[19rem] justify-center px-4 text-xs font-semibold tracking-[0.22em] shadow-[0_0_24px_rgba(235,238,255,0.25)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_36px_rgba(255,255,255,0.45)] sm:h-16 sm:max-w-[27rem] sm:text-sm sm:tracking-[0.26em]"
          >
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
              Confirmar presença
            </a>
          </Button>
        </motion.div>
      </div>

      {/* Personagem posicionada na parte de baixo, ocultando qualquer corte inferior */}
      <FloatingCharacter mouse={mouse} />
    </motion.section>
  );
}

/**
 * Personagem posicionada na parte de baixo com Efeito Antigravity
 * - A imagem fica assentada na parte inferior (object-bottom), sem deixar a base visível.
 * - Gradiente suave de fusão na base com #04050d para garantir acabamento estelar contínuo.
 * - Animação fluida de 'respiro' (subindo e descendo 5px bem devagar em ciclo infinito).
 * - Filtro drop-shadow sutil com tom azulado e dourado celestial para integrá-la ao fundo.
 * - Brilhos em formato de cruz de 4 pontas (twinkle) ao redor da menina.
 */
function FloatingCharacter({ mouse }: { mouse: { x: number; y: number } }) {
  const [imageLoaded, setImageLoaded] = useState(true);

  return (
    <div
      className="relative z-10 mt-14 flex w-full flex-col items-center justify-end overflow-hidden sm:mt-20 md:mt-24"
      style={{
        transform: `translate3d(${mouse.x * 24}px, ${mouse.y * 14}px, 0)`,
      }}
    >
      {/* Névoa de iluminação difusa (blur-3xl) atrás da personagem */}
      <div
        className="celestial-nebula-mist size-[min(80vw,28rem)] -translate-x-1/2 opacity-40"
        style={{ left: "50%", bottom: "0%" }}
        aria-hidden
      />

      {/* Brilhos em formato de cruz de 4 pontas com pulsação sutil (twinkle) ao redor da personagem */}
      <SparkleCluster
        sparkles={[
          { top: "6%", left: "14%", size: 24, delay: 0.1, duration: 3.2, floatAmplitude: 8 },
          { top: "20%", right: "12%", size: 20, delay: 0.7, duration: 3.6, floatAmplitude: 10 },
          { top: "45%", left: "10%", size: 22, delay: 1.3, duration: 3.4, floatAmplitude: 8 },
          { top: "35%", right: "15%", size: 18, delay: 1.9, duration: 4.0, floatAmplitude: 7 },
          { top: "2%", right: "22%", size: 16, delay: 0.4, duration: 2.8, floatAmplitude: 6 },
        ]}
      />

      {/* Container da imagem com animação fluida de 'respiro' e máscara de recorte suave sem caixa escura */}
      {imageLoaded && (
        <motion.div
          className="relative flex items-end justify-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{
            opacity: 1,
            y: [-5, 5, -5],
          }}
          transition={{
            opacity: { delay: 0.4, duration: 1.2 },
            y: { duration: 5.8, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
          }}
        >
          <img
            src={CHARACTER_IMAGE_SRC}
            alt="Personagem Gabriela"
            className="relative z-10 max-h-[36svh] w-auto max-w-[min(88vw,24rem)] object-contain object-bottom sm:max-h-[46svh]"
            style={{
              filter:
                "drop-shadow(0 0 16px rgba(96, 145, 255, 0.30)) drop-shadow(0 0 32px rgba(245, 212, 130, 0.18))",
              WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
            }}
            onError={() => setImageLoaded(false)}
          />
        </motion.div>
      )}

      {/* Fallback celestial delicado caso a imagem não esteja pronta */}
      {!imageLoaded && (
        <div className="relative z-10 mb-4 flex size-32 items-center justify-center rounded-full border border-silver/20 bg-silver/5 shadow-celestial">
          <span className="font-script text-3xl text-silver/80">G</span>
        </div>
      )}
    </div>
  );
}

function YearsWord() {
  return (
    <span
      className="years-word font-display text-base uppercase tracking-[0.32em] text-silver sm:text-lg"
      aria-label="anos"
    >
      <span className="years-letter years-letter-a">
        A
        <img
          src="/assets/brilho-anos-a.png"
          alt=""
          className="letter-spark-asset letter-spark-a"
          onError={(event) => {
            event.currentTarget.style.visibility = "hidden";
          }}
          aria-hidden
        />
      </span>
      <span>N</span>
      <span className="years-letter years-letter-o">
        O
        <img
          src="/assets/brilho-anos-o.png"
          alt=""
          className="letter-spark-asset letter-spark-o"
          onError={(event) => {
            event.currentTarget.style.visibility = "hidden";
          }}
          aria-hidden
        />
      </span>
      <span>S</span>
    </span>
  );
}
