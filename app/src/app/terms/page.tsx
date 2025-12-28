'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#0c0c0c]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(13, 148, 136, 0.15) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0c0c0c]/90 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">মানচিত্রে ফিরুন</span>
          </Link>
          <span className="text-sm text-neutral-400">Terms of Service</span>
          <div className="w-20" />
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-12 pb-24">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          ব্যবহারের শর্তাবলী
        </h1>
        <p className="text-xl text-neutral-400 mb-12">Terms of Service</p>

        <div className="prose prose-invert prose-neutral max-w-none space-y-8">
          {/* Mission Section */}
          <section className="p-6 rounded-2xl bg-teal-500/5 border border-teal-500/20">
            <h2 className="text-2xl font-bold text-teal-400 mb-4 flex items-center gap-3">
              <span className="text-3xl">🇧🇩</span>
              আমাদের উদ্দেশ্য | Our Mission
            </h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              এই প্রকল্পটি বাংলাদেশের নাগরিকদের জন্য একটি <strong className="text-white">শিক্ষামূলক ও তথ্যমূলক</strong> উদ্যোগ।
              আমরা বিশ্বাস করি যে গণতন্ত্রের ভিত্তি হলো সচেতন ভোটার। এই অ্যাপের মাধ্যমে আমরা নির্বাচনী তথ্য
              সহজবোধ্য ও দৃশ্যমান উপায়ে উপস্থাপন করতে চাই।
            </p>
            <p className="text-neutral-400 leading-relaxed">
              This is an <strong className="text-neutral-200">educational and informational</strong> project for the citizens of Bangladesh.
              We believe that informed voters are the foundation of democracy. Through this app, we aim to present
              election data in an accessible and visual format.
            </p>
          </section>

          {/* Data Source */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">📊 তথ্যের উৎস | Data Source</h2>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-neutral-300 mb-3">
                এই অ্যাপে প্রদর্শিত সকল তথ্য <strong className="text-white">বাংলাদেশ নির্বাচন কমিশন</strong> থেকে
                সংগ্রহ করা হয়েছে। আমরা কোনো তথ্য নিজেরা তৈরি করি না।
              </p>
              <p className="text-neutral-400 text-sm">
                All data displayed in this app is sourced from the <strong className="text-neutral-200">Bangladesh Election Commission</strong>.
                We do not create or modify any election data.
              </p>
              <a
                href="https://www.ecs.gov.bd"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-teal-400 hover:text-teal-300 text-sm"
              >
                বাংলাদেশ নির্বাচন কমিশন ওয়েবসাইট দেখুন
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </section>

          {/* What This App Does */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">✅ এই অ্যাপ কী করে | What This App Does</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-neutral-300">
                <span className="text-teal-400 mt-1">•</span>
                নির্বাচন কমিশনের প্রকাশিত তথ্য সুন্দরভাবে উপস্থাপন করে (Presents EC data in a beautiful format)
              </li>
              <li className="flex items-start gap-3 text-neutral-300">
                <span className="text-teal-400 mt-1">•</span>
                ভোটার সংখ্যা ও নির্বাচনী এলাকার পরিসংখ্যান দেখায় (Shows voter statistics and constituency data)
              </li>
              <li className="flex items-start gap-3 text-neutral-300">
                <span className="text-teal-400 mt-1">•</span>
                মানচিত্রে নির্বাচনী এলাকা চিহ্নিত করে (Displays constituencies on an interactive map)
              </li>
              <li className="flex items-start gap-3 text-neutral-300">
                <span className="text-teal-400 mt-1">•</span>
                &quot;জনতার দাবি&quot; ফিচারে এলাকার সমস্যা সম্পর্কে মতামত সংগ্রহ করে (Collects opinions on local issues)
              </li>
            </ul>
          </section>

          {/* What This App Does NOT Do */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">❌ এই অ্যাপ কী করে না | What This App Does NOT Do</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-neutral-300">
                <span className="text-red-400 mt-1">•</span>
                সরকারি ভোট গ্রহণ করে না (Does NOT conduct official voting)
              </li>
              <li className="flex items-start gap-3 text-neutral-300">
                <span className="text-red-400 mt-1">•</span>
                নির্বাচন কমিশনের বিকল্প নয় (Is NOT a replacement for Election Commission)
              </li>
              <li className="flex items-start gap-3 text-neutral-300">
                <span className="text-red-400 mt-1">•</span>
                কোনো রাজনৈতিক দল বা প্রার্থীকে সমর্থন করে না (Does NOT endorse any party or candidate)
              </li>
              <li className="flex items-start gap-3 text-neutral-300">
                <span className="text-red-400 mt-1">•</span>
                ব্যক্তিগত তথ্য সংগ্রহ করে না (Does NOT collect personal information)
              </li>
            </ul>
          </section>

          {/* Janatar Dabi Disclaimer */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">🗳️ &quot;জনতার দাবি&quot; সম্পর্কে | About &quot;Janatar Dabi&quot;</h2>
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <p className="text-neutral-300 mb-3">
                &quot;জনতার দাবি&quot; ফিচারটি একটি <strong className="text-amber-400">অনানুষ্ঠানিক মতামত জরিপ</strong>।
                এটি সরকারি ভোট নয় এবং এর ফলাফল কোনো সরকারি সিদ্ধান্তে ব্যবহৃত হয় না।
              </p>
              <p className="text-neutral-400 text-sm">
                The &quot;Janatar Dabi&quot; feature is an <strong className="text-amber-300">informal opinion poll</strong>.
                It is not an official vote and results are not used in any government decisions.
              </p>
            </div>
          </section>

          {/* Inspiration */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">💡 অনুপ্রেরণা | Inspiration</h2>
            <p className="text-neutral-300 leading-relaxed">
              এই প্রকল্পটি বিভিন্ন আন্তর্জাতিক ডেটা ভিজ্যুয়ালাইজেশন প্রকল্প দ্বারা অনুপ্রাণিত, যেমন YouTube-এর
              পরিসংখ্যান ড্যাশবোর্ড, Google Trends, এবং বিভিন্ন নির্বাচনী তথ্য পোর্টাল। আমাদের লক্ষ্য হলো
              বাংলাদেশের নাগরিকদের জন্য একই মানের তথ্য সেবা প্রদান করা।
            </p>
          </section>

          {/* No Warranty */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">⚠️ দায়মুক্তি | Disclaimer</h2>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-neutral-400 text-sm leading-relaxed">
                এই অ্যাপ &quot;যেমন আছে&quot; ভিত্তিতে প্রদান করা হয়েছে। আমরা তথ্যের সম্পূর্ণতা বা নির্ভুলতার
                কোনো গ্যারান্টি দিই না। সর্বশেষ ও সঠিক তথ্যের জন্য অনুগ্রহ করে বাংলাদেশ নির্বাচন কমিশনের
                অফিসিয়াল ওয়েবসাইট দেখুন।
              </p>
              <p className="text-neutral-500 text-xs mt-3">
                This app is provided &quot;as is&quot; without any warranties. We do not guarantee the completeness
                or accuracy of information. For the latest and accurate data, please visit the official
                Bangladesh Election Commission website.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">📧 যোগাযোগ | Contact</h2>
            <p className="text-neutral-400">
              কোনো প্রশ্ন বা পরামর্শ থাকলে আমাদের সাথে যোগাযোগ করতে পারেন।
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-4 justify-center">
          <Link href="/privacy" className="text-neutral-400 hover:text-white text-sm">
            গোপনীয়তা নীতি | Privacy Policy
          </Link>
          <span className="text-neutral-700">•</span>
          <Link href="/" className="text-neutral-400 hover:text-white text-sm">
            মানচিত্রে ফিরুন | Back to Map
          </Link>
        </div>

        <p className="text-center text-neutral-600 text-xs mt-8">
          সর্বশেষ আপডেট: ডিসেম্বর ২০২৫ | Last updated: December 2025
        </p>
      </main>
    </div>
  );
}
