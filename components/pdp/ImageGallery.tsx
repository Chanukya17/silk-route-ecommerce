"use client";

import Image from "next/image";
import { useState } from "react";
import WishlistButton from "../WishlistButton";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [mainImg, setMainImg] = useState(images[0] || '/images/handloom_tile.png');

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail column */}
      <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto max-h-[600px] scrollbar-hide shrink-0">
        {images.length > 0 ? images.map((img, i) => (
          <button 
            key={i} 
            onClick={() => setMainImg(img)}
            className={`relative w-20 h-24 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${mainImg === img ? 'border-primary-900' : 'border-transparent hover:border-primary-300'}`}
          >
            <Image src={img} alt={`${productName} thumbnail ${i+1}`} fill className="object-cover" />
          </button>
        )) : (
          <button className="relative w-20 h-24 rounded-lg overflow-hidden border-2 border-primary-900">
             <Image src="/images/handloom_tile.png" alt="Fallback thumbnail" fill className="object-cover" />
          </button>
        )}
      </div>

      {/* Main Image with Zoom on hover */}
      <div className="relative aspect-[3/4] w-full max-w-lg bg-secondary/10 rounded-2xl overflow-hidden group cursor-crosshair">
        <Image
          src={mainImg}
          alt={productName}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-150 origin-center"
        />
        <div className="absolute top-4 right-4 z-10 cursor-default">
          <WishlistButton productId={productName} />
        </div>
      </div>
    </div>
  );
}
