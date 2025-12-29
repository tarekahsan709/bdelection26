'use client';

import { useEffect, useRef, useState } from 'react';

import { isMobileViewport } from '@/lib/meme-pulse-utils';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  VideoIcon,
} from '@/components/icons';

import {
  MEME_PULSE_TEXT,
  MEME_PULSE_UI,
  YOUTUBE_URLS,
} from '@/constants/meme-pulse';

import { VideoCard } from './VideoCard';

import type { VideoItem } from '@/types/meme-pulse';

// =============================================================================
// Types
// =============================================================================

interface AreaVideosProps {
  districtName: string;
  districtNameBn?: string;
}

type SortType = 'trending' | 'recent';

// =============================================================================
// Custom Hooks
// =============================================================================

function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(isMobileViewport());
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

function useVideos(districtName: string, activeTab: SortType) {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchVideos = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/meme-pulse?district=${encodeURIComponent(districtName)}&sort=${activeTab}`,
          { signal: controller.signal },
        );
        const data = await response.json();

        if (isMounted) {
          if (data.success) {
            setVideos(data.videos || []);
          } else {
            setError(data.error || 'ভিডিও লোড করতে ব্যর্থ');
          }
        }
      } catch (err) {
        if (isMounted && err instanceof Error && err.name !== 'AbortError') {
          setError('সংযোগ ব্যর্থ');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchVideos();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [districtName, activeTab]);

  return { videos, loading, error };
}

function useHorizontalScroll(videos: VideoItem[]) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft <
        container.scrollWidth -
          container.clientWidth -
          MEME_PULSE_UI.SCROLL_BUFFER,
    );
  };

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({
      left: -MEME_PULSE_UI.SCROLL_AMOUNT,
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({
      left: MEME_PULSE_UI.SCROLL_AMOUNT,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollPosition);
      }
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [videos]);

  return {
    scrollContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollRight,
  };
}

// =============================================================================
// Sub-Components
// =============================================================================

interface HeaderProps {
  districtName: string;
  districtNameBn?: string;
  activeTab: SortType;
  onTabChange: (tab: SortType) => void;
}

function Header({
  districtName,
  districtNameBn,
  activeTab,
  onTabChange,
}: HeaderProps) {
  return (
    <div className='px-6 py-4 border-b border-white/10 bg-gradient-to-r from-red-500/10 to-transparent'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center'>
            <span className='text-xl'>📹</span>
          </div>
          <div>
            <h3 className='text-lg font-semibold text-white'>
              {MEME_PULSE_TEXT.ui.whatsHappening(
                districtNameBn || districtName,
              )}
            </h3>
            <p className='text-sm text-neutral-400'>
              {MEME_PULSE_TEXT.ui.whatsHappeningEn}
            </p>
          </div>
        </div>
        <TabSelector activeTab={activeTab} onTabChange={onTabChange} />
      </div>
    </div>
  );
}

interface TabSelectorProps {
  activeTab: SortType;
  onTabChange: (tab: SortType) => void;
}

function TabSelector({ activeTab, onTabChange }: TabSelectorProps) {
  return (
    <div className='flex items-center gap-1 bg-neutral-800/50 rounded-lg p-1'>
      <TabButton
        active={activeTab === 'trending'}
        onClick={() => onTabChange('trending')}
        label={MEME_PULSE_TEXT.ui.trendingTab}
      />
      <TabButton
        active={activeTab === 'recent'}
        onClick={() => onTabChange('recent')}
        label={MEME_PULSE_TEXT.ui.recentTab}
      />
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

function TabButton({ active, onClick, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
        active ? 'bg-red-500 text-white' : 'text-neutral-400 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function LoadingSkeleton() {
  return (
    <div className='flex gap-4 overflow-hidden'>
      {Array.from({ length: MEME_PULSE_UI.SKELETON_COUNT }).map((_, i) => (
        <div key={i} className='w-72 flex-shrink-0 animate-pulse'>
          <div className='aspect-video bg-neutral-800 rounded-xl' />
          <div className='mt-3 space-y-2'>
            <div className='h-4 bg-neutral-800 rounded w-full' />
            <div className='h-3 bg-neutral-800 rounded w-2/3' />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className='text-center py-8'>
      <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-800 flex items-center justify-center'>
        <VideoIcon className='w-8 h-8 text-neutral-600' />
      </div>
      <p className='text-neutral-400'>{error}</p>
      <p className='text-neutral-600 text-sm mt-1'>
        {MEME_PULSE_TEXT.ui.apiNotConfigured}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className='text-center py-8'>
      <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-800 flex items-center justify-center'>
        <span className='text-3xl'>📹</span>
      </div>
      <p className='text-neutral-400'>{MEME_PULSE_TEXT.ui.noVideosFound}</p>
      <p className='text-neutral-600 text-sm mt-1'>
        {MEME_PULSE_TEXT.ui.noVideosFoundEn}
      </p>
    </div>
  );
}

interface ScrollButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
}

function ScrollButton({ direction, onClick }: ScrollButtonProps) {
  const isLeft = direction === 'left';

  return (
    <button
      onClick={onClick}
      className={`absolute ${isLeft ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/80 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-red-600`}
    >
      {isLeft ? (
        <ChevronLeftIcon className='w-5 h-5' />
      ) : (
        <ChevronRightIcon className='w-5 h-5' />
      )}
    </button>
  );
}

interface VideoCarouselProps {
  videos: VideoItem[];
  isMobile: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

function VideoCarousel({
  videos,
  isMobile,
  scrollContainerRef,
  canScrollLeft,
  canScrollRight,
  onScrollLeft,
  onScrollRight,
}: VideoCarouselProps) {
  return (
    <div className='relative group/carousel'>
      {canScrollLeft && (
        <ScrollButton direction='left' onClick={onScrollLeft} />
      )}

      <div
        ref={scrollContainerRef}
        className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:flex-row flex-col md:overflow-x-auto overflow-visible'
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            layout={isMobile ? 'vertical' : 'horizontal'}
          />
        ))}
      </div>

      {canScrollRight && (
        <ScrollButton direction='right' onClick={onScrollRight} />
      )}

      {/* Gradient Edges */}
      <div className='hidden md:block absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-neutral-900/50 to-transparent pointer-events-none' />
      <div className='hidden md:block absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-neutral-900/50 to-transparent pointer-events-none' />
    </div>
  );
}

function Footer({ districtName }: { districtName: string }) {
  const searchQuery = `${districtName} জেলা বাংলাদেশ নির্বাচন`;

  return (
    <div className='mt-4 pt-4 border-t border-white/5 flex items-center justify-between'>
      <p className='text-xs text-neutral-600'>
        {MEME_PULSE_TEXT.ui.fromYoutube}
      </p>
      <a
        href={YOUTUBE_URLS.search(searchQuery)}
        target='_blank'
        rel='noopener noreferrer'
        className='text-xs text-red-400 hover:text-red-300 flex items-center gap-1'
      >
        {MEME_PULSE_TEXT.ui.viewMoreOnYoutube}
        <ExternalLinkIcon />
      </a>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function AreaVideos({ districtName, districtNameBn }: AreaVideosProps) {
  const [activeTab, setActiveTab] = useState<SortType>('trending');
  const isMobile = useMobileDetection();
  const { videos, loading, error } = useVideos(districtName, activeTab);
  const {
    scrollContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollRight,
  } = useHorizontalScroll(videos);

  const hasVideos = !loading && !error && videos.length > 0;

  return (
    <div className='bg-neutral-900/50 border border-white/10 rounded-2xl overflow-hidden'>
      <Header
        districtName={districtName}
        districtNameBn={districtNameBn}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className='p-6'>
        {loading && <LoadingSkeleton />}
        {error && !loading && <ErrorState error={error} />}
        {!loading && !error && videos.length === 0 && <EmptyState />}

        {hasVideos && (
          <VideoCarousel
            videos={videos}
            isMobile={isMobile}
            scrollContainerRef={scrollContainerRef}
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
            onScrollLeft={scrollLeft}
            onScrollRight={scrollRight}
          />
        )}

        {hasVideos && <Footer districtName={districtName} />}
      </div>
    </div>
  );
}
