import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { CelestialStarfield } from "@/components/celestial-starfield";
import { Button } from "@/components/ui/button";
import characterAsset from "@/assets/personagem-a-noite-de-uma-estrela.png";

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
    ],
  }),
  component: Index,
});

const sceneDuration = [5200, 6500, 6500, 6000];
const WHATSAPP_LINK =
  "https://wa.me/5581992895842?text=Pode%20contar%20com%20a%20minha%20presen%C3%A7a!%20Te%20vejo%20l%C3%A1";

function Index() {
  const [scene, setScene] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (scene >= 4) return;
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
    audio
      .play()
      .then(() => {
        let volume = 0;
        const fade = window.setInterval(() => {
          volume = Math.min(0.22, volume + 0.02);
          audio.volume = volume;
          if (volume >= 0.22) window.clearInterval(fade);
        }, 180);
      })
      .catch(() => setSoundOn(false));
  }, []);

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (soundOn) {
      audio.pause();
      setSoundOn(false);
      return;
    }
    audio.volume = 0.22;
    void audio.play();
    setSoundOn(true);
  };

  const replay = () => {
    setScene(0);
  };

  return (
    <main className="celestial-stage relative min-h-[100svh] overflow-hidden text-star">
      <CelestialStarfield />
      <audio ref={audioRef} src="/audio/celestial-ambient.mp3" loop preload="auto" />
      <div className="celestial-grain pointer-events-none fixed inset-0 z-10" aria-hidden />
      <ArcShootingStar />

      <div className="relative z-20 flex min-h-[100svh] items-center justify-center px-6 py-12">
        <AnimatePresence mode="wait">
          {scene === 0 && <GateScene key="gate" />}
          {scene === 1 && <SaveTheDateScene key="save" />}
          {scene === 2 && <DateScene key="date" />}
          {scene === 3 && <CharacterScene key="character" />}
          {scene === 4 && <FinalScene key="final" />}
        </AnimatePresence>
      </div>

      <nav
        aria-label="Progresso do convite"
        className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2"
      >
        {[0, 1, 2, 3, 4].map((step) => (
          <button
            key={step}
            type="button"
            onClick={() => setScene(step)}
            aria-label={`Ir para cena ${step + 1}`}
            aria-current={scene === step ? "step" : undefined}
            className={`h-px cursor-pointer transition-all duration-500 ${scene === step ? "w-10 bg-silver" : "w-5 bg-silver/35 hover:bg-silver/70"}`}
          />
        ))}
      </nav>

      {scene < 4 && (
        <Button
          type="button"
          variant="ghost"
          onClick={() => setScene(4)}
          className="fixed right-16 top-4 z-40 font-label text-[0.6rem] uppercase tracking-[0.18em] text-silver/65 hover:bg-silver/10 hover:text-star sm:right-20 sm:top-7"
        >
          Pular <ChevronRight />
        </Button>
      )}

      {scene === 4 && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={replay}
          aria-label="Rever animação"
          title="Rever animação"
          className="fixed right-16 top-4 z-40 text-silver/65 hover:bg-silver/10 hover:text-star sm:right-20 sm:top-7"
        >
          <RotateCcw />
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
        {soundOn ? <Volume2 /> : <VolumeX />}
      </Button>
    </main>
  );
}

function ArcShootingStar() {
  return (
    <img
      src="/assets/estrela-cadente.png"
      alt=""
      className="shooting-star-asset pointer-events-none fixed left-1/2 top-[5%] z-30 w-[min(88vw,58rem)] -translate-x-1/2 object-contain"
      onError={(event) => {
        event.currentTarget.style.visibility = "hidden";
      }}
      aria-hidden
    />
  );
}

function GateScene() {
  return (
    <motion.section
      aria-label="Abertura do convite"
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.6 } }}
    >
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
        className="z-10 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.9, 1, 1, 1.05] }}
        transition={{ duration: 4.5, times: [0, 0.25, 0.72, 1] }}
      >
        <p className="font-label text-[0.65rem] uppercase tracking-[0.42em] text-silver/85 sm:text-xs">
          Uma noite especial se aproxima
        </p>
      </motion.div>
    </motion.section>
  );
}

function SaveTheDateScene() {
  const particles = Array.from({ length: 18 });
  return (
    <motion.section
      aria-labelledby="save-title"
      className="relative flex flex-col items-center text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }}
      transition={{ duration: 1.7 }}
    >
      <div className="text-glow-island" aria-hidden />
      <TwinkleStars />
      <div
        className="absolute left-1/2 top-1/2 size-[min(80vw,32rem)] -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      >
        {particles.map((_, index) => (
          <motion.span
            key={index}
            className="absolute left-1/2 top-1/2 size-1 rounded-full bg-star shadow-celestial"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: Math.cos(index * 0.95) * (80 + (index % 5) * 22),
              y: Math.sin(index * 0.95) * (50 + (index % 6) * 16),
              opacity: [0, 1, 0.25],
              scale: [0.4, 1.4, 0.7],
            }}
            transition={{ duration: 2.2, delay: index * 0.05, ease: "easeOut" }}
          />
        ))}
      </div>
      <div
        className="particle-orbit pointer-events-none absolute left-1/2 top-1/2 size-[min(92vw,38rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-silver/15"
        aria-hidden
      >
        {Array.from({ length: 24 }).map((_, index) => (
          <span
            key={index}
            className="absolute left-1/2 top-1/2 size-1 rounded-full bg-silver shadow-celestial"
            style={{ transform: `rotate(${index * 15}deg) translateX(min(46vw,19rem))` }}
          />
        ))}
      </div>
      <motion.p
        className="font-label text-[0.62rem] uppercase tracking-[0.5em] text-silver sm:text-xs"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Reserve esta noite
      </motion.p>
      <motion.h1
        id="save-title"
        className="mt-7 font-script text-6xl text-silver drop-shadow-[0_0_22px_var(--silver)] sm:text-8xl md:text-9xl"
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      >
        Save The Date
      </motion.h1>
      <motion.div
        className="mt-9 h-px w-40 bg-gradient-to-r from-transparent via-silver to-transparent sm:w-64"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.4, duration: 1.2 }}
      />
    </motion.section>
  );
}

function DateScene() {
  return (
    <motion.section
      aria-labelledby="date-title"
      className="relative flex flex-col items-center text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 1.7 }}
    >
      <div className="text-glow-island" aria-hidden />
      <TwinkleStars />
      <motion.p
        className="font-label text-[0.62rem] uppercase tracking-[0.5em] text-silver sm:text-xs"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.15, duration: 1.5 }}
      >
        Quando as estrelas se alinharem
      </motion.p>
      <h1 id="date-title" className="sr-only">
        12 de dezembro de 2026
      </h1>
      <div className="mt-8 flex flex-col items-center sm:mt-10" aria-hidden>
        <motion.span
          className="font-display text-[9rem] leading-[0.78] text-star sm:text-[12rem]"
          initial={{ opacity: 0, scale: 0.65, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ delay: 1.35, duration: 1.5 }}
        >
          12
        </motion.span>
        <motion.span
          className="date-month-overlay font-script text-5xl text-silver drop-shadow-[0_0_18px_var(--silver)] sm:text-6xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.75, duration: 1.5 }}
        >
          dezembro
        </motion.span>
        <motion.span
          className="mt-6 font-display text-2xl tracking-[0.5em] text-star sm:mt-7 sm:text-3xl"
          initial={{ opacity: 0, letterSpacing: "0.9em" }}
          animate={{ opacity: 1, letterSpacing: "0.5em" }}
          transition={{ delay: 2.1, duration: 1.5 }}
        >
          2026
        </motion.span>
      </div>
    </motion.section>
  );
}

function CharacterScene() {
  return (
    <motion.section
      aria-label="A noite de uma estrela"
      className="relative flex w-full max-w-3xl items-center justify-center text-center"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.03, y: -24 }}
      viewport={{ once: true }}
      transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="character-glow" aria-hidden />
      <TwinkleStars variant="character" />
      <motion.img
        src={characterAsset}
        alt="Jovem de costas com vestido azul estrelado e laço no cabelo"
        className="character-illustration relative z-10 max-h-[72svh] w-auto max-w-[min(92vw,38rem)] object-contain"
        animate={{ y: [0, -6, 0, 6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.section>
  );
}

function FinalScene() {
  return (
    <motion.section
      aria-labelledby="gabriela-title"
      className="relative flex w-full max-w-4xl flex-col items-center text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.8 }}
    >
      <div className="text-glow-island" aria-hidden />
      <TwinkleStars />
      <motion.h1
        id="gabriela-title"
        className="font-display text-[clamp(3.3rem,12vw,8rem)] leading-none tracking-[0.08em] text-star drop-shadow-[0_0_24px_var(--silver)]"
        initial={{ opacity: 0, scale: 0.86 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
      >
        GABRIELA
      </motion.h1>
      <motion.div
        className="mt-5 flex items-baseline justify-center gap-3 sm:gap-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="h-px w-10 bg-silver sm:w-24" />
        <span className="font-script text-6xl leading-none text-silver sm:text-7xl">15</span>
        <YearsWord />
        <span className="h-px w-10 bg-silver sm:w-24" />
      </motion.div>
      <motion.p
        className="mt-8 max-w-2xl font-label text-[0.7rem] uppercase leading-7 tracking-[0.2em] text-silver sm:text-sm sm:leading-8"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        Sob um céu de sonhos e estrelas,
        <br className="hidden sm:block" /> uma noite estrelada nos espera!
      </motion.p>
      <motion.div
        className="mt-8 flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
      >
        <p className="max-w-lg font-label text-[0.55rem] uppercase leading-5 tracking-[0.18em] text-silver/70 sm:text-[0.65rem]">
          Confirme a sua presença para receber o convite oficial
        </p>
        <Button asChild variant="celestial" size="celestial">
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
            Confirmar presença
          </a>
        </Button>
      </motion.div>
    </motion.section>
  );
}

function TwinkleStars({ variant = "text" }: { variant?: "text" | "character" }) {
  const positions =
    variant === "character"
      ? [
          "left-[9%] top-[18%]",
          "right-[8%] top-[28%]",
          "left-[4%] bottom-[25%]",
          "right-[4%] bottom-[15%]",
        ]
      : ["left-[-8%] top-[8%]", "right-[-6%] top-[28%]", "left-[2%] bottom-[8%]"];

  return (
    <div className="pointer-events-none absolute inset-0 z-20" aria-hidden>
      {positions.map((position, index) => (
        <span
          key={position}
          className={`twinkle-star ${position}`}
          style={{ animationDelay: `${index * 0.7}s` }}
        />
      ))}
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
