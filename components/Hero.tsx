"use client";

import { useEffect, useRef, useState } from "react";
import { Bodoni_Moda } from "next/font/google";

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  style: ["normal", "italic"],
});

const HERO_BG =
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/f_auto,q_auto,e_blur:200/v1789255624/file_0000000029d482108ece7ddd7750b73a_az4bdv.png";

const DATE_TEXT = "12TH SEPTEMBER";

/**
 * Loops a type-on / type-off effect: types the date forward,
 * holds, deletes it back to nothing, holds, repeats forever.
 */
function useTypewriterLoop(fullText: string) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let cancelled = false;
    let i = 0;
    let deleting = false;

    const TYPE_SPEED = 140;
    const DELETE_SPEED = 90;
    const HOLD_FULL = 2600;
    const HOLD_EMPTY = 1000;

    function tick() {
      if (cancelled) return;

      if (!deleting) {
        i += 1;
        setDisplay(fullText.slice(0, i));
        if (i >= fullText.length) {
          deleting = true;
          setTimeout(tick, HOLD_FULL);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        i -= 1;
        setDisplay(fullText.slice(0, i));
        if (i <= 0) {
          deleting = false;
          setTimeout(tick, HOLD_EMPTY);
          return;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    }

    const start = setTimeout(tick, TYPE_SPEED);
    return () => {
      cancelled = true;
      clearTimeout(start);
    };
  }, [fullText]);

  return display;
}

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tickingRef = useRef(false);
  const dateText = useTypewriterLoop(DATE_TEXT);
  const [mounted, setMounted] = useState(false);

  // Real entrance: everything starts hidden/offset and settles in on mount,
  // independent of scroll. This is what was missing before — the old version
  // only reacted to scroll, so on load the whole hero just appeared at once.
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // rAF-throttled parallax instead of writing styles on every scroll event.
  useEffect(() => {
    const heroHeight = window.innerHeight;

    function apply() {
      const y = window.scrollY;
      const p = Math.min(y / heroHeight, 1);
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${y * 0.35}px) scale(1.08)`;
      }
      if (contentRef.current) {
        contentRef.current.style.transform = `translateY(${-y * 0.25}px)`;
        contentRef.current.style.opacity = String(1 - p * 1.15);
      }
      tickingRef.current = false;
    }

    function onScroll() {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(apply);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    apply();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <div
        ref={bgRef}
        className="absolute -inset-x-[6vw] -inset-y-[6vh] bg-cover will-change-transform"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          // biased toward the upper portion of the frame so the subject
          // sits higher and there's no dead empty band above them
          backgroundPosition: "center 20%",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.45) 55%, rgba(10,10,10,0.97) 100%)",
        }}
      />

      {/* looping typewriter date — flat gold, no glow, to match the rest of
          the site (Contact section deliberately dropped glow effects).
          The invisible ghost span reserves the full width up front so the
          visible text always stays centered as it types/deletes, instead of
          the whole line drifting as its width changes. */}
      <div
        className="absolute top-[10%] left-1/2 -translate-x-1/2 z-[2] min-h-[2.5em] transition-all duration-700 ease-out"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted
            ? "translate(-50%, 0)"
            : "translate(-50%, -10px)",
        }}
      >
        <div className="relative flex items-center justify-center px-6">
          {/* ghost: reserves the exact width of the full date text */}
          <span
            aria-hidden="true"
            className="invisible font-display font-normal text-[1.6rem] sm:text-[2.4rem] tracking-[0.08em] uppercase whitespace-nowrap"
          >
            {DATE_TEXT}
          </span>
          {/* visible typed text, centered over the reserved space */}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="font-display font-normal text-[1.6rem] sm:text-[2.4rem] tracking-[0.08em] uppercase text-gold whitespace-nowrap">
              {dateText}
            </span>
            <span
              className="ml-1 inline-block h-[0.9em] w-[3px] bg-gold animate-pulse"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>

      <div
        ref={contentRef}
        className="relative z-[2] text-center will-change-transform"
      >
        <h1 className="font-editorial leading-[0.85] text-ink text-[clamp(3.6rem,12vw,8.5rem)]">
          <span
            className="block font-bold transition-all duration-700 ease-out"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(28px)",
              transitionDelay: "0.15s",
            }}
          >
            The
          </span>
          <span
            className="block font-black text-gold transition-all duration-700 ease-out"
            style={{
              textShadow: "0 0 30px rgba(212,175,55,0.45)",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(28px)",
              transitionDelay: "0.35s",
            }}
          >
            Gallery
          </span>
        </h1>
      </div>

      <div
        className="absolute bottom-11 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2 opacity-0 transition-opacity duration-700"
        style={{ opacity: mounted ? 0.75 : 0, transitionDelay: "0.6s" }}
      >
        <span className="text-[0.62rem] tracking-[0.3em] uppercase">
          Scroll
        </span>
        <div className="relative h-[34px] w-px overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(212,175,55,0.25)" }}
          />
          <div className="scroll-dot absolute left-0 top-0 h-2 w-px bg-gold" />
        </div>
      </div>

      <style jsx>{`
        .scroll-dot {
          animation: scrollDown 1.8s ease-in-out infinite;
        }
        @keyframes scrollDown {
          0% {
            transform: translateY(-8px);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(34px);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
