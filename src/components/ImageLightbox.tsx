import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface LightboxProps {
  images: { src: string; alt: string }[];
  initialIndex: number;
  onClose: () => void;
}

const ImageLightbox = ({ images, initialIndex, onClose }: LightboxProps) => {
  const [current, setCurrent] = useState(initialIndex);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white z-10 w-10 h-10 flex items-center justify-center"
      >
        <X className="w-7 h-7" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-2 md:left-6 text-white/70 hover:text-white z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 transition-colors"
      >
        <ChevronLeft className="w-7 h-7" />
      </button>

      <img
        src={images[current].src}
        alt={images[current].alt}
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />

      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-2 md:right-6 text-white/70 hover:text-white z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 transition-colors"
      >
        <ChevronRight className="w-7 h-7" />
      </button>

      <div className="absolute bottom-4 text-white/60 text-sm">
        {current + 1} / {images.length}
      </div>
    </div>
  );
};

export default ImageLightbox;
