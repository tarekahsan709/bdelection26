'use client';

import { useRef, useState } from 'react';

import {
  formatTimeAgo,
  formatViews,
  isNewsChannel,
  isTrendingVideo,
} from '@/lib/meme-pulse-utils';

import { MutedIcon, PlayIcon, YouTubeIcon } from '@/components/icons';

import {
  MEME_PULSE_TEXT,
  MEME_PULSE_UI,
  YOUTUBE_URLS,
} from '@/constants/meme-pulse';

import type { VideoItem } from '@/types/meme-pulse';

// =============================================================================
// Types
// =============================================================================

interface VideoCardProps {
  video: VideoItem;
  layout?: 'horizontal' | 'vertical';
}

// =============================================================================
// Sub-Components
// =============================================================================

interface ThumbnailProps {
  video: VideoItem;
  isHovered: boolean;
}

function Thumbnail({ video, isHovered }: ThumbnailProps) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={video.thumbnailHigh || video.thumbnailUrl}
        alt={video.title}
        className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
        loading='lazy'
      />
      <DurationBadge duration={video.duration} />
      <PlayOverlay isVisible={isHovered} />
      <TrendingBadge viewCount={video.viewCount} />
    </>
  );
}

function DurationBadge({ duration }: { duration: string }) {
  return (
    <div className='absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-xs text-white font-medium'>
      {duration}
    </div>
  );
}

function PlayOverlay({ isVisible }: { isVisible: boolean }) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className='w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110'>
        <PlayIcon className='w-6 h-6 text-white ml-1' />
      </div>
    </div>
  );
}

function TrendingBadge({ viewCount }: { viewCount: number }) {
  if (!isTrendingVideo(viewCount)) return null;

  return (
    <div className='absolute top-2 left-2 px-2 py-0.5 bg-red-600 rounded text-xs text-white font-medium flex items-center gap-1'>
      <span className='w-1.5 h-1.5 bg-white rounded-full animate-pulse' />
      {MEME_PULSE_TEXT.badges.trending}
    </div>
  );
}

interface VideoEmbedProps {
  videoId: string;
  isMuted: boolean;
  onOpenYouTube: (e: React.MouseEvent) => void;
}

function VideoEmbed({ videoId, isMuted, onOpenYouTube }: VideoEmbedProps) {
  return (
    <>
      <iframe
        key={isMuted ? 'muted' : 'unmuted'}
        src={YOUTUBE_URLS.embed(videoId, { autoplay: true, mute: isMuted })}
        className='absolute inset-0 w-full h-full'
        allow='autoplay; encrypted-media'
        allowFullScreen
      />
      {isMuted && <MuteHint />}
      <YouTubeButton onClick={onOpenYouTube} />
    </>
  );
}

function MuteHint() {
  return (
    <div className='absolute bottom-2 left-2 px-2 py-1 bg-black/80 rounded text-xs text-white flex items-center gap-1 animate-pulse'>
      <MutedIcon />
      {MEME_PULSE_TEXT.ui.clickToUnmute}
    </div>
  );
}

function YouTubeButton({
  onClick,
}: {
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={onClick}
      className='absolute top-2 right-2 px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs text-white flex items-center gap-1 transition-colors z-10'
    >
      <YouTubeIcon />
      {MEME_PULSE_TEXT.ui.youtube}
    </button>
  );
}

function VideoInfo({ video }: { video: VideoItem }) {
  return (
    <div className='mt-3 px-1'>
      <h3 className='text-sm font-medium text-white line-clamp-2 group-hover:text-red-400 transition-colors'>
        {video.title}
      </h3>
      <VideoMeta video={video} />
      <SourceBadge channelName={video.channelName} />
    </div>
  );
}

function VideoMeta({ video }: { video: VideoItem }) {
  return (
    <div className='mt-1.5 flex items-center gap-2 text-xs text-neutral-500'>
      <span className='truncate max-w-[120px]'>{video.channelName}</span>
      <span>•</span>
      <span>
        {formatViews(video.viewCount)} {MEME_PULSE_TEXT.views.suffix}
      </span>
      <span>•</span>
      <span>{formatTimeAgo(video.publishedAt)}</span>
    </div>
  );
}

function SourceBadge({ channelName }: { channelName: string }) {
  const isNews = isNewsChannel(channelName);

  return (
    <div className='mt-2'>
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
          isNews
            ? 'bg-blue-500/20 text-blue-400'
            : 'bg-neutral-800 text-neutral-400'
        }`}
      >
        {isNews
          ? `📺 ${MEME_PULSE_TEXT.badges.news}`
          : `🎥 ${MEME_PULSE_TEXT.badges.creator}`}
      </span>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function VideoCard({ video, layout = 'horizontal' }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isVertical = layout === 'vertical';

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowEmbed(true);
    }, MEME_PULSE_UI.HOVER_DELAY_MS);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(false);
    setShowEmbed(false);
    setIsMuted(true);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showEmbed && isMuted) {
      setIsMuted(false);
    } else if (!showEmbed) {
      setShowEmbed(true);
      setIsMuted(false);
    }
  };

  const handleOpenYouTube = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(YOUTUBE_URLS.watch(video.id), '_blank');
  };

  return (
    <div
      className={`group relative cursor-pointer transition-all duration-300 ${
        isVertical ? 'w-full' : 'w-72 shrink-0'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div
        className={`relative overflow-hidden rounded-xl bg-neutral-900 aspect-video ${
          isHovered ? 'ring-2 ring-red-500/50 shadow-lg shadow-red-500/20' : ''
        }`}
      >
        {showEmbed ? (
          <VideoEmbed
            videoId={video.id}
            isMuted={isMuted}
            onOpenYouTube={handleOpenYouTube}
          />
        ) : (
          <Thumbnail video={video} isHovered={isHovered} />
        )}
      </div>
      <VideoInfo video={video} />
    </div>
  );
}
