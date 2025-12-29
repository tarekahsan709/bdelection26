import type { Metadata } from 'next';
import Link from 'next/link';

import { siteConfig } from '@/constants/site';

export const metadata: Metadata = {
  title: 'গোপনীয়তা নীতি | Privacy Policy',
  description:
    'বাংলাদেশ নির্বাচন মানচিত্র অ্যাপের গোপনীয়তা নীতি। আমরা কোনো ব্যক্তিগত তথ্য সংগ্রহ করি না। Privacy policy for Bangladesh Election Map - we do not collect any personal data.',
  alternates: {
    canonical: `${siteConfig.url}/privacy`,
  },
  openGraph: {
    title: 'গোপনীয়তা নীতি | Privacy Policy - Bangladesh Election Map',
    description:
      'আমরা কোনো ব্যক্তিগত তথ্য সংগ্রহ করি না। No personal data collected.',
    url: `${siteConfig.url}/privacy`,
    type: 'website',
  },
};

export default function PrivacyPage() {
  return (
    <div className='min-h-screen bg-[#0c0c0c] relative'>
      {/* Background */}
      <div className='fixed inset-0 pointer-events-none'>
        <div className='absolute inset-0 bg-[#0c0c0c]' />
        <div
          className='absolute inset-0 opacity-30'
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(13, 148, 136, 0.15) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Header */}
      <header className='sticky top-0 z-50 bg-[#0c0c0c]/90 backdrop-blur-xl border-b border-white/[0.04]'>
        <div className='max-w-4xl mx-auto px-4 py-3 flex items-center justify-between'>
          <Link
            href='/'
            className='flex items-center gap-2 text-neutral-500 hover:text-white transition-colors'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
            <span className='text-sm'>মানচিত্রে ফিরুন</span>
          </Link>
          <span className='text-sm text-neutral-400'>Privacy Policy</span>
          <div className='w-20' />
        </div>
      </header>

      <main className='relative z-10 max-w-4xl mx-auto px-4 py-12 pb-24'>
        <h1 className='text-4xl md:text-5xl font-bold text-white mb-2'>
          গোপনীয়তা নীতি
        </h1>
        <p className='text-xl text-neutral-400 mb-12'>Privacy Policy</p>

        <div className='prose prose-invert prose-neutral max-w-none space-y-8'>
          {/* Summary Box */}
          <section className='p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20'>
            <h2 className='text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-3'>
              <span className='text-3xl'>🔒</span>
              সংক্ষেপে | In Short
            </h2>
            <div className='grid md:grid-cols-2 gap-4'>
              <div className='flex items-center gap-3 text-neutral-300'>
                <span className='text-2xl'>✅</span>
                <span>
                  কোনো লগইন প্রয়োজন নেই
                  <br />
                  <span className='text-neutral-500 text-sm'>
                    No login required
                  </span>
                </span>
              </div>
              <div className='flex items-center gap-3 text-neutral-300'>
                <span className='text-2xl'>✅</span>
                <span>
                  কোনো কুকি ব্যবহার করা হয় না
                  <br />
                  <span className='text-neutral-500 text-sm'>
                    No cookies used
                  </span>
                </span>
              </div>
              <div className='flex items-center gap-3 text-neutral-300'>
                <span className='text-2xl'>✅</span>
                <span>
                  ব্যক্তিগত তথ্য সংগ্রহ করা হয় না
                  <br />
                  <span className='text-neutral-500 text-sm'>
                    No personal data collected
                  </span>
                </span>
              </div>
              <div className='flex items-center gap-3 text-neutral-300'>
                <span className='text-2xl'>✅</span>
                <span>
                  তথ্য বিক্রি করা হয় না
                  <br />
                  <span className='text-neutral-500 text-sm'>
                    Data never sold
                  </span>
                </span>
              </div>
            </div>
          </section>

          {/* What We Collect */}
          <section>
            <h2 className='text-xl font-bold text-white mb-4'>
              📋 আমরা কী সংগ্রহ করি | What We Collect
            </h2>
            <div className='space-y-4'>
              <div className='p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]'>
                <h3 className='font-semibold text-white mb-2'>
                  ১. আইপি ঠিকানা (সাময়িক)
                </h3>
                <p className='text-neutral-400 text-sm mb-2'>
                  &quot;জনতার দাবি&quot; ভোটিং ফিচারে অপব্যবহার রোধে আইপি ঠিকানা
                  সাময়িকভাবে সংরক্ষণ করা হয়। এটি শুধুমাত্র রেট লিমিটিং এর জন্য
                  এবং ১ ঘন্টা পর স্বয়ংক্রিয়ভাবে মুছে যায়।
                </p>
                <p className='text-neutral-500 text-xs'>
                  IP addresses are temporarily stored to prevent abuse in the
                  &quot;Janatar Dabi&quot; voting feature. This is only for rate
                  limiting and is automatically deleted after 1 hour.
                </p>
              </div>

              <div className='p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]'>
                <h3 className='font-semibold text-white mb-2'>
                  ২. ভোট (বেনামে)
                </h3>
                <p className='text-neutral-400 text-sm mb-2'>
                  আপনি যখন &quot;জনতার দাবি&quot;তে ভোট দেন, শুধুমাত্র ভোটের
                  সংখ্যা সংরক্ষণ করা হয়। কে ভোট দিয়েছে তা আমরা জানি না এবং
                  জানার কোনো উপায় নেই।
                </p>
                <p className='text-neutral-500 text-xs'>
                  When you vote in &quot;Janatar Dabi&quot;, only the vote count
                  is stored. We don&apos;t know and cannot identify who voted.
                </p>
              </div>
            </div>
          </section>

          {/* What We DON'T Collect */}
          <section>
            <h2 className='text-xl font-bold text-white mb-4'>
              🚫 আমরা কী সংগ্রহ করি না | What We DON&apos;T Collect
            </h2>
            <ul className='space-y-3'>
              <li className='flex items-start gap-3 text-neutral-300'>
                <span className='text-red-400 mt-1'>✗</span>
                নাম, ইমেইল, ফোন নম্বর (Name, email, phone number)
              </li>
              <li className='flex items-start gap-3 text-neutral-300'>
                <span className='text-red-400 mt-1'>✗</span>
                অবস্থান তথ্য (Location data)
              </li>
              <li className='flex items-start gap-3 text-neutral-300'>
                <span className='text-red-400 mt-1'>✗</span>
                ব্রাউজিং হিস্টরি (Browsing history)
              </li>
              <li className='flex items-start gap-3 text-neutral-300'>
                <span className='text-red-400 mt-1'>✗</span>
                ডিভাইস আইডেন্টিফায়ার (Device identifiers)
              </li>
              <li className='flex items-start gap-3 text-neutral-300'>
                <span className='text-red-400 mt-1'>✗</span>
                সোশ্যাল মিডিয়া তথ্য (Social media data)
              </li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className='text-xl font-bold text-white mb-4'>
              🍪 কুকি | Cookies
            </h2>
            <div className='p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]'>
              <p className='text-neutral-300 mb-2'>
                এই অ্যাপ{' '}
                <strong className='text-white'>কোনো কুকি ব্যবহার করে না</strong>
                ।
              </p>
              <p className='text-neutral-500 text-sm'>
                This app does{' '}
                <strong className='text-neutral-300'>
                  not use any cookies
                </strong>
                . No tracking cookies, no analytics cookies, no advertising
                cookies.
              </p>
            </div>
          </section>

          {/* Third Party Services */}
          <section>
            <h2 className='text-xl font-bold text-white mb-4'>
              🔗 তৃতীয় পক্ষের সেবা | Third Party Services
            </h2>
            <div className='space-y-4'>
              <div className='p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]'>
                <h3 className='font-semibold text-white mb-2'>OpenStreetMap</h3>
                <p className='text-neutral-400 text-sm'>
                  মানচিত্র প্রদর্শনের জন্য আমরা OpenStreetMap টাইলস ব্যবহার করি।
                  <a
                    href='https://wiki.openstreetmap.org/wiki/Privacy_Policy'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-teal-400 hover:text-teal-300 ml-1'
                  >
                    তাদের গোপনীয়তা নীতি দেখুন
                  </a>
                </p>
              </div>

              <div className='p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]'>
                <h3 className='font-semibold text-white mb-2'>Cloudflare</h3>
                <p className='text-neutral-400 text-sm'>
                  সাইটের নিরাপত্তা ও গতির জন্য Cloudflare ব্যবহৃত হয়।
                  <a
                    href='https://www.cloudflare.com/privacypolicy/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-teal-400 hover:text-teal-300 ml-1'
                  >
                    তাদের গোপনীয়তা নীতি দেখুন
                  </a>
                </p>
              </div>

              <div className='p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]'>
                <h3 className='font-semibold text-white mb-2'>Railway</h3>
                <p className='text-neutral-400 text-sm'>
                  অ্যাপ হোস্টিং এর জন্য Railway ব্যবহৃত হয়।
                  <a
                    href='https://railway.app/legal/privacy'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-teal-400 hover:text-teal-300 ml-1'
                  >
                    তাদের গোপনীয়তা নীতি দেখুন
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className='text-xl font-bold text-white mb-4'>
              ⏱️ তথ্য সংরক্ষণ সময় | Data Retention
            </h2>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-white/10'>
                    <th className='text-left py-3 text-neutral-400 font-medium'>
                      তথ্যের ধরন
                    </th>
                    <th className='text-left py-3 text-neutral-400 font-medium'>
                      সংরক্ষণ সময়
                    </th>
                  </tr>
                </thead>
                <tbody className='text-neutral-300'>
                  <tr className='border-b border-white/5'>
                    <td className='py-3'>IP ঠিকানা (রেট লিমিট)</td>
                    <td className='py-3'>১ ঘন্টা</td>
                  </tr>
                  <tr className='border-b border-white/5'>
                    <td className='py-3'>ভোট গণনা</td>
                    <td className='py-3'>অনির্দিষ্টকাল (বেনামে)</td>
                  </tr>
                  <tr>
                    <td className='py-3'>ব্যক্তিগত তথ্য</td>
                    <td className='py-3 text-emerald-400'>সংগ্রহ করা হয় না</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className='text-xl font-bold text-white mb-4'>
              ⚖️ আপনার অধিকার | Your Rights
            </h2>
            <p className='text-neutral-300 mb-4'>
              যেহেতু আমরা কোনো ব্যক্তিগত তথ্য সংগ্রহ করি না, তাই কোনো তথ্য মুছে
              ফেলার বা পরিবর্তন করার প্রয়োজন নেই। আপনি যেকোনো সময় এই অ্যাপ
              ব্যবহার করতে পারেন অথবা বন্ধ করতে পারেন।
            </p>
            <p className='text-neutral-500 text-sm'>
              Since we don&apos;t collect any personal data, there&apos;s no
              data to delete or modify. You can use or stop using this app at
              any time.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className='text-xl font-bold text-white mb-4'>
              👶 শিশুদের গোপনীয়তা | Children&apos;s Privacy
            </h2>
            <p className='text-neutral-400 text-sm'>
              এই অ্যাপ সকল বয়সের জন্য উপযুক্ত এবং কোনো ব্যক্তিগত তথ্য সংগ্রহ
              করে না। This app is suitable for all ages and does not collect any
              personal information.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className='text-xl font-bold text-white mb-4'>
              📝 নীতি পরিবর্তন | Changes to This Policy
            </h2>
            <p className='text-neutral-400 text-sm'>
              এই গোপনীয়তা নীতি পরিবর্তন হলে আমরা এই পৃষ্ঠায় আপডেট করব এবং
              তারিখ পরিবর্তন করব। If this privacy policy changes, we will update
              this page and change the date.
            </p>
          </section>

          {/* Open Source */}
          <section className='p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]'>
            <h2 className='text-xl font-bold text-white mb-4 flex items-center gap-3'>
              <span className='text-2xl'>💻</span>
              ওপেন সোর্স | Open Source
            </h2>
            <p className='text-neutral-300 mb-3'>
              এই প্রকল্পটি সম্পূর্ণ ওপেন সোর্স। আপনি আমাদের কোড দেখতে এবং যাচাই
              করতে পারেন যে আমরা কী তথ্য সংগ্রহ করি এবং কীভাবে ব্যবহার করি।
            </p>
            <p className='text-neutral-500 text-sm'>
              This project is completely open source. You can view and verify
              our code to see exactly what data we collect and how we use it.
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className='mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-4 justify-center'>
          <Link
            href='/terms'
            className='text-neutral-400 hover:text-white text-sm'
          >
            ব্যবহারের শর্তাবলী | Terms of Service
          </Link>
          <span className='text-neutral-700'>•</span>
          <Link href='/' className='text-neutral-400 hover:text-white text-sm'>
            মানচিত্রে ফিরুন | Back to Map
          </Link>
        </div>

        <p className='text-center text-neutral-600 text-xs mt-8'>
          সর্বশেষ আপডেট: ডিসেম্বর ২০২৫ | Last updated: December 2025
        </p>
      </main>
    </div>
  );
}
