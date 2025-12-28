'use client';

import { useEffect, useRef,useState } from 'react';

import { VideoCard } from './VideoCard';

import type { VideoItem } from '@/types/meme-pulse';

interface AreaVideosProps {
  districtName: string;
  districtNameBn?: string;
}

type SortType = 'trending' | 'recent';

export function AreaVideos({ districtName, districtNameBn }: AreaVideosProps) {
  const [activeTab, setActiveTab] = useState<SortType>('trending');
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Detect mobile layout after hydration
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check scroll position
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  // Scroll handlers
  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Fetch videos
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchVideos = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/meme-pulse?district=${encodeURIComponent(districtName)}&sort=${activeTab}`,
          { signal: controller.signal }
        );
        const data = await response.json();

        if (isMounted) {
          if (data.success) {
            setVideos(data.videos || []);
          } else {
            setError(data.error || 'Failed to load videos');
          }
        }
      } catch (err) {
        if (isMounted && err instanceof Error && err.name !== 'AbortError') {
          setError('Failed to connect');
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

  // Check scroll position on mount and resize
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

  return (
    <div className="bg-neutral-900/50 border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-red-500/10 to-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-xl">📹</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {districtNameBn || districtName} জেলায় কী হচ্ছে?
              </h3>
              <p className="text-sm text-neutral-400">What&apos;s happening in your district</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-neutral-800/50 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'trending'
                  ? 'bg-red-500 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              🔥 ট্রেন্ডিং
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'recent'
                  ? 'bg-red-500 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              🕐 সাম্প্রতিক
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Loading State */}
        {loading && (
          <div className="flex gap-4 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-72 flex-shrink-0 animate-pulse">
                <div className="aspect-video bg-neutral-800 rounded-xl" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 bg-neutral-800 rounded w-full" />
                  <div className="h-3 bg-neutral-800 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-neutral-400">{error}</p>
            <p className="text-neutral-600 text-sm mt-1">YouTube API not configured</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && videos.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-800 flex items-center justify-center">
              <span className="text-3xl">📹</span>
            </div>
            <p className="text-neutral-400">এই জেলার কোনো ভিডিও পাওয়া যায়নি</p>
            <p className="text-neutral-600 text-sm mt-1">No videos found for this district</p>
          </div>
        )}

        {/* Videos - Desktop Carousel */}
        {!loading && !error && videos.length > 0 && (
          <div className="relative group/carousel">
            {/* Scroll Left Button */}
            {canScrollLeft && (
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/80 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-red-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Videos Container - Horizontal scroll on desktop, vertical on mobile */}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:flex-row flex-col md:overflow-x-auto overflow-visible"
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

            {/* Scroll Right Button */}
            {canScrollRight && (
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/80 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-red-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Gradient Edges */}
            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-neutral-900/50 to-transparent pointer-events-none" />
            <div className="hidden md:block absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-neutral-900/50 to-transparent pointer-events-none" />
          </div>
        )}

        {/* Footer Note */}
        {!loading && !error && videos.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-xs text-neutral-600">
              ইউটিউব থেকে • YouTube থেকে স্বয়ংক্রিয়ভাবে সংগৃহীত
            </p>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(districtName + ' জেলা বাংলাদেশ নির্বাচন')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              YouTube-এ আরও দেখুন
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
