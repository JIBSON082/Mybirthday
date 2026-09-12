"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { Photo } from "@/lib/photos";
import Lightbox from "@/components/Lightbox";

gsap.registerPlugin(ScrollTrigger);

export default function Gallery({ photos }: { photos: Photo[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Photo | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const items = gridRef.current?.querySelectorAll(".gallery-item");
    if (!items) return;

    items.forEach((item, i) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: 80, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          delay: (i % 3) * 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
          },
        }
      );
    });
  }, []);

  async function downloadOne(photo: Photo) {
    const res = await fetch(photo.url);
    const blob = await res.blob();
    saveAs(blob, `${photo.id}.jpg`);
  }

  async function downloadAll() {
    setDownloading(true);
    try {
      const zip = new JSZip();
      await Promise.all(
        photos.map(async (p) => {
          const res = await fetch(p.url);
          const blob = await res.blob();
          zip.file(`${p.id}.jpg`, blob);
        })
      );
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "DAVE_gallery.zip");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <section className="relative z-10 bg-ink px-4 md:px-8 py-24">
      <div className="flex items-center justify-between mb-10 px-2">
        <h2 className="font-display text-2xl md:text-4xl uppercase tracking-tight">
          The Moments
        </h2>
        <button
          onClick={downloadAll}
          disabled={downloading}
          className="glow-text border border-glow/50 rounded-full px-5 py-2 text-xs md:text-sm tracking-widest uppercase hover:bg-glow/10 transition"
        >
          {downloading ? "Zipping…" : "Download All"}
        </button>
      </div>

      <div
        ref={gridRef}
        className="columns-2 md:columns-3 gap-3 md:gap-4 [column-fill:_balance]"
      >
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            className="gallery-item mb-3 md:mb-4 break-inside-avoid relative group cursor-pointer overflow-hidden rounded-lg"
            onClick={() => setActive(photo)}
          >
            <Image
              src={photo.url}
              alt={photo.id}
              width={600}
              height={i % 3 === 0 ? 800 : 600}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/30 transition flex items-end p-3 opacity-0 group-hover:opacity-100">
              <span className="text-xs tracking-widest uppercase glow-text">
                View
              </span>
            </div>
          </div>
        ))}
      </div>

      {active && (
        <Lightbox
          photo={active}
          onClose={() => setActive(null)}
          onDownload={downloadOne}
        />
      )}
    </section>
  );
}