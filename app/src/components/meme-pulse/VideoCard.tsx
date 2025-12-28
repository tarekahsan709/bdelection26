'use client';

import { useRef,useState } from 'react';

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
  const [isMuted, setIsMuted] = useState(true);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
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
    setIsMuted(true); // Reset to muted when leaving
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showEmbed && isMuted) {
      // Unmute the video on click
      setIsMuted(false);
    } else if (!showEmbed) {
      // If not playing yet, start playing unmuted
      setShowEmbed(true);
      setIsMuted(false);
    }
  };

  const handleOpenYouTube = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
  };

  const isVertical = layout === 'vertical';

  return (
    <div
      className={`group relative cursor-pointer transition-all duration-300 ${
        isVertical ? 'w-full' : 'w-72 shrink-0'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Thumbnail Container */}
      <div
        className={`relative overflow-hidden rounded-xl bg-neutral-900 aspect-video ${
          isHovered ? 'ring-2 ring-red-500/50 shadow-lg shadow-red-500/20' : ''
        }`}
      >
        {/* Thumbnail Image - using img for external YouTube thumbnails */}
        {!showEmbed && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={video.thumbnailHigh || video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* YouTube Embed */}
        {showEmbed && (
          <iframe
            key={isMuted ? 'muted' : 'unmuted'}
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&modestbranding=1&rel=0`}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        )}

        {/* Duration Badge - hide when embed is showing */}
        {!showEmbed && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-xs text-white font-medium">
            {video.duration}
          </div>
        )}

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

        {/* Click hint when muted */}
        {showEmbed && isMuted && (
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 rounded text-xs text-white flex items-center gap-1 animate-pulse">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
            ক্লিক করে শব্দ চালু করুন
          </div>
        )}

        {/* Open in YouTube button */}
        {showEmbed && (
          <button
            onClick={handleOpenYouTube}
            className="absolute top-2 right-2 px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs text-white flex items-center gap-1 transition-colors z-10"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
            YouTube
          </button>
        )}

        {/* Live/Trending Badge - hide when embed is showing */}
        {video.viewCount > 100000 && !showEmbed && (
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
