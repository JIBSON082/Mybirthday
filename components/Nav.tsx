"use client";

import { useEffect, useRef, useState } from "react";

const LINKS = [
  { label: "Home", href: "#", num: "01" },
  { label: "Gallery", href: "#gallery", num: "02" },
  { label: "Contact", href: "#contact", num: "03" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const heroThreshold = window.innerHeight * 0.9;

    function onScroll() {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      // always show near the very top of the page, regardless of direction
      if (currentY < 80) {
        setHidden(false);
      } else if (delta > 4) {
        // scrolling down past the threshold — hide
        setHidden(true);
      } else if (delta < -4) {
        // scrolling up — reveal
        setHidden(false);
      }

      // the DAVE wordmark only belongs to the hero moment; once you've
      // scrolled past it, it disappears entirely rather than following you
      // down the page.
      setPastHero(currentY > heroThreshold);

      lastScrollY.current = currentY;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // never hide the bar while the mobile menu itself is open
  const isHidden = hidden && !open;
  // wordmark shows in the hero, or while the menu is open (so it still
  // reads as the site identity inside the overlay), but nowhere else
  const showWordmark = !pastHero || open;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-[5vw] py-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: isHidden ? "translateY(-100%)" : "translateY(0)",
          opacity: isHidden ? 0 : 1,
          pointerEvents: isHidden ? "none" : "auto",
        }}
      >
        <div
          className="font-display text-[2.4rem] leading-none tracking-wide transition-all duration-400 ease-out"
          style={{
            color: open ? "#f4f1ea" : "#000000",
            WebkitTextStroke: open ? "1.5px #f4f1ea" : "1.5px black",
            textShadow: open
              ? "none"
              : "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
            opacity: showWordmark ? 1 : 0,
            transform: showWordmark ? "translateY(0)" : "translateY(-12px)",
            pointerEvents: showWordmark ? "auto" : "none",
          }}
        >
          DAVE
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="relative z-[110] flex h-9 w-9 flex-col items-center justify-center gap-[6px]"
        >
          <span
            className="block h-[2px] w-6 transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]"
            style={{
              backgroundColor: open ? "#f4f1ea" : "#000000",
              transform: open
                ? "translateY(8px) rotate(45deg)"
                : "translateY(0) rotate(0)",
            }}
          />
          <span
            className="block h-[2px] w-6 transition-all duration-200 ease-[cubic-bezier(0.65,0,0.35,1)]"
            style={{
              backgroundColor: open ? "#f4f1ea" : "#000000",
              opacity: open ? 0 : 1,
            }}
          />
          <span
            className="block h-[2px] w-6 transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]"
            style={{
              backgroundColor: open ? "#f4f1ea" : "#000000",
              transform: open
                ? "translateY(-8px) rotate(-45deg)"
                : "translateY(0) rotate(0)",
            }}
          />
        </button>
      </nav>

      {/* menu overlay */}
      <div
        className="fixed inset-0 z-[95] bg-bg transition-opacity duration-500"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        onClick={() => setOpen(false)}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, rgba(212,175,55,0.08), transparent 60%)",
          }}
        />

        <ul className="flex h-full w-full flex-col items-center justify-center gap-2 px-[5vw]">
          {LINKS.map((link, i) => (
            <li
              key={link.label}
              style={{
                transitionDelay: open ? `${0.14 + i * 0.09}s` : "0s",
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(20px)",
              }}
              className="group w-full max-w-sm border-b border-ink/10 py-5 text-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] last:border-b-0"
            >
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-center gap-3"
              >
                <span className="font-body text-[0.65rem] tracking-[0.2em] text-gold opacity-70">
                  {link.num}
                </span>
                <span className="font-editorial text-4xl sm:text-6xl text-ink transition-colors duration-300 group-hover:text-gold">
                  {link.label}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="absolute bottom-10 left-0 right-0 text-center text-[0.62rem] tracking-[0.3em] uppercase text-ink/40">
          DAVE: The Gallery
        </div>
      </div>
    </>
  );
}
