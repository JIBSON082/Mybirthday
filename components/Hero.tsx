"use client";

import { useEffect, useRef } from "react";

const HERO_BG =
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/f_auto,q_auto,e_blur:200/v1789228439/IMG_8064_iyqyn2";

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
            "linear-gradient(to bottom, rgba(10,10,10,0) 0%, rgba(10,10,10,0.55) 55%, rgba(10,10,10,0.97) 100%)",
        }}
      />
      <div
        ref={contentRef}
        className="relative z-[2] text-center will-change-transform"
      >
        <h1 className="font-display font-normal leading-[0.9] tracking-wide text-ink text-[clamp(4.5rem,15vw,11rem)]">
          <span className="block">The</span>
          <span
            className="block text-gold"
            style={{ textShadow: "0 0 20px rgba(212,175,55,0.4)" }}
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
