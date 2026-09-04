"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

type ListingLightboxProps = {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  propertyTitle: string;
};

export function ListingLightbox({ images, initialIndex, isOpen, onClose, onIndexChange, propertyTitle }: ListingLightboxProps) {
  const currentIndex = initialIndex;
  const [direction, setDirection] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const triggerRef = useRef<HTMLElement | null>(null);
  const wrapIndex = useCallback((index: number) => (index + images.length) % images.length, [images.length]);
  const selectImage = useCallback((index: number, nextDirection = 0) => {
    setDirection(nextDirection);
    setIsImageLoading(true);
    onIndexChange(wrapIndex(index));
  }, [onIndexChange, wrapIndex]);
  const changeImage = useCallback((step: number) => selectImage(currentIndex + step, step > 0 ? 1 : -1), [currentIndex, selectImage]);

  useEffect(() => {
    if (!isOpen || images.length === 0) return;
    triggerRef.current = document.activeElement as HTMLElement;
    const resetFrame = window.requestAnimationFrame(() => {
      setDirection(0);
      setIsImageLoading(true);
    });
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.cancelAnimationFrame(resetFrame);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [images.length, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") changeImage(-1);
      if (event.key === "ArrowRight") changeImage(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeImage, isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    thumbnailRefs.current[currentIndex]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [currentIndex, isOpen]);

  useEffect(() => {
    if (!isOpen || !images[currentIndex] || !isImageLoading) return;
    const preload = (image: string | undefined) => {
      if (!image) return;
      const preloadedImage = new window.Image();
      preloadedImage.src = image;
    };
    preload(images[wrapIndex(currentIndex - 1)]);
    preload(images[wrapIndex(currentIndex + 1)]);
  }, [currentIndex, images, isImageLoading, isOpen, wrapIndex]);

  if (images.length === 0) return null;

  return <AnimatePresence>
    {isOpen && <motion.div className="listing-lightbox" role="dialog" aria-modal="true" aria-label="Property photo gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="listing-lightbox-bar"><span>PROPERTY PHOTOS</span><div className="listing-lightbox-tools"><span className="listing-lightbox-counter">{String(currentIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span><button className="listing-lightbox-close" onClick={onClose} aria-label="Close gallery">×</button></div></div>
      <div className="listing-lightbox-viewer">
        <button className="listing-lightbox-prev" onClick={() => changeImage(-1)} aria-label="Previous photo">‹</button>
        <motion.div className="listing-lightbox-image-wrap" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.12} onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 70) changeImage(info.offset.x < 0 ? 1 : -1); }} initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, ease: "easeOut" }}>
          {isImageLoading && <div className="listing-lightbox-loader" role="status" aria-label="Loading photo"><span /></div>}
          <AnimatePresence initial={false} custom={direction} mode="wait"><motion.div key={images[currentIndex]} className="listing-lightbox-image" custom={direction} initial={{ opacity: 0, x: direction * 25 }} animate={{ opacity: isImageLoading ? 0 : 1, x: 0 }} exit={{ opacity: 0, x: direction * -25 }} transition={{ duration: 0.25, ease: "easeOut" }}><Image src={images[currentIndex]} alt={`${propertyTitle} photo ${currentIndex + 1}`} fill sizes="82vw" priority={currentIndex === 0} onLoad={() => setIsImageLoading(false)} onError={() => setIsImageLoading(false)} /></motion.div></AnimatePresence>
          {!isImageLoading && <span className="listing-lightbox-image-counter">{String(currentIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>}
        </motion.div>
        <button className="listing-lightbox-next" onClick={() => changeImage(1)} aria-label="Next photo">›</button>
      </div>
      <div className="listing-lightbox-thumbnails" aria-label="Photo thumbnails">{images.map((image, index) => <button key={`${image}-${index}`} ref={(element) => { thumbnailRefs.current[index] = element; }} className={`listing-lightbox-thumbnail${index === currentIndex ? " is-active" : ""}`} onClick={() => selectImage(index, index > currentIndex ? 1 : -1)} aria-label={`View photo ${index + 1}`} aria-current={index === currentIndex}><Image src={image} alt="" fill sizes="90px" /></button>)}</div>
    </motion.div>}
  </AnimatePresence>;
}