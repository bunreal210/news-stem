'use client';

import React, { useState } from 'react';
import { extractYouTubeId } from '@/lib/utils';
import { Play, Video } from 'lucide-react';

interface YouTubePlayerProps {
  url?: string;
  youtubeId?: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
}

export default function YouTubePlayer({
  url,
  youtubeId,
  title = 'Video hoạt động CLB STEM',
  className = '',
  autoPlay = false,
}: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const id = youtubeId || extractYouTubeId(url);

  if (!id) {
    return null;
  }

  const embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
  const thumbnailUrl = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  const hqThumbnailUrl = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-slate-900 shadow-xl border border-slate-800 ${className}`}>
      {/* 16:9 Aspect Ratio Container */}
      <div className="relative w-full pt-[56.25%]">
        {!isPlaying ? (
          <div
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 cursor-pointer group transition-all duration-300"
          >
            {/* Background Thumbnail with fallback */}
            <img
              src={thumbnailUrl}
              onError={(e) => {
                // Nếu maxresdefault không có thì dùng hqdefault
                (e.target as HTMLImageElement).src = hqThumbnailUrl;
              }}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-90 group-hover:brightness-95"
            />

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Play Button & Video Badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:bg-red-600 group-hover:shadow-red-500/50">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-white" />
              </div>
              <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-md border border-white/20">
                <Video className="w-3.5 h-3.5 text-red-400" />
                Xem video trên YouTube
              </span>
            </div>

            {/* Title banner at bottom */}
            {title && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                <p className="text-white text-sm sm:text-base font-medium line-clamp-1">
                  {title}
                </p>
              </div>
            )}
          </div>
        ) : (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        )}
      </div>
    </div>
  );
}
