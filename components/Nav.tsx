"use client";

import { useState } from "react";

const LINKS = [
  { label: "Home", href: "#" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] grid grid-cols-3 items-center px-[5vw] py-6">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="relative z-[110] flex h-9 w-9 flex-col items-center justify-center gap-[6px] justify-self-start"
        >
          <span
            className="block h-[2px] w-6 bg-black transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]"
            style={
              open
                ? { transform: "translateY(8px) rotate(45deg)" }
                : { transform: "translateY(0) rotate(0)" }
            }
          />
          <span
            className="block h-[2px] w-6 bg-black transition-all duration-200 ease-[cubic-bezier(0.65,0,0.35,1)]"
            style={{ opacity: open ? 0 : 1 }}
          />
          <span
            className="block h-[2px] w-6 bg-black transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]"
            style={
              open
                ? { transform: "translateY(-8px) rotate(-45deg)" }
                : { transform: "translateY(0) rotate(0)" }
            }
          />
        </button>

        <div
          className="justify-self-center font-display text-[2.4rem] leading-none tracking-wide text-black"
          style={{
            WebkitTextStroke: "1.5px black",
            textShadow:
              "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
          }}
        >
          DAVE
        </div>
      </nav>

      {/* menu overlay */}
      <div
        className="fixed inset-0 z-[95] bg-bg/98 backdrop-blur-sm transition-opacity duration-500"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        onClick={() => setOpen(false)}
      >
        <ul className="flex h-full w-full flex-col items-center justify-center gap-8">
          {LINKS.map((link, i) => (
            <li
              key={link.label}
              style={{
                transitionDelay: open ? `${0.12 + i * 0.08}s` : "0s",
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(16px)",
              }}
              className="transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-editorial text-4xl sm:text-6xl text-ink hover:text-gold transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
