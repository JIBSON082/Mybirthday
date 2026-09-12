"use client";

import { useEffect, useRef, useState } from "react";

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

    const TYPE_SPEED = 95;
    const DELETE_SPEED = 55;
    const HOLD_FULL = 1400;
    const HOLD_EMPTY = 600;

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
  const dateText = useTypewriterLoop(DATE_TEXT);

  useEffect(() => {
    const heroHeight = window.innerHeight;

    function onScroll() {
      const y = window.scrollY;
      const p = Math.min(y / heroHeight, 1);
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${y * 0.35}px)`;
      }
      if (contentRef.current) {
        contentRef.current.style.transform = `translateY(${-y * 0.25}px)`;
        contentRef.current.style.opacity = String(1 - p * 1.15);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <div
        ref={bgRef}
        className="absolute -inset-x-[6vw] -inset-y-[6vh] bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0) 0%, rgba(10,10,10,0.5) 60%, rgba(10,10,10,0.97) 100%)",
        }}
      />

      {/* looping typewriter date, set directly into the image */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 z-[2] flex items-center justify-center px-6 min-h-[2.5em]">
        <span
          className="font-display font-normal text-[1.6rem] sm:text-[2.4rem] tracking-[0.08em] uppercase text-gold whitespace-nowrap"
          style={{ textShadow: "0 0 24px rgba(212,175,55,0.65), 0 0 60px rgba(212,175,55,0.25)" }}
        >
          {dateText}
        </span>
        <span
          className="ml-1 inline-block h-[0.9em] w-[3px] bg-gold animate-pulse"
          style={{ boxShadow: "0 0 10px rgba(212,175,55,0.8)" }}
          aria-hidden="true"
        />
      </div>

      <div
        ref={contentRef}
        className="relative z-[2] text-center will-change-transform"
      >
        <h1 className="font-editorial leading-[0.85] text-ink text-[clamp(3.6rem,12vw,8.5rem)]">
          <span
            className="block font-bold animate-hero-line"
            style={{ animationDelay: "0.1s" }}
          >
            The
          </span>
          <span
            className="block italic font-black text-gold animate-hero-line"
            style={{
              textShadow: "0 0 30px rgba(212,175,55,0.45)",
              animationDelay: "0.35s",
            }}
          >
            Gallery
          </span>
        </h1>
      </div>

      <div className="absolute bottom-11 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2 opacity-75">
        <span className="text-[0.62rem] tracking-[0.3em] uppercase">
          Scroll
        </span>
        <div
          className="scroll-cue-line w-px h-[34px]"
          style={{
            background: "linear-gradient(to bottom, #d4af37, transparent)",
          }}
        />
      </div>
    </section>
  );
}
