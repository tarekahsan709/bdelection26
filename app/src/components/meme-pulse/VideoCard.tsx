'use client';

import { useState, useRef } from 'react';
import type { VideoItem } from '@/types/meme-pulse';

interface VideoCardProps {
  video: VideoItem;
  layout?: 'horizontal' | 'vertical';
}

// Format view count to readable format
function formatViews(views: number): string {
  if (views >= 10000000) return `${(views / 10000000).toFixed(1)} কোটি`;
  if (views >= 100000) return `${(views / 100000).toFixed(1)} লক্ষ`;
  if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
  return views.toString();
}

// Format relative time
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'আজ';
  if (diffDays === 1) return 'গতকাল';
  if (diffDays < 7) return `${diffDays} দিন আগে`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} সপ্তাহ আগে`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} মাস আগে`;
  return `${Math.floor(diffDays / 365)} বছর আগে`;
}

export function VideoCard({ video, layout = 'horizontal' }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    // Start playing after 500ms of hover
    hoverTimeoutRef.current = setTimeout(() => {
      setShowEmbed(true);
    }, 500);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(false);
    setShowEmbed(false);
  };

  const handleClick = () => {
    // Open YouTube video in new tab
    window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
  };

  const isVertical = layout === 'vertical';

  return (
    <div
      className={`group relative cursor-pointer transition-all duration-300 ${
        isVertical ? 'w-full' : 'w-72 flex-shrink-0'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Thumbnail Container */}
      <div
        className={`relative overflow-hidden rounded-xl bg-neutral-900 ${
          isVertical ? 'aspect-video' : 'aspect-video'
        } ${isHovered ? 'ring-2 ring-red-500/50 shadow-lg shadow-red-500/20' : ''}`}
      >
        {/* Thumbnail Image */}
        {!showEmbed && (
          <img
            src={video.thumbnailHigh || video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* YouTube Embed (on hover) */}
        {showEmbed && (
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        )}

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-xs text-white font-medium">
          {video.duration}
        </div>

        {/* Play Overlay */}
        {!showEmbed && (
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Live/Trending Badge */}
        {video.viewCount > 100000 && (
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 rounded text-xs text-white font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            ট্রেন্ডিং
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="mt-3 px-1">
        {/* Title */}
        <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-red-400 transition-colors">
          {video.title}
        </h3>

        {/* Channel & Meta */}
        <div className="mt-1.5 flex items-center gap-2 text-xs text-neutral-500">
          <span className="truncate max-w-[120px]">{video.channelName}</span>
          <span>•</span>
          <span>{formatViews(video.viewCount)} ভিউ</span>
          <span>•</span>
          <span>{formatTimeAgo(video.publishedAt)}</span>
        </div>

        {/* Source Badge */}
        <div className="mt-2">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
              video.channelName.includes('TV') ||
              video.channelName.includes('News') ||
              video.channelName.includes('Jamuna') ||
              video.channelName.includes('Somoy') ||
              video.channelName.includes('NTV') ||
              video.channelName.includes('ATN')
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-neutral-800 text-neutral-400'
            }`}
          >
            {video.channelName.includes('TV') ||
            video.channelName.includes('News') ||
            video.channelName.includes('Jamuna') ||
            video.channelName.includes('Somoy')
              ? '📺 News'
              : '🎥 Creator'}
          </span>
        </div>
      </div>
    </div>
  );
}
