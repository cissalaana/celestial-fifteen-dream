import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, RotateCcw, Volume2, VolumeX, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { CelestialStarfield } from "@/components/celestial-starfield";
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
    ],
  }),
  component: Index,
});

const sceneDuration = [5200, 6500, 6500];

function Index() {
  const [scene, setScene] = useState(0);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [confirmedName, setConfirmedName] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

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
    setRsvpOpen(false);
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
          {scene === 3 && <FinalScene key="final" onRsvp={() => setRsvpOpen(true)} />}
        </AnimatePresence>
      </div>

      <nav
        aria-label="Progresso do convite"
        className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2"
      >
        {[0, 1, 2, 3].map((step) => (
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

      {scene < 3 && (
        <Button
          type="button"
          variant="ghost"
          onClick={() => setScene(3)}
          className="fixed right-16 top-4 z-40 font-label text-[0.6rem] uppercase tracking-[0.18em] text-silver/65 hover:bg-silver/10 hover:text-star sm:right-20 sm:top-7"
        >
          Pular <ChevronRight />
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

      <RsvpDialog
        open={rsvpOpen}
        onClose={() => setRsvpOpen(false)}
        confirmedName={confirmedName}
        onConfirm={setConfirmedName}
      />
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
      <div className="mt-10 flex flex-col items-center sm:mt-12" aria-hidden>
        <motion.span
          className="mb-10 font-script text-4xl text-silver sm:mb-12 sm:text-5xl"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 1.5 }}
        >
          Dezembro
        </motion.span>
        <motion.span
          className="font-display text-[9rem] leading-[0.78] text-star sm:text-[12rem]"
          initial={{ opacity: 0, scale: 0.65, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ delay: 1.35, duration: 1.5 }}
        >
          12
        </motion.span>
        <motion.span
          className="mt-2 font-label text-base tracking-[0.42em] text-star sm:text-lg"
          initial={{ opacity: 0, letterSpacing: "0.8em" }}
          animate={{ opacity: 1, letterSpacing: "0.42em" }}
          transition={{ delay: 1.8, duration: 1.5 }}
        >
          2026
        </motion.span>
      </div>
    </motion.section>
  );
}

function FinalScene({ onRsvp }: { onRsvp: () => void }) {
  return (
    <motion.section
      aria-labelledby="gabriela-title"
      className="relative flex w-full max-w-4xl flex-col items-center text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.8 }}
    >
      <div className="text-glow-island" aria-hidden />
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
        <Button variant="celestial" size="celestial" onClick={onRsvp}>
          Confirmar presença
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

type RsvpDialogProps = {
  open: boolean;
  onClose: () => void;
  confirmedName: string;
  onConfirm: (name: string) => void;
};

function RsvpDialog({ open, onClose, confirmedName, onConfirm }: RsvpDialogProps) {
  const [name, setName] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanName = name.trim();
    if (cleanName) onConfirm(cleanName);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-night/80 px-5 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="rsvp-title"
        >
          <motion.div
            className="relative w-full max-w-md border border-silver/40 bg-night-soft/95 px-7 py-9 text-center shadow-celestial sm:px-10 sm:py-11"
            initial={{ opacity: 0, scale: 0.92, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Fechar"
              className="absolute right-2 top-2 text-silver/65 hover:bg-silver/10 hover:text-star"
            >
              <X />
            </Button>
            {confirmedName ? (
              <div className="flex flex-col items-center">
                <div className="mb-6 flex size-14 items-center justify-center rounded-full border border-silver/60 bg-silver/10 text-silver">
                  <Check className="size-6" />
                </div>
                <h2 id="rsvp-title" className="font-script text-4xl text-star">
                  Presença confirmada
                </h2>
                <p className="mt-4 font-label text-[0.68rem] uppercase leading-6 tracking-[0.16em] text-silver/75">
                  Obrigada, {confirmedName}.<br />
                  Em breve você receberá o convite oficial.
                </p>
                <Button className="mt-8" variant="celestial" size="celestial" onClick={onClose}>
                  Voltar ao céu
                </Button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h2 id="rsvp-title" className="font-script text-4xl text-star sm:text-5xl">
                  Você estará lá?
                </h2>
                <p className="mt-3 font-label text-[0.62rem] uppercase leading-5 tracking-[0.18em] text-silver/65">
                  Deixe seu nome para confirmar presença
                </p>
                <label htmlFor="guest-name" className="sr-only">
                  Seu nome
                </label>
                <input
                  id="guest-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  autoFocus
                  placeholder="SEU NOME"
                  className="mt-8 h-12 w-full border-x-0 border-b border-t-0 border-silver/45 bg-transparent px-2 text-center font-label text-xs uppercase tracking-[0.18em] text-star outline-none placeholder:text-silver/35 focus:border-star"
                />
                <Button className="mt-7 w-full" variant="celestial" size="celestial" type="submit">
                  Confirmar <Check />
                </Button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
