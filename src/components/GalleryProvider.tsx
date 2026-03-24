import { useState } from "react";
import ImageLightbox from "./ImageLightbox";

interface GalleryImage {
  src: string;
  alt: string;
}

interface ClickableImageProps {
  src: string;
  alt: string;
  className?: string;
  allImages: GalleryImage[];
  index: number;
  onClick: (index: number) => void;
}

export const ClickableImage = ({ src, alt, className, onClick, index }: ClickableImageProps) => (
  <img
    src={src}
    alt={alt}
    className={`${className} cursor-pointer hover:opacity-90 transition-opacity`}
    onClick={() => onClick(index)}
  />
);

interface GalleryProviderProps {
  images: GalleryImage[];
  children: (props: { openLightbox: (index: number) => void }) => React.ReactNode;
}

export const GalleryProvider = ({ images, children }: GalleryProviderProps) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      {children({ openLightbox: setLightboxIndex })}
      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
};
