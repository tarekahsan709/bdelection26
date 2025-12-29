import { Metadata } from 'next';
import Link from 'next/link';

import { ParallaxBackground } from '@/components/ui/ParallaxBackground';

export const metadata: Metadata = {
  title: 'পৃষ্ঠা পাওয়া যায়নি | বাংলাদেশ নির্বাচন',
};

export default function NotFound() {
  return (
    <div className='min-h-screen bg-[#0c0c0c] relative'>
      <ParallaxBackground />
      <main className='relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center'>
        <div className='text-8xl font-bold text-teal-500/20 mb-4'>404</div>
        <h1 className='text-3xl md:text-4xl font-bold text-white mb-3'>
          পাতাটি খুঁজে পাওয়া যায়নি
        </h1>
        <p className='text-neutral-400 mb-8 max-w-md'>
          আপনি যে পাতাটি খুঁজছেন সেটি হয়তো সরানো হয়েছে বা ঠিকানায় ভুল আছে।
        </p>
        <Link
          href='/'
          className='px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-medium transition-colors'
        >
          মানচিত্রে ফিরুন
        </Link>
      </main>
    </div>
  );
}
