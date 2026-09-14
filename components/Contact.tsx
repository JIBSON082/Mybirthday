"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const WHATSAPP_NUMBER = "2347068634125";
const EMAIL = "davidajibua78@gmail.com";
const PHONE_DISPLAY = "0706 863 4125";
const INSTAGRAM_URL =
  "https://www.instagram.com/daveajibua?stkn=YW5jYm1nMmd1bmY0";

// Formspree endpoint: submissions land in davidajibua78@gmail.com's inbox.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xkoqnzqn";

type Step = "intro" | "form";

interface FormState {
  name: string;
  email: string;
  looking: string;
  message: string;
}

const EMPTY_FORM: FormState = { name: "", email: "", looking: "", message: "" };

function useLagosTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    function update() {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Africa/Lagos",
      }).format(now);
      setTime(formatted);
    }
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        left: (i * 47.3) % 100,
        delay: (i * 0.5) % 7,
        duration: 7 + ((i * 3) % 9),
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

function Footer() {
  const time = useLagosTime();
  return (
    <div className="mt-16 w-full">
      <div className="border-t border-ink/10 pt-6">
        <span className="font-display text-[0.75rem] uppercase tracking-[0.08em] text-gold/80">
          Socials
        </span>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-[0.9rem] text-ink/70 transition-colors hover:text-gold"
          >
            Instagram
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-[0.9rem] text-ink/70 transition-colors hover:text-gold"
          >
            WhatsApp
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="font-body text-[0.9rem] text-ink/70 transition-colors hover:text-gold"
          >
            Email
          </a>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-6">
        <div>
          <span className="block font-body text-[0.58rem] uppercase tracking-[0.3em] text-ink/40">
            Version
          </span>
          <span className="font-body text-[0.85rem] text-ink/70">
            2026 &copy; Edition
          </span>
        </div>
        <div className="text-right">
          <span className="block font-body text-[0.58rem] uppercase tracking-[0.3em] text-ink/40">
            Local time
          </span>
          <span className="font-body text-[0.85rem] text-ink/70">
            {time} GMT+1
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  const [step, setStep] = useState<Step>("intro");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const canSend =
    form.name.trim() !== "" && form.message.trim() !== "" && status !== "sending";

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSend() {
    if (!canSend) return;
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          lookingFor: form.looking,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("sent");
    } catch (err) {
      console.error("Contact form submission failed:", err);
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative z-[2] min-h-screen overflow-hidden bg-bg px-[6vw] py-28"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60" style={{
        background: "radial-gradient(circle at 50% 20%, rgba(212,175,55,0.1), transparent 60%)",
      }} />
      <Particles />

      {/* ---------------- INTRO VIEW ---------------- */}
      <div
        className="relative z-10 flex flex-col items-center transition-all duration-700 ease-out"
        style={{
          perspective: "1400px",
          opacity: step === "intro" ? 1 : 0,
          transform:
            step === "intro"
              ? "translateX(0) rotateY(0deg)"
              : "translateX(-60px) rotateY(35deg)",
          position: step === "intro" ? "relative" : "absolute",
          pointerEvents: step === "intro" ? "auto" : "none",
          inset: step === "intro" ? undefined : 0,
        }}
      >
        <h2 className="w-full max-w-xl font-display text-[clamp(2.3rem,7vw,3.6rem)] leading-[1.05] tracking-wide text-ink">
          <span
            className="inline-block transition-all duration-700 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible
                ? "translateY(0) rotate(0deg)"
                : "translateY(30px) rotate(-8deg)",
              transitionDelay: "0.1s",
            }}
          >
            Let&apos;s work
          </span>{" "}
          <span
            className="inline-block text-gold transition-all duration-700 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible
                ? "translateY(0) rotate(0deg)"
                : "translateY(30px) rotate(8deg)",
              transitionDelay: "0.3s",
            }}
          >
            together
          </span>
        </h2>

        <div
          className="mt-12 flex w-full max-w-xl items-center justify-between border-t border-ink/10 pt-8 transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "0.5s",
          }}
        >
          <span className="font-body text-[0.98rem] text-ink/50">
            Have something in mind?
          </span>
          <button
            onClick={() => setStep("form")}
            className="cta-ring relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border border-gold text-center font-body text-[0.75rem] uppercase tracking-[0.15em] text-gold transition-transform duration-300 hover:scale-105 hover:bg-gold hover:text-bg sm:h-32 sm:w-32"
            style={{
              transform: visible ? "scale(1)" : "scale(0)",
              transitionDelay: "0.6s",
              transitionDuration: "600ms",
              transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            <span className="cta-ping absolute inset-0 rounded-full border border-gold" />
            Get in
            <br />
            touch
          </button>
        </div>

        <div className="mt-10 flex w-full max-w-xl flex-col gap-4">
          <a
            href={`mailto:${EMAIL}`}
            className="pill-float rounded-full border border-ink/15 px-6 py-4 text-center font-body text-[0.9rem] text-ink/80 transition-all duration-700 ease-out hover:border-gold hover:text-gold"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-30px)",
              transitionDelay: "0.75s",
              animationDelay: "0.2s",
            }}
          >
            {EMAIL}
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="pill-float rounded-full border border-ink/15 px-6 py-4 text-center font-body text-[0.9rem] text-ink/80 transition-all duration-700 ease-out hover:border-gold hover:text-gold"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(30px)",
              transitionDelay: "0.9s",
              animationDelay: "1s",
            }}
          >
            {PHONE_DISPLAY}
          </a>
        </div>

        <div
          className="w-full transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "1.05s",
          }}
        >
          <Footer />
        </div>
      </div>

      {/* ---------------- FORM VIEW ---------------- */}
      <div
        className="relative z-10 flex flex-col items-center transition-all duration-700 ease-out"
        style={{
          perspective: "1400px",
          opacity: step === "form" ? 1 : 0,
          transform:
            step === "form"
              ? "translateX(0) rotateY(0deg)"
              : "translateX(60px) rotateY(-35deg)",
          position: step === "form" ? "relative" : "absolute",
          pointerEvents: step === "form" ? "auto" : "none",
          inset: step === "form" ? undefined : 0,
        }}
      >
        <div className="w-full max-w-xl">
          <button
            onClick={() => setStep("intro")}
            className="mb-6 font-body text-[0.75rem] uppercase tracking-[0.4em] text-ink/50 transition-colors hover:text-gold"
          >
            &larr; Back
          </button>

          <h2 className="font-display text-[clamp(2rem,6vw,3.2rem)] leading-[1.05] tracking-wide text-ink">
            Let&apos;s start a{" "}
            <span className="text-gold">project together</span>
          </h2>

          {status === "sent" ? (
            <div className="mt-14 border-t border-ink/10 pt-10 text-center">
              <p className="font-display text-2xl text-gold sm:text-3xl">
                Message sent.
              </p>
              <p className="mx-auto mt-4 max-w-sm font-body text-[0.95rem] leading-relaxed text-ink/70">
                I&apos;ll get back to you shortly.
              </p>
              <button
                onClick={() => {
                  setForm(EMPTY_FORM);
                  setStatus("idle");
                  setStep("intro");
                }}
                className="mt-8 font-body text-[0.75rem] uppercase tracking-[0.2em] text-ink/50 transition-colors hover:text-gold"
              >
                &larr; Back to start
              </button>
            </div>
          ) : (
            <>
              <div className="mt-10 space-y-8 border-t border-ink/10 pt-8">
                <Field
                  num="01"
                  label="What's your name?"
                  placeholder="Your full name"
                  required
                  value={form.name}
                  onChange={(v) => update("name", v)}
                />
                <Field
                  num="02"
                  label="What's your email?"
                  placeholder="you@example.com"
                  type="email"
                  value={form.email}
                  onChange={(v) => update("email", v)}
                />
                <Field
                  num="03"
                  label="What are you looking for?"
                  placeholder="Website, portfolio, something custom..."
                  value={form.looking}
                  onChange={(v) => update("looking", v)}
                />
                <Field
                  num="04"
                  label="Your message"
                  placeholder="Hello David, can you help me with..."
                  required
                  multiline
                  value={form.message}
                  onChange={(v) => update("message", v)}
                />
              </div>

              {status === "error" && (
                <p className="mt-6 font-body text-[0.85rem] text-red-400">
                  Something went wrong sending that. Please try again in a moment.
                </p>
              )}

              <div className="mt-14 flex items-center justify-end border-t border-ink/10 pt-8">
                <button
                  onClick={handleSend}
                  disabled={!canSend}
                  className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-gold text-center font-body text-[0.75rem] uppercase tracking-[0.15em] text-bg transition-transform duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 sm:h-32 sm:w-32"
                >
                  {status === "sending" ? "Sending…" : "Send it!"}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="w-full">
          <Footer />
        </div>
      </div>

      <style jsx>{`
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

        .cta-ping {
          animation: ping 2.4s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          75%,
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        .pill-float {
          animation: pillFloat 4.5s ease-in-out infinite;
        }
        @keyframes pillFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </section>
  );
}

function Field({
  num,
  label,
  placeholder,
  value,
  onChange,
  required,
  multiline,
  type,
}: {
  num: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  multiline?: boolean;
  type?: string;
}) {
  return (
    <div className="border-b border-ink/10 pb-6">
      <span className="font-body text-[0.65rem] tracking-[0.2em] text-gold/70">
        {num}
      </span>
      <label className="mt-1 block font-display text-lg text-ink sm:text-xl">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="mt-3 w-full resize-none bg-transparent font-body text-[0.95rem] text-ink placeholder:text-ink/30 focus:outline-none"
        />
      ) : (
        <input
          type={type ?? "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-3 w-full bg-transparent font-body text-[0.95rem] text-ink placeholder:text-ink/30 focus:outline-none"
        />
      )}
      {required && (
        <span className="mt-1 block font-body text-[0.65rem] text-gold/60">
          *required
        </span>
      )}
    </div>
  );
}
