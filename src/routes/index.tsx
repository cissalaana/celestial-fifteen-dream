import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, RotateCcw, Sparkles, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
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
          "Reserve a data: 29 de outubro de 2026. Uma noite de sonhos e estrelas nos espera.",
      },
      { property: "og:title", content: "Gabriela — Save the Date | 15 anos" },
      {
        property: "og:description",
        content: "29 de outubro de 2026 — uma noite de sonhos e estrelas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const sceneDuration = [3800, 5000, 5100];

function Index() {
  const [scene, setScene] = useState(0);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [confirmedName, setConfirmedName] = useState("");

  useEffect(() => {
    if (scene >= 3) return;
    const timeout = window.setTimeout(
      () => setScene((current) => current + 1),
      sceneDuration[scene],
    );
    return () => window.clearTimeout(timeout);
  }, [scene]);

  const replay = () => {
    setRsvpOpen(false);
    setScene(0);
  };

  return (
    <main className="celestial-stage relative min-h-[100svh] overflow-hidden text-star">
      <CelestialStarfield />
      <div className="cosmic-haze pointer-events-none fixed inset-[15%] z-0" aria-hidden />
      <div className="celestial-grain pointer-events-none fixed inset-0 z-10" aria-hidden />
      <div
        className="moon-crescent pointer-events-none fixed left-5 top-2 z-10 opacity-75 sm:left-12 sm:top-8"
        aria-hidden
      />

      <div
        className="pointer-events-none fixed right-8 top-12 z-10 hidden h-16 w-16 sm:block"
        aria-hidden
      >
        <span className="absolute left-1/2 top-0 h-full w-px bg-silver/50" />
        <span className="absolute left-0 top-1/2 h-px w-full bg-silver/50" />
        <span className="sparkle absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-star" />
      </div>

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
            className={`h-px cursor-pointer transition-all duration-500 ${scene === step ? "w-10 bg-gold-soft" : "w-5 bg-silver/35 hover:bg-silver/70"}`}
          />
        ))}
      </nav>

      {scene < 3 && (
        <Button
          type="button"
          variant="ghost"
          onClick={() => setScene(3)}
          className="fixed right-4 top-4 z-40 font-label text-[0.6rem] uppercase tracking-[0.18em] text-silver/65 hover:bg-silver/10 hover:text-star sm:right-8 sm:top-7"
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
          className="fixed right-4 top-4 z-40 text-silver/65 hover:bg-silver/10 hover:text-star sm:right-8 sm:top-7"
        >
          <RotateCcw />
        </Button>
      )}

      <RsvpDialog
        open={rsvpOpen}
        onClose={() => setRsvpOpen(false)}
        confirmedName={confirmedName}
        onConfirm={setConfirmedName}
      />
    </main>
  );
}

function GateScene() {
  return (
    <motion.section
      aria-label="Abertura do convite"
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7 } }}
    >
      <motion.div
        className="gate-panel absolute inset-y-0 left-0 w-1/2 origin-left border-r"
        initial={{ x: 0, rotateY: 0 }}
        animate={{ x: "-98%", rotateY: 18 }}
        transition={{ duration: 3.1, delay: 0.5, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.div
        className="gate-panel absolute inset-y-0 right-0 w-1/2 origin-right border-l"
        initial={{ x: 0, rotateY: 0 }}
        animate={{ x: "98%", rotateY: -18 }}
        transition={{ duration: 3.1, delay: 0.5, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.div
        className="z-10 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.9, 1, 1, 1.05] }}
        transition={{ duration: 3.3, times: [0, 0.25, 0.72, 1] }}
      >
        <Sparkles className="mx-auto mb-6 size-5 text-gold-soft" strokeWidth={1} />
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
      transition={{ duration: 0.9 }}
    >
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
      <motion.p
        className="font-label text-[0.62rem] uppercase tracking-[0.5em] text-gold-soft sm:text-xs"
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
        className="mt-9 h-px w-40 bg-gradient-to-r from-transparent via-gold-soft to-transparent sm:w-64"
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
      transition={{ duration: 0.8 }}
    >
      <div
        className="comet-trail pointer-events-none absolute left-1/2 top-1/2 -z-10"
        aria-hidden
      />
      <p className="font-label text-[0.62rem] uppercase tracking-[0.5em] text-gold-soft sm:text-xs">
        Quando as estrelas se alinharem
      </p>
      <h1 id="date-title" className="sr-only">
        29 de outubro de 2026
      </h1>
      <motion.span
        className="mt-3 font-display text-[9rem] leading-[0.85] text-star sm:text-[12rem]"
        initial={{ opacity: 0, scale: 0.65, filter: "blur(12px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ delay: 0.5, duration: 1.1 }}
        aria-hidden
      >
        29
      </motion.span>
      <motion.span
        className="font-script text-5xl text-silver sm:text-7xl"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.3, duration: 0.9 }}
        aria-hidden
      >
        Outubro
      </motion.span>
      <motion.span
        className="mt-5 font-label text-lg tracking-[0.45em] text-star sm:text-xl"
        initial={{ opacity: 0, letterSpacing: "0.8em" }}
        animate={{ opacity: 1, letterSpacing: "0.45em" }}
        transition={{ delay: 2, duration: 1 }}
        aria-hidden
      >
        2026
      </motion.span>
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
      transition={{ duration: 1.2 }}
    >
      <div
        className="galaxy-disc pointer-events-none absolute left-1/2 top-[34%] -z-10 aspect-square w-[min(95vw,44rem)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80"
        aria-hidden
      />
      <motion.p
        className="font-script text-4xl text-gold-soft sm:text-5xl"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Os meus
      </motion.p>
      <motion.h1
        id="gabriela-title"
        className="mt-1 font-display text-[clamp(3.3rem,12vw,8rem)] leading-none tracking-[0.08em] text-star drop-shadow-[0_0_24px_var(--silver)]"
        initial={{ opacity: 0, scale: 0.86 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
      >
        GABRIELA
      </motion.h1>
      <motion.div
        className="mt-2 flex items-center gap-4 sm:gap-7"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="h-px w-10 bg-gold sm:w-24" />
        <span className="font-script text-5xl text-silver sm:text-7xl">15</span>
        <span className="font-label text-xs uppercase tracking-[0.4em] text-silver sm:text-sm">
          anos
        </span>
        <span className="h-px w-10 bg-gold sm:w-24" />
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
          <Sparkles /> Confirmar presença
        </Button>
      </motion.div>
    </motion.section>
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
            className="relative w-full max-w-md border border-gold/40 bg-night-soft/95 px-7 py-9 text-center shadow-celestial sm:px-10 sm:py-11"
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
                <div className="mb-6 flex size-14 items-center justify-center rounded-full border border-gold/60 bg-gold/10 text-gold-soft">
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
                <Sparkles className="mx-auto mb-5 size-5 text-gold-soft" strokeWidth={1} />
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
                  className="mt-8 h-12 w-full border-x-0 border-b border-t-0 border-gold/45 bg-transparent px-2 text-center font-label text-xs uppercase tracking-[0.18em] text-star outline-none placeholder:text-silver/35 focus:border-gold-soft"
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
