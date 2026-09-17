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

const sceneDuration = [3800];
const WHATSAPP_LINK =
  "https://wa.me/5581988079987?text=Pode%20contar%20com%20a%20minha%20presen%C3%A7a!%20Te%20vejo%20l%C3%A1";

// Imagem transparente da boneca (sem fundo, totalmente vazada)
const CHARACTER_IMAGE_SRC = "/assets/A noite de uma estrela (3).png";
const FALLBACK_CHARACTER_SRC = "/assets/personagem.png";

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
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mouse = useMouseParallax();
  const scrollY = useScrollParallax();

  useEffect(() => {
    if (scene >= 1) return;
    const timeout = window.setTimeout(
      () => setScene(1),
      sceneDuration[0],
    );
    return () => window.clearTimeout(timeout);
  }, [scene]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0.5; // volume suave em 50%

    const startAudio = () => {
      if (!isMuted) {
        audio.play().catch(() => {});
      }
      // Remova os ouvintes após a primeira interação desbloquear o áudio
      window.removeEventListener("click", startAudio);
      window.removeEventListener("touchstart", startAudio);
      window.removeEventListener("scroll", startAudio);
    };

    // Tenta tocar imediatamente
    audio.play().catch(() => {
      // Se o navegador bloquear, escuta a primeira interação do usuário
      window.addEventListener("click", startAudio);
      window.addEventListener("touchstart", startAudio);
      window.addEventListener("scroll", startAudio);
    });

    return () => {
      window.removeEventListener("click", startAudio);
      window.removeEventListener("touchstart", startAudio);
      window.removeEventListener("scroll", startAudio);
    };
  }, [isMuted]);

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isMuted) {
      audio.pause();
      setIsMuted(true);
    } else {
      audio.volume = 0.5;
      audio.play().catch(() => {});
      setIsMuted(false);
    }
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

      {/* Áudio ambiente com autoplay e reprodução contínua */}
      <audio
        ref={audioRef}
        src="/audio/celestial-ambient.mp3"
        autoPlay
        loop
        preload="auto"
        playsInline
      />
      <div className="celestial-grain pointer-events-none fixed inset-0 z-10" aria-hidden />

      {/* Estrela cadente com asset flexível */}
      <ArcShootingStar mouse={mouse} scrollY={scrollY} />

      {/* Camada de Conteúdo Responsiva Mobile-First (Sem sobreposição) */}
      <div className="relative z-20 flex min-h-[100svh] w-full flex-col items-center justify-start overflow-y-auto px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <AnimatePresence mode="wait">
          {scene === 0 && <GateScene key="gate" mouse={mouse} />}
          {scene === 1 && (
            <UnifiedInvitationScene
              key="unified"
              mouse={mouse}
              scrollY={scrollY}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Botões de controle de topo */}
      {scene === 0 && (
        <Button
          type="button"
          variant="ghost"
          onClick={() => setScene(1)}
          className="fixed right-16 top-4 z-40 font-label text-[0.6rem] uppercase tracking-[0.2em] text-silver/70 hover:bg-silver/10 hover:text-star sm:right-20 sm:top-7"
        >
          Pular <ChevronRight className="ml-1 size-3.5" />
        </Button>
      )}

      {scene === 1 && (
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
        aria-label={isMuted ? "Ativar música" : "Desativar música"}
        title={isMuted ? "Ativar música" : "Desativar música"}
        className="fixed right-4 top-4 z-40 text-silver/70 hover:bg-silver/10 hover:text-star sm:right-8 sm:top-7"
      >
        {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
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
        className="celestial-nebula-mist size-[min(80vw,34rem)] -translate-x-1/2 -translate-y-1/2 blur-[100px] opacity-20"
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
 * Cena Principal: Convite Celestial Unificado Responsivo (Mobile-First)
 * - Ordem vertical rigorosa na escala de 8px:
 *   1. Estrela Cadente no topo
 *   2. Frase "UMA NOITE ESPECIAL SE APROXIMA" e "Save The Date"
 *   3. Bloco da Data: "Dezembro" no topo, "12" centralizado grande e "2026" logo abaixo (com gap-2 / 8px)
 *   4. Ilustração da Personagem (max-w-[220px] centralizada) com Glow Halo difuso e Antigravity
 *   5. Nome "GABRIELA 15 ANOS" perfeitamente alinhado e centralizado
 *   6. Botão "CONFIRMAR PRESENÇA"
 */
function UnifiedInvitationScene({
  mouse,
  scrollY,
}: {
  mouse: { x: number; y: number };
  scrollY: number;
}) {
  const [imageLoaded, setImageLoaded] = useState(true);

  return (
    <motion.section
      aria-label="Convite oficial Gabriela 15 Anos"
      className="relative z-20 flex w-full max-w-xl md:max-w-2xl flex-col items-center justify-center gap-6 sm:gap-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transform: `translate3d(${mouse.x * 10}px, ${mouse.y * 8 - scrollY * 0.12}px, 0)`,
      }}
    >
      {/* 1. Estrela Cadente no topo */}
      <motion.div
        className="relative flex w-full max-w-[240px] sm:max-w-[300px] items-center justify-center -mt-2 sm:-mt-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 1.0 }}
        aria-hidden
      >
        <img
          src="/assets/estrela-cadente.png"
          alt=""
          className="shooting-star-asset h-auto w-full object-contain"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      </motion.div>

      {/* 2. Frase 'UMA NOITE ESPECIAL SE APROXIMA' e 'Save The Date' */}
      <div className="flex flex-col items-center gap-2 sm:gap-3">
        <motion.p
          className="font-label text-[0.65rem] uppercase tracking-[0.45em] text-silver/90 sm:text-xs"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Uma noite especial se aproxima
        </motion.p>
        <motion.h2
          id="save-date-heading"
          className="font-script text-5xl text-silver drop-shadow-[0_0_22px_var(--silver)] sm:text-7xl md:text-8xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45, duration: 1.0 }}
        >
          Save The Date
        </motion.h2>
        <motion.div
          className="mt-1 h-px w-28 bg-gradient-to-r from-transparent via-silver/70 to-transparent sm:w-44"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        />
      </div>

      {/* 3. Bloco da Data: 'Dezembro' no topo, '12' centralizado grande e '2026' logo abaixo (com gap-2 / 8px de distância interna) */}
      <motion.div
        className="relative flex flex-col items-center justify-center gap-2 text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 1.0 }}
      >
        <SparkleCluster
          sparkles={[
            { top: "-15%", left: "-18%", size: 20, delay: 0.1, duration: 3.2, floatAmplitude: 6 },
            { top: "15%", right: "-20%", size: 18, delay: 0.6, duration: 3.6, floatAmplitude: 8 },
            { bottom: "-10%", left: "-14%", size: 22, delay: 1.2, duration: 3.4, floatAmplitude: 7 },
            { bottom: "-8%", right: "-12%", size: 16, delay: 1.8, duration: 4.0, floatAmplitude: 6 },
          ]}
        />
        <span className="font-script text-3xl text-silver drop-shadow-[0_0_16px_rgba(235,238,255,0.75)] sm:text-4xl md:text-5xl">
          Dezembro
        </span>
        <span className="font-display text-[7.5rem] leading-[0.78] text-star drop-shadow-[0_0_32px_rgba(255,255,255,0.65)] sm:text-[10rem] md:text-[11.5rem]">
          12
        </span>
        <span className="font-display text-xl tracking-[0.52em] text-star drop-shadow-[0_0_14px_rgba(235,238,255,0.5)] sm:text-2xl md:text-3xl">
          2026
        </span>
      </motion.div>

      {/* 4. Ilustração da Personagem (max-w-[220px] centralizada) com fundo limpo e transparente */}
      <div className="relative flex w-full flex-col items-center justify-center my-1 sm:my-2">

        {/* Brilhos twinkle sutis ao redor da boneca */}
        <SparkleCluster
          sparkles={[
            { top: "6%", left: "14%", size: 20, delay: 0.1, duration: 3.2, floatAmplitude: 6 },
            { top: "20%", right: "12%", size: 18, delay: 0.7, duration: 3.6, floatAmplitude: 8 },
            { top: "45%", left: "10%", size: 18, delay: 1.3, duration: 3.4, floatAmplitude: 6 },
            { top: "35%", right: "15%", size: 16, delay: 1.9, duration: 4.0, floatAmplitude: 7 },
            { top: "2%", right: "22%", size: 14, delay: 0.4, duration: 2.8, floatAmplitude: 5 },
          ]}
        />

        {/* Boneca com animação Antigravity suave e fundo vazado */}
        {imageLoaded && (
          <motion.div
            className="relative flex items-end justify-center"
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
            }}
          >
            <img
              src={CHARACTER_IMAGE_SRC}
              alt="Ilustração da aniversariante Gabriela"
              className="relative z-10 w-full max-w-[190px] sm:max-w-[220px] object-contain object-bottom"
              onError={(e) => {
                if (e.currentTarget.src !== window.location.origin + FALLBACK_CHARACTER_SRC) {
                  e.currentTarget.src = FALLBACK_CHARACTER_SRC;
                } else {
                  setImageLoaded(false);
                }
              }}
            />
          </motion.div>
        )}

        {/* Fallback caso a imagem não carregue */}
        {!imageLoaded && (
          <div className="relative z-10 mb-4 flex size-28 items-center justify-center rounded-full border border-silver/20 bg-silver/5 shadow-celestial">
            <span className="font-script text-3xl text-silver/80">G</span>
          </div>
        )}
      </div>

      {/* 5. Nome 'GABRIELA 15 ANOS' perfeitamente alinhado e centralizado */}
      <div className="flex w-full flex-col items-center gap-3">
        <motion.h1
          id="gabriela-title"
          className="font-display text-[clamp(3.4rem,11vw,6.5rem)] leading-none tracking-[0.14em] text-star drop-shadow-[0_0_32px_rgba(235,238,255,0.7)]"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.85, duration: 1.0 }}
        >
          GABRIELA
        </motion.h1>

        {/* Linha de celebração dos 15 Anos */}
        <motion.div
          className="flex w-full max-w-[17rem] sm:max-w-[22rem] items-center justify-center gap-3 sm:gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.9 }}
        >
          <span className="h-px flex-1 bg-silver/75" />
          <div className="flex items-baseline gap-3 sm:gap-4">
            <span className="font-script text-5xl leading-none text-silver sm:text-6xl">15</span>
            <YearsWord />
          </div>
          <span className="h-px flex-1 bg-silver/75" />
        </motion.div>

        {/* Frase poética */}
        <motion.p
          className="mt-2 max-w-md font-label text-[0.68rem] uppercase leading-6 tracking-[0.22em] text-silver sm:text-xs sm:leading-7"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.9 }}
        >
          Sob um céu de sonhos e estrelas,
          <br className="hidden sm:block" /> uma noite inesquecível nos espera!
        </motion.p>
      </div>

      {/* 6. Botão 'CONFIRMAR PRESENÇA' */}
      <motion.div
        className="flex w-full flex-col items-center gap-4 sm:gap-6 pt-2 pb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.15, duration: 0.9 }}
      >
        <p className="max-w-md text-balance text-center font-label text-[0.78rem] uppercase leading-6 tracking-[0.2em] text-silver/90 sm:text-[0.88rem] sm:leading-7">
          Confirme a sua presença
          <br />
          para receber o convite oficial
        </p>
        <Button
          asChild
          variant="celestial"
          size="celestial"
          className="h-13 w-full max-w-[17rem] justify-center px-4 text-xs font-semibold tracking-[0.22em] shadow-[0_0_24px_rgba(235,238,255,0.25)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_36px_rgba(255,255,255,0.45)] sm:h-15 sm:max-w-[22rem] sm:text-sm sm:tracking-[0.26em]"
        >
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
            Confirmar presença
          </a>
        </Button>
      </motion.div>
    </motion.section>
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
