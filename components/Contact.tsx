"use client";

import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "2347068634125";
const EMAIL = "davidajibua78@gmail.com";
const PHONE_DISPLAY = "0706 863 4125";
const INSTAGRAM_URL =
  "https://www.instagram.com/daveajibua?stkn=YW5jYm1nMmd1bmY0";

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

function Footer() {
  const time = useLagosTime();
  return (
    <div className="mt-16 w-full max-w-xl">
      <div className="border-t border-ink/10 pt-6">
        <span className="font-body text-[0.62rem] uppercase tracking-[0.3em] text-gold/70">
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

  const canSend = form.name.trim() !== "" && form.message.trim() !== "";

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSend() {
    if (!canSend) return;
    const lines = [
      `Hello David! I'd like to talk about a project.`,
      ``,
      `Name: ${form.name}`,
      form.email ? `Email: ${form.email}` : null,
      form.looking ? `Looking for: ${form.looking}` : null,
      ``,
      `Message: ${form.message}`,
    ].filter(Boolean);
    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener");
  }

  return (
    <section
      id="contact"
      className="relative z-[2] min-h-screen overflow-hidden bg-bg px-[6vw] py-28"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 15%, rgba(212,175,55,0.08), transparent 60%)",
        }}
      />

      {/* ---------------- INTRO VIEW ---------------- */}
      <div
        className="relative z-10 flex flex-col items-center transition-all duration-500 ease-out"
        style={{
          opacity: step === "intro" ? 1 : 0,
          transform: step === "intro" ? "translateX(0)" : "translateX(-24px)",
          position: step === "intro" ? "relative" : "absolute",
          pointerEvents: step === "intro" ? "auto" : "none",
          inset: step === "intro" ? undefined : 0,
        }}
      >
        <h2 className="w-full max-w-xl font-display text-[clamp(2.3rem,7vw,3.6rem)] leading-[1.05] tracking-wide text-ink">
          Let&apos;s work <span className="text-gold">together</span>
        </h2>

        <div className="mt-12 flex w-full max-w-xl items-center justify-between border-t border-ink/10 pt-8">
          <span className="font-body text-[0.85rem] text-ink/50">
            Have something in mind?
          </span>
          <button
            onClick={() => setStep("form")}
            className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border border-gold text-center font-body text-[0.75rem] uppercase tracking-[0.15em] text-gold transition-colors duration-300 hover:bg-gold hover:text-bg sm:h-32 sm:w-32"
          >
            Get in
            <br />
            touch
          </button>
        </div>

        <div className="mt-10 flex w-full max-w-xl flex-col gap-4">
          <a
            href={`mailto:${EMAIL}`}
            className="rounded-full border border-ink/15 px-6 py-4 text-center font-body text-[0.9rem] text-ink/80 transition-colors hover:border-gold hover:text-gold"
          >
            {EMAIL}
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-ink/15 px-6 py-4 text-center font-body text-[0.9rem] text-ink/80 transition-colors hover:border-gold hover:text-gold"
          >
            {PHONE_DISPLAY}
          </a>
        </div>

        <Footer />
      </div>

      {/* ---------------- FORM VIEW ---------------- */}
      <div
        className="relative z-10 flex flex-col items-center transition-all duration-500 ease-out"
        style={{
          opacity: step === "form" ? 1 : 0,
          transform: step === "form" ? "translateX(0)" : "translateX(24px)",
          position: step === "form" ? "relative" : "absolute",
          pointerEvents: step === "form" ? "auto" : "none",
          inset: step === "form" ? undefined : 0,
        }}
      >
        <div className="w-full max-w-xl">
          <button
            onClick={() => setStep("intro")}
            className="mb-6 font-body text-[0.75rem] uppercase tracking-[0.2em] text-ink/50 transition-colors hover:text-gold"
          >
            &larr; Back
          </button>

          <h2 className="font-display text-[clamp(2rem,6vw,3.2rem)] leading-[1.05] tracking-wide text-ink">
            Let&apos;s start a{" "}
            <span className="text-gold">project together</span>
          </h2>

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

          <div className="mt-14 flex items-center justify-between border-t border-ink/10 pt-8">
            <span className="font-body text-[0.85rem] text-ink/50">
              Opens WhatsApp with this filled in
            </span>
            <button
              onClick={handleSend}
              disabled={!canSend}
              className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border border-gold text-center font-body text-[0.75rem] uppercase tracking-[0.15em] text-gold transition-colors duration-300 hover:bg-gold hover:text-bg disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gold sm:h-32 sm:w-32"
            >
              Send it!
            </button>
          </div>
        </div>

        <Footer />
      </div>
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
