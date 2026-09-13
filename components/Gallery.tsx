"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

const AUTOPLAY_MS = 3800;

function pad(n: number) {
  return String(n + 1).padStart(2, "0");
}

// shortest signed distance between two indices on a looping track
function wrappedOffset(index: number, active: number, len: number) {
  let diff = index - active;
  if (diff > len / 2) diff -= len;
  if (diff < -len / 2) diff += len;
  return diff;
}

export default function Gallery() {
  const [active, setActive] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zipping, setZipping] = useState(false);
  const [zipFailed, setZipFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  // Once an image is decoded, we never show a placeholder for it again.
  const [ready, setReady] = useState<boolean[]>(() => IMAGES.map(() => false));
  const touchStartX = useRef<number | null>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Cache blobs we've already fetched so downloads are instant on repeat clicks.
  const blobCache = useRef<Map<string, Blob>>(new Map());

  const goTo = useCallback((i: number) => {
    setActive(((i % IMAGES.length) + IMAGES.length) % IMAGES.length);
  }, []);
  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // ---- FIX 1: preload every image up front so nothing "forms" mid-scroll ----
  // We warm the browser's HTTP cache with real Image() objects (not the <img>
  // tags themselves, which only exist once a slide is close to active). Once
  // decoded, the <img> below reads from cache instantly — no flash.
  useEffect(() => {
    let cancelled = false;
    IMAGES.forEach((src, i) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (cancelled) return;
        setReady((r) => {
          if (r[i]) return r;
          const next = [...r];
          next[i] = true;
          return next;
        });
      };
      img.src = src;
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // autoplay — pauses on hover/touch/lightbox, resumes after
  useEffect(() => {
    if (paused || lightboxIndex !== null) return;
    autoplayRef.current = setInterval(() => {
      setActive((a) => (a + 1) % IMAGES.length);
    }, AUTOPLAY_MS);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [paused, lightboxIndex]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (lightboxIndex !== null) {
        if (e.key === "Escape") setLightboxIndex(null);
        if (e.key === "ArrowRight") setLightboxIndex((i) => (i === null ? i : (i + 1) % IMAGES.length));
        if (e.key === "ArrowLeft") setLightboxIndex((i) => (i === null ? i : (i - 1 + IMAGES.length) % IMAGES.length));
      } else {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, next, prev]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      delta < 0 ? next() : prev();
    }
    touchStartX.current = null;
    setTimeout(() => setPaused(false), 1200);
  }

  // ---- FIX 3: instant single-image download via blob, no Cloudinary reprocessing ----
  // fl_attachment forces Cloudinary to generate a brand-new derived asset on
  // first request (a real transformation job + redirect) — that's the lag.
  // Instead we fetch the plain delivery URL (already warmed in cache from the
  // preload effect above, and Cloudinary serves images with CORS enabled by
  // default) and hand the browser a local blob: URL, which downloads instantly.
  async function downloadImage(src: string, filename: string, index: number) {
    setDownloadingIndex(index);
    try {
      let blob = blobCache.current.get(src);
      if (!blob) {
        const res = await fetch(src, { mode: "cors" });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        blob = await res.blob();
        blobCache.current.set(src, blob);
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed, falling back to direct link:", err);
      // Fallback: plain navigation to the original URL (still faster than
      // fl_attachment, since it doesn't trigger a new transform).
      window.open(src, "_blank", "noopener");
    } finally {
      setDownloadingIndex(null);
    }
  }

  // ---- FIX 2: resilient "Download All" ----
  // The old version fetched all 10 images client-side and failed as a whole
  // if any single request hiccuped, with no visibility into which one broke.
  // We now: (a) reuse anything already cached from individual downloads,
  // (b) fetch the rest with Promise.allSettled so one failure doesn't kill
  // the batch, and (c) only fail if EVERY image failed, surfacing a clearer
  // error otherwise.
  async function handleDownloadAll() {
    setZipping(true);
    setZipFailed(false);
    try {
      const JSZip = (await import("jszip")).default;
      const { saveAs } = await import("file-saver");
      const zip = new JSZip();
      const folder = zip.folder("DAVE_gallery")!;

      const results = await Promise.allSettled(
        IMAGES.map(async (src, i) => {
          let blob = blobCache.current.get(src);
          if (!blob) {
            const res = await fetch(src, { mode: "cors" });
            if (!res.ok) throw new Error(`HTTP ${res.status} for image ${i + 1}`);
            blob = await res.blob();
            blobCache.current.set(src, blob);
          }
          folder.file(`DAVE_${i + 1}.jpg`, blob);
        })
      );

      const failures = results.filter((r) => r.status === "rejected");
      if (failures.length === IMAGES.length) {
        throw new Error("All image downloads failed");
      }
      if (failures.length > 0) {
        console.warn(`${failures.length} of ${IMAGES.length} images failed to zip`, failures);
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "DAVE_gallery.zip");
    } catch (err) {
      console.error(err);
      setZipFailed(true);
      setTimeout(() => setZipFailed(false), 2400);
    } finally {
      setZipping(false);
    }
  }

  return (
    <section className="relative z-[2] bg-bg px-[5vw] pt-36 pb-32 sm:pt-40">
      <div className="mb-12 flex items-baseline justify-between flex-wrap gap-6">
        <h2 className="font-display text-[clamp(2.2rem,5.5vw,3.6rem)] tracking-wide text-ink">
          Frozen In Frame
        </h2>
        <button
          onClick={handleDownloadAll}
          disabled={zipping}
          className="whitespace-nowrap rounded-full border border-gold px-7 py-3 text-[0.78rem] tracking-wide text-gold transition-colors duration-300 hover:bg-gold/10 disabled:cursor-progress disabled:opacity-60"
          style={{ textShadow: "0 0 8px rgba(212,175,55,0.4)" }}
        >
          {zipFailed ? "Failed — retry" : zipping ? "Zipping…" : "Download All"}
        </button>
      </div>

      {/* 3D coverflow slider */}
      <div
        className="relative h-[52vh] w-full overflow-hidden sm:h-[64vh]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* blurred, enlarged backdrop of the active photo — this is what makes the
            cards feel like they live IN the page instead of sitting on a hard bg */}
        {IMAGES.map((src, i) => (
          <div
            key={`bg-${src}`}
            className="absolute inset-0 scale-150 bg-cover bg-center transition-opacity duration-[1400ms] ease-out"
            style={{
              backgroundImage: `url(${src})`,
              filter: "blur(60px) saturate(1.15)",
              opacity: i === active ? 0.65 : 0,
            }}
          />
        ))}
        {/* darken + blend backdrop into page bg at top/bottom so there's no hard seam */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, var(--bg, #0a0a0a) 0%, rgba(10,10,10,0.35) 18%, rgba(10,10,10,0.35) 82%, var(--bg, #0a0a0a) 100%)",
          }}
        />

        {/* the card stack */}
        <div
          className="relative flex h-full items-center justify-center"
          style={{ perspective: "1600px" }}
        >
          {IMAGES.map((src, i) => {
            const offset = wrappedOffset(i, active, IMAGES.length);
            const abs = Math.abs(offset);
            if (abs > 2) return null;

            const isActive = offset === 0;
            const isDeep = abs === 2;

            return (
              <div
                key={src}
                onClick={() => (isActive ? setLightboxIndex(i) : goTo(i))}
                className="absolute h-[85%] w-[56%] max-w-[340px] cursor-pointer sm:w-[38%]"
                style={{
                  transform: `translateX(${offset * 52}%) translateZ(${isActive ? 0 : -abs * 80}px) scale(${1 - abs * 0.16}) rotateY(${offset * -32}deg)`,
                  opacity: isActive ? 1 : abs === 1 ? 0.5 : 0.15,
                  zIndex: 10 - abs,
                  pointerEvents: isDeep ? "none" : "auto",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  transition:
                    "transform 900ms cubic-bezier(0.22,1,0.36,1), opacity 900ms ease",
                }}
              >
                {/* image itself has no hard rectangle edge — mask fades it into
                    the blurred backdrop behind it, so there's no visible border */}
                <div
                  className="relative h-full w-full overflow-hidden"
                  style={{
                    maskImage: isActive
                      ? "radial-gradient(ellipse 92% 96% at center, black 62%, transparent 100%)"
                      : "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
                    WebkitMaskImage: isActive
                      ? "radial-gradient(ellipse 92% 96% at center, black 62%, transparent 100%)"
                      : "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
                  }}
                >
                  {/* All images are eager + fetchPriority high: they've already been
                      warmed by the preload effect, so this just reads from cache.
                      A subtle opacity fade covers the ~1 frame between mount and
                      the cached image painting, instead of a visible pop-in. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Photo ${i + 1}`}
                    className="h-full w-full object-cover transition-opacity duration-300"
                    style={{ opacity: ready[i] ? 1 : 0 }}
                    loading="eager"
                    fetchPriority={abs <= 1 ? "high" : "auto"}
                    decoding="async"
                  />
                  {isActive && (
                    <div className="pointer-events-none absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/60 via-transparent to-transparent p-4">
                      <span
                        className="font-display text-sm text-gold"
                        style={{ textShadow: "0 0 10px rgba(212,175,55,0.6)" }}
                      >
                        {pad(i)}
                      </span>
                      <span className="rounded-full border border-gold/70 px-3 py-1 text-[0.62rem] uppercase tracking-[0.25em] text-ink">
                        View
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* prev / next controls */}
        <button
          onClick={() => {
            prev();
            setPaused(true);
            setTimeout(() => setPaused(false), 1200);
          }}
          aria-label="Previous photo"
          className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink/30 bg-black/30 text-xl text-ink backdrop-blur-sm transition-colors hover:border-gold hover:text-gold sm:left-6"
        >
          ‹
        </button>
        <button
          onClick={() => {
            next();
            setPaused(true);
            setTimeout(() => setPaused(false), 1200);
          }}
          aria-label="Next photo"
          className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink/30 bg-black/30 text-xl text-ink backdrop-blur-sm transition-colors hover:border-gold hover:text-gold sm:right-6"
        >
          ›
        </button>

        {/* progress counter */}
        <div className="absolute bottom-4 right-5 z-20 font-body text-[0.7rem] tracking-[0.3em] text-ink/70">
          {pad(active)}
          <span className="mx-1 text-gold">/</span>
          {pad(IMAGES.length - 1)}
        </div>
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
              setLightboxIndex((i) => (i === null ? i : (i - 1 + IMAGES.length) % IMAGES.length))
            }
            aria-label="Previous photo"
            className="absolute left-4 top-1/2 -translate-y-1/2 px-3 py-6 text-2xl text-ink/60 transition-colors hover:text-gold sm:left-8"
          >
            ‹
          </button>
          <button
            onClick={() =>
              setLightboxIndex((i) => (i === null ? i : (i + 1) % IMAGES.length))
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
                downloadImage(IMAGES[lightboxIndex], `DAVE_${lightboxIndex + 1}.jpg`, lightboxIndex)
              }
              disabled={downloadingIndex === lightboxIndex}
              className="rounded-full border border-gold px-6 py-3 text-[0.78rem] tracking-[0.2em] uppercase text-gold transition-colors hover:bg-gold/10 disabled:opacity-60"
            >
              {downloadingIndex === lightboxIndex ? "…" : "Download"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
