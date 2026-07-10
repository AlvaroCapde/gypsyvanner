"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageCarouselProps {
  images: string[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(2);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="absolute inset-0 w-full h-full bg-zinc-200">
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Gypsy Vanner ${index + 1}`}
          fill
          className={`object-cover object-center transition-opacity duration-[2000ms] ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          priority={index === 0}
        />
      ))}
    </div>
  );
}
