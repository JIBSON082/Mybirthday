"use client";

import { useState } from "react";

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

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zipping, setZipping] = useState(false);
  const [zipFailed, setZipFailed] = useState(false);

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
    <section className="relative z-[2] bg-bg px-[5vw] pt-[110px] pb-[140px]">
      <div className="flex items-baseline justify-between flex-wrap gap-6 mb-14">
        <h2 className="font-display font-normal text-[clamp(2.4rem,6vw,4.2rem)] tracking-wide">
          The Moments
        </h2>
        <button
          onClick={handleDownloadAll}
          disabled={zipping}
          className="whitespace-nowrap rounded-full border border-gold px-8 py-3.5 text-[0.85rem] tracking-wide text-gold transition-colors duration-300 hover:bg-gold/10 disabled:opacity-60 disabled:cursor-progress"
          style={{ textShadow: "0 0 8px rgba(212,175,55,0.4)" }}
        >
          {zipFailed ? "Failed — retry" : zipping ? "Zipping…" : "Download All"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3 md:gap-[18px]">
        {IMAGES.map((src, i) => (
          <div
            key={src}
            className="relative overflow-hidden rounded-sm cursor-pointer aspect-[3/4]"
            onClick={() => setLightboxIndex(i)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Photo ${i + 1}`}
              loading="lazy"
              className="block h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 hover:opacity-100">
              <span className="rounded-full border border-gold px-5 py-2.5 text-[0.72rem] tracking-[0.35em] uppercase text-ink">
                View
              </span>
            </div>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center px-[5vw] py-[6vh]"
          style={{ background: "rgba(6,6,6,0.97)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightboxIndex(null);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={IMAGES[lightboxIndex]}
            alt={`Photo ${lightboxIndex + 1}`}
            className="max-w-[min(92vw,900px)] max-h-[68vh] object-contain shadow-2xl"
          />
          <div className="mt-8 flex items-center gap-6">
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
    </section>
  );
}
