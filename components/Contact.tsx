"use client";

import { useRef, useState } from "react";

const CHANNELS = [
  {
    label: "WhatsApp",
    value: "0706 863 4125",
    href: "https://wa.me/2347068634125",
    hint: "Message me",
  },
  {
    label: "Email",
    value: "davidajibua78@gmail.com",
    href: "mailto:davidajibua78@gmail.com",
    hint: "Send a mail",
  },
  {
    label: "Instagram",
    value: "@daveajibua",
    href: "https://www.instagram.com/daveajibua?stkn=YW5jYm1nMmd1bmY0",
    hint: "Follow along",
  },
];

function ContactCard({ channel }: { channel: (typeof CHANNELS)[number] }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });
  const [copied, setCopied] = useState(false);

  function onMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    const ry = (px - 0.5) * 16; // rotateY
    const rx = (0.5 - py) * 16; // rotateX
    setTilt({ rx, ry, mx: px * 100, my: py * 100 });
  }

  function onMouseLeave() {
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50 });
  }

  function onCopy(e: React.MouseEvent) {
    if (channel.label !== "Email") return;
    e.preventDefault();
    navigator.clipboard?.writeText(channel.value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      window.location.href = channel.href;
    });
  }

  return (
    <a
      ref={cardRef}
      href={channel.href}
      target={channel.label === "Email" ? undefined : "_blank"}
      rel="noopener noreferrer"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onCopy}
      className="group relative block overflow-hidden rounded-2xl border border-ink/15 bg-white/[0.02] p-8 transition-colors duration-300 hover:border-gold/60"
      style={{
        transform: `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: "transform 300ms cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* cursor-reactive glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(240px circle at ${tilt.mx}% ${tilt.my}%, rgba(212,175,55,0.16), transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        <span className="font-body text-[0.68rem] uppercase tracking-[0.3em] text-gold/80">
          {channel.hint}
        </span>
        <h3 className="mt-4 font-display text-[1.9rem] leading-none tracking-wide text-ink">
          {channel.label}
        </h3>
        <p className="mt-3 font-body text-[0.95rem] text-ink/70">
          {copied ? "Copied; opening mail app" : channel.value}
        </p>
        <span className="mt-6 inline-flex items-center gap-2 font-body text-[0.72rem] uppercase tracking-[0.25em] text-gold transition-transform duration-300 group-hover:translate-x-1">
          Say hi
          <span aria-hidden="true">&rarr;</span>
        </span>
      </div>
    </a>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [glow, setGlow] = useState({ x: 50, y: 50 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setGlow({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      onMouseMove={onMouseMove}
      className="relative z-[2] overflow-hidden bg-bg px-[5vw] py-32 sm:py-40"
    >
      {/* ambient glow following the cursor across the whole section */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${glow.x}% ${glow.y}%, rgba(212,175,55,0.08), transparent 65%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <span className="font-body text-[0.72rem] uppercase tracking-[0.35em] text-gold">
          Say hello
        </span>
        <h2 className="mt-5 font-display text-[clamp(2.4rem,7vw,4.2rem)] leading-[1.05] tracking-wide text-ink">
          Let's{" "}
          <span
            className="relative inline-block text-gold"
            style={{ textShadow: "0 0 24px rgba(212,175,55,0.4)" }}
          >
            keep in touch
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl font-body text-[1rem] leading-relaxed text-ink/70">
          Feel free to reach out through any of these.
        </p>
        <p className="mx-auto mt-3 max-w-xl font-body text-[0.9rem] leading-relaxed text-ink/50">
          Or if you want something like this built for you, or have an idea
          in mind, reach out too.
        </p>
      </div>

      <div className="relative z-10 mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-3">
        {CHANNELS.map((c) => (
          <ContactCard key={c.label} channel={c} />
        ))}
      </div>
    </section>
  );
}
