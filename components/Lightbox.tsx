"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { Photo } from "@/lib/photos";

export default function Lightbox({
  photo,
  onClose,
  onDownload,
}: {
  photo: Photo;
  onClose: () => void;
  onDownload: (p: Photo) => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] bg-ink/95 flex items-center justify-center p-4 md:p-10"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.url}
          alt={photo.id}
          width={1200}
          height={1200}
          className="w-full h-auto max-h-[75vh] object-contain rounded-lg"
          unoptimized
        />
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={onClose}
            className="text-xs tracking-widest uppercase text-bone/60 hover:text-bone"
          >
            Close
          </button>
          <button
            onClick={() => onDownload(photo)}
            className="glow-text border border-glow/50 rounded-full px-5 py-2 text-xs tracking-widest uppercase hover:bg-glow/10 transition"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}