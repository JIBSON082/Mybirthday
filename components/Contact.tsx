"use client";

import { useEffect, useRef, useState } from "react";

const CHANNELS = [
  {
    label: "WhatsApp",
    value: "0706 863 4125",
    href: "https://wa.me/2347068634125",
    num: "01",
  },
  {
    label: "Email",
    value: "davidajibua78@gmail.com",
    href: "mailto:davidajibua78@gmail.com",
    num: "02",
  },
  {
    label: "Instagram",
    value: "@daveajibua",
    href: "https://www.instagram.com/daveajibua?stkn=YW5jYm1nMmd1bmY0",
    num: "03",
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Reveal on scroll into view — this replaces mouse-hover effects, which
  // don't exist on touch devices and were the reason the old version felt
  // dead on mobile.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative z-[2] overflow-hidden bg-bg px-[5vw] py-32 sm:py-40"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, rgba(212,175,55,0.07), transparent 60%)",
        }}
      />

      <div
        className="relative z-10 mx-auto max-w-2xl text-center transition-all duration-700 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
        }}
      >
        <h2 className="mt-4 font-display text-[clamp(2.2rem,6.5vw,3.6rem)] leading-[1.05] tracking-wide text-ink">
          Hello, let&apos;s <span className="text-gold">keep in touch</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md font-body text-[0.95rem] leading-relaxed text-ink/70">
          Want something like this built for you, or have an idea in mind?
          Let&apos;s talk.
        </p>
      </div>

      <ul className="relative z-10 mx-auto mt-16 max-w-xl">
        {CHANNELS.map((c, i) => (
          <li
            key={c.label}
            className="border-b border-ink/10 last:border-b-0 transition-all duration-500 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(14px)",
              transitionDelay: visible ? `${0.15 + i * 0.1}s` : "0s",
            }}
          >
            <a
              href={c.href}
              target={c.label === "Email" ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 py-7 active:scale-[0.98] transition-transform duration-150"
            >
              <span className="flex items-baseline gap-4">
                <span className="font-body text-[0.65rem] tracking-[0.2em] text-gold/70">
                  {c.num}
                </span>
                <span className="flex flex-col">
                  <span className="font-display text-2xl tracking-wide text-ink transition-colors duration-300 group-active:text-gold sm:text-3xl">
                    {c.label}
                  </span>
                  <span className="mt-1 font-body text-[0.8rem] text-ink/50">
                    {c.value}
                  </span>
                </span>
              </span>
              <span
                aria-hidden="true"
                className="font-body text-lg text-gold transition-transform duration-300 group-active:translate-x-1"
              >
                &rarr;
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
