"use client";

import { useEffect, useRef, useState } from "react";

const IMAGES = [
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/f_auto,q_auto/v1789228443/IMG_8045_hzyzsc",
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/f_auto,q_auto/v1789228437/IMG_8047_uav0vv",
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/f_auto,q_auto/v1789228450/IMG_8041_ueaxkk",
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/f_auto,q_auto/v1789228438/IMG_8030_iqbj5t",
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/f_auto,q_auto/v1789228437/IMG_8028_dh4iqr",
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/f_auto,q_auto/v1789228439/IMG_8064_iyqyn2",
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/f_auto,q_auto/v1789228438/IMG_8026_sgnunr",
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/f_auto,q_auto/v1789228440/IMG_8033_nsdn5b",
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/f_auto,q_auto/v1789228440/IMG_8050_ekqlng",
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/f_auto,q_auto/v1789228440/IMG_8054_bvbtwe",
];

function pad(n: number) {
  return String(n + 1).padStart(2, "0");
}

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [cursorOn, setCursorOn] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zipping, setZipping] = useState(false);
  const [zipFailed, setZipFailed] = useState(false);

  // pinned horizontal scroll, driven by GSAP ScrollTrigger
  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    let onResize: (() => void) | null = null;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      const context = gsap.context(() => {
        const distance = () => track.scrollWidth - window.innerWidth;

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(
                IMAGES.length - 1,
                Math.floor(self.progress * IMAGES.length)
              );
              setActiveIndex(idx);
            },
          },
        });

        onResize = () => ScrollTrigger.refresh();
        window.addEventListener("resize", onResize);
      }, section);

      ctx = context;
    })();

    return () => {
      if (onResize) window.removeEventListener("resize", onResize);
      if (ctx) ctx.revert();
    };
  }, []);

  // custom "view" cursor, desktop only
  useEffect(() => {
    function move(e: MouseEvent) {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    }
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // keyboard nav for lightbox
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight")
        setLightboxIndex((i) => (i === null ? i : (i + 1) % IMAGES.length));
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) =>
          i === null ? i : (i - 1 + IMAGES.length) % IMAGES.length
        );
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex]);

  async function downloadImage(src: string, filename: string) {
    const res = await fetch(src);
    const blob = await res.blob();
    const { saveAs } = await import("file-saver");
    saveAs(blob, filename);
  }

  async function handleDownloadAll() {
    setZipping(true);
    setZipFailed(false);
    try {
      const JSZip = (await import("jszip")).default;
      const { saveAs } = await import("file-saver");
      const zip = new JSZip();
      const folder = zip.folder("DAVE_gallery")!;
      await Promise.all(
        IMAGES.map(async (src, i) => {
          const res = await fetch(src);
          const blob = await res.blob();
          folder.file(`DAVE_${i + 1}.jpg`, blob);
        })
      );
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "DAVE_gallery.zip");
    } catch (err) {
      console.error(err);
      setZipFailed(true);
      setTimeout(() => setZipFailed(false), 1800);
    } finally {
      setZipping(false);
    }
  }

  return (
    <>
      <section
        ref={sectionRef}
        className="relative h-screen w-full overflow-hidden bg-bg"
      >
        {/* fixed header, stays put while the reel scrolls underneath */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between px-[5vw] pt-10">
          <h2 className="font-display text-[clamp(2rem,5vw,3.4rem)] tracking-wide text-ink">
            The Moments
          </h2>
          <div className="pointer-events-auto flex flex-col items-end gap-4">
            <button
              onClick={handleDownloadAll}
              disabled={zipping}
              className="whitespace-nowrap rounded-full border border-gold px-7 py-3 text-[0.78rem] tracking-wide text-gold transition-colors duration-300 hover:bg-gold/10 disabled:cursor-progress disabled:opacity-60"
              style={{ textShadow: "0 0 8px rgba(212,175,55,0.4)" }}
            >
              {zipFailed ? "Failed — retry" : zipping ? "Zipping…" : "Download All"}
            </button>
            <span className="font-body text-[0.7rem] tracking-[0.3em] text-ink/50">
              {pad(activeIndex)}
              <span className="mx-1 text-gold">/</span>
              {pad(IMAGES.length - 1)}
            </span>
          </div>
        </div>

        {/* horizontal reel, translated by ScrollTrigger */}
        <div
          ref={trackRef}
          className="flex h-full items-center gap-5 pl-[5vw] pr-[10vw] will-change-transform"
        >
          {IMAGES.map((src, i) => (
            <div
              key={src}
              className="group relative h-[62vh] w-[74vw] flex-shrink-0 overflow-hidden rounded-sm sm:w-[46vw] md:h-[64vh] md:w-[32vw] cursor-pointer"
              onClick={() => setLightboxIndex(i)}
              onMouseEnter={() => setCursorOn(true)}
              onMouseLeave={() => setCursorOn(false)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Photo ${i + 1}`}
                loading="eager"
                className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span
                className="absolute bottom-4 left-4 font-display text-sm text-gold opacity-80"
                style={{ textShadow: "0 0 10px rgba(212,175,55,0.6)" }}
              >
                {pad(i)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* desktop-only custom cursor */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[150] hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold bg-bg/80 text-[0.65rem] uppercase tracking-[0.2em] text-gold transition-[width,height,opacity] duration-300 md:flex"
        style={{
          width: cursorOn ? 72 : 0,
          height: cursorOn ? 72 : 0,
          opacity: cursorOn ? 1 : 0,
        }}
      >
        View
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center px-[5vw] py-[6vh]"
          style={{ background: "rgba(6,6,6,0.98)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightboxIndex(null);
          }}
        >
          <button
            onClick={() =>
              setLightboxIndex((i) =>
                i === null ? i : (i - 1 + IMAGES.length) % IMAGES.length
              )
            }
            aria-label="Previous photo"
            className="absolute left-4 top-1/2 -translate-y-1/2 px-3 py-6 text-2xl text-ink/60 transition-colors hover:text-gold sm:left-8"
          >
            ‹
          </button>
          <button
            onClick={() =>
              setLightboxIndex((i) =>
                i === null ? i : (i + 1) % IMAGES.length
              )
            }
            aria-label="Next photo"
            className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-6 text-2xl text-ink/60 transition-colors hover:text-gold sm:right-8"
          >
            ›
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={lightboxIndex}
            src={IMAGES[lightboxIndex]}
            alt={`Photo ${lightboxIndex + 1}`}
            className="max-h-[68vh] max-w-[min(92vw,900px)] object-contain shadow-2xl animate-lightbox-in"
          />

          <div className="mt-8 flex items-center gap-6">
            <span className="font-body text-[0.7rem] tracking-[0.3em] text-ink/50">
              {pad(lightboxIndex)} / {pad(IMAGES.length - 1)}
            </span>
            <button
              onClick={() => setLightboxIndex(null)}
              className="text-[0.78rem] tracking-[0.3em] uppercase opacity-70 transition-opacity hover:opacity-100"
            >
              Close
            </button>
            <button
              onClick={() =>
                downloadImage(
                  IMAGES[lightboxIndex],
                  `DAVE_${lightboxIndex + 1}.jpg`
                )
              }
              className="rounded-full border border-gold px-6 py-3 text-[0.78rem] tracking-[0.2em] uppercase text-gold transition-colors hover:bg-gold/10"
            >
              Download
            </button>
          </div>
        </div>
      )}
    </>
  );
}
