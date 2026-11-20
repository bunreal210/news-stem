'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ImageGalleryProps {
  images?: string[];
  title?: string;
}

export default function ImageGallery({ images = [], title = 'Hình ảnh hoạt động' }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  const nextImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };
  const prevImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="my-8">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-5 bg-blue-600 rounded-full inline-block" />
        {title} ({images.length} ảnh)
      </h3>

      <div className={`grid gap-4 ${
        images.length === 1 ? 'grid-cols-1' :
        images.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
        images.length === 3 ? 'grid-cols-1 sm:grid-cols-3' :
        'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
      }`}>
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => openLightbox(idx)}
            className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 cursor-pointer shadow-sm hover:shadow-lg transition-all"
          >
            <img
              src={img}
              alt={`Hình ảnh ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="p-2 rounded-full bg-white/90 text-slate-800 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </>
          )}

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img
              src={images[selectedIndex]}
              alt={`Ảnh phóng to ${selectedIndex + 1}`}
              className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-2xl"
            />
            <span className="mt-3 text-sm text-slate-300 font-medium">
              {selectedIndex + 1} / {images.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
