'use client';

export default function MapSkeleton() {
  return (
    <div className='flex h-full w-full items-center justify-center bg-[#080808] relative overflow-hidden'>
      <div className='absolute inset-0 opacity-20'>
        <svg
          viewBox='0 0 400 400'
          className='w-full h-full'
          preserveAspectRatio='xMidYMid slice'
        >
          <defs>
            <linearGradient id='shimmer' x1='0%' y1='0%' x2='100%' y2='0%'>
              <stop offset='0%' stopColor='transparent' />
              <stop offset='50%' stopColor='rgba(20, 184, 166, 0.1)' />
              <stop offset='100%' stopColor='transparent' />
              <animate
                attributeName='x1'
                from='-100%'
                to='100%'
                dur='1.5s'
                repeatCount='indefinite'
              />
              <animate
                attributeName='x2'
                from='0%'
                to='200%'
                dur='1.5s'
                repeatCount='indefinite'
              />
            </linearGradient>
          </defs>
          <path
            d='M200,50 Q280,80 300,150 Q320,220 280,280 Q240,340 180,350 Q120,360 80,300 Q40,240 60,170 Q80,100 140,60 Q180,30 200,50'
            fill='none'
            stroke='rgba(20, 184, 166, 0.3)'
            strokeWidth='2'
          />
          <rect x='0' y='0' width='400' height='400' fill='url(#shimmer)' />
        </svg>
      </div>
      <div className='relative z-10 flex flex-col items-center gap-4'>
        <div className='w-10 h-10 border-3 border-teal-600/30 border-t-teal-500 rounded-full animate-spin' />
        <div className='text-sm text-neutral-500'>মানচিত্র লোড হচ্ছে...</div>
      </div>
    </div>
  );
}
