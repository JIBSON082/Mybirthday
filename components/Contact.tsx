"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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

const HEADING = "Hello, let's keep in touch";

function Particles() {
  // Deterministic pseudo-random layout so it doesn't shift on every render.
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: (i * 53.7) % 100,
        delay: (i * 0.6) % 6,
        duration: 6 + ((i * 3) % 8),
        size: 2 + (i % 3),
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <span
          key={i}
          className="particle absolute rounded-full bg-gold"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            bottom: "-5%",
            opacity: 0,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [tapped, setTapped] = useState<string | null>(null);

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

  function onTap(label: string) {
    setTapped(label);
    setTimeout(() => setTapped(null), 600);
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative z-[2] overflow-hidden bg-bg px-[5vw] py-32 sm:py-40"
    >
      {/* animated ambient glow, slowly breathing rather than static */}
      <div className="glow-breathe pointer-events-none absolute inset-0" />
      <Particles />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <h2 className="font-display text-[clamp(2.2rem,6.5vw,3.6rem)] leading-[1.05] tracking-wide text-ink">
          {HEADING.split("").map((char, i) => (
            <span
              key={i}
              className="inline-block transition-all duration-500 ease-out"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible
                  ? "translateY(0) rotate(0deg)"
                  : "translateY(18px) rotate(6deg)",
                transitionDelay: `${i * 0.02}s`,
                color:
                  i >= HEADING.indexOf("keep") ? "var(--gold, #d4af37)" : undefined,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h2>
        <p
          className="mx-auto mt-5 max-w-md font-body text-[0.95rem] leading-relaxed text-ink/70 transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transitionDelay: "0.6s",
          }}
        >
          Want something like this built for you, or have an idea in mind?
          Let&apos;s talk.
        </p>
      </div>

      <ul className="relative z-10 mx-auto mt-16 max-w-xl">
        {CHANNELS.map((c, i) => (
          <li
            key={c.label}
            className="relative overflow-hidden border-b border-ink/10 last:border-b-0 transition-all duration-700"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible
                ? "translateX(0) rotate(0deg)"
                : `translateX(${i % 2 === 0 ? -40 : 40}px) rotate(${
                    i % 2 === 0 ? -3 : 3
                  }deg)`,
              transitionDelay: visible ? `${0.7 + i * 0.15}s` : "0s",
              transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {/* gold shimmer sweep on tap */}
            {tapped === c.label && <span className="shimmer-sweep absolute inset-0" />}

            <a
              href={c.href}
              target={c.label === "Email" ? undefined : "_blank"}
              rel="noopener noreferrer"
              onClick={() => onTap(c.label)}
              className="group relative flex items-center justify-between gap-4 py-7 active:scale-[0.97] transition-transform duration-150"
            >
              <span className="flex items-baseline gap-4">
                <span className="font-body text-[0.65rem] tracking-[0.2em] text-gold/70">
                  {c.num}
                </span>
                <span className="flex flex-col">
                  <span className="font-display text-2xl tracking-wide text-ink transition-all duration-300 group-active:text-gold group-active:tracking-wider sm:text-3xl">
                    {c.label}
                  </span>
                  <span className="mt-1 font-body text-[0.8rem] text-ink/50">
                    {c.value}
                  </span>
                </span>
              </span>
              <span
                aria-hidden="true"
                className="arrow-bounce font-body text-lg text-gold"
              >
                &rarr;
              </span>
            </a>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .glow-breathe {
          background: radial-gradient(
            circle at 50% 30%,
            rgba(212, 175, 55, 0.1),
            transparent 60%
          );
          animation: breathe 5s ease-in-out infinite;
        }
        @keyframes breathe {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        .particle {
          animation-name: floatUp;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes floatUp {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-110vh) translateX(20px);
            opacity: 0;
          }
        }

        .arrow-bounce {
          display: inline-block;
          animation: arrowNudge 1.6s ease-in-out infinite;
        }
        @keyframes arrowNudge {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(6px);
          }
        }

        .shimmer-sweep {
          background: linear-gradient(
            100deg,
            transparent 30%,
            rgba(212, 175, 55, 0.25) 50%,
            transparent 70%
          );
          animation: sweep 0.6s ease-out;
        }
        @keyframes sweep {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
}
