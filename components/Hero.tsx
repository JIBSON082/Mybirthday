"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { HERO_PHOTO_URL } from "@/lib/photos";

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.4, ease: "power3.out" }
    );

    const handleScroll = () => {
      const scrolled = window.scrollY;
      gsap.to(bgRef.current, {
        y: scrolled * 0.3,
        scale: 1 + scrolled * 0.0003,
        overwrite: "auto",
        duration: 0.3,
      });
      gsap.to(titleRef.current, {
        y: scrolled * 0.5,
        opacity: 1 - scrolled / 500,
        overwrite: "auto",
        duration: 0.3,
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{ backgroundImage: `url(${HERO_PHOTO_URL})` }}
      />
      <div className="absolute inset-0 hero-mask" />
      <h1
        ref={titleRef}
        className="relative z-10 text-center font-display font-black uppercase leading-[0.85] text-[16vw] md:text-[11vw] tracking-tighter"
      >
        DAVE
        <span className="block text-[6vw] md:text-[3vw] tracking-[0.4em] font-light mt-4 glow-text">
          The Gallery
        </span>
      </h1>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-xs tracking-[0.3em] uppercase text-bone/50 animate-pulse">
        Scroll
      </div>
    </section>
  );
}