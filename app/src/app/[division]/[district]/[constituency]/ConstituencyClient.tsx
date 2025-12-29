'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { formatNumberBn } from '@/lib/utils';
import { useConstituencyData } from '@/hooks/useConstituencyData';

import { CandidateCard, InfraStatCard } from '@/components/constituency';
import { JanatarDabi } from '@/components/janatar-dabi';
import { AreaVideos } from '@/components/meme-pulse';
import { ParallaxBackground } from '@/components/ui/ParallaxBackground';
import { ParliamentIllustration } from '@/components/ui/ParliamentIllustration';

function LoadingSpinner() {
  return (
    <div className='min-h-screen bg-[#0c0c0c] flex items-center justify-center'>
      <div className='w-12 h-12 border-4 border-teal-600/30 border-t-teal-500 rounded-full animate-spin' />
    </div>
  );
}

function NotFound() {
  return (
    <div className='min-h-screen bg-[#0c0c0c] flex items-center justify-center'>
      <div className='text-center'>
        <p className='text-neutral-400 mb-4'>নির্বাচনী এলাকা পাওয়া যায়নি</p>
        <Link href='/' className='text-teal-400 hover:underline'>
          মানচিত্রে ফিরুন
        </Link>
      </div>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
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
    </button>
  );
}

export default function ConstituencyClient() {
  const params = useParams();
  const router = useRouter();

  const divisionSlug = params.division as string;
  const districtSlug = params.district as string;
  const constituencySlug = params.constituency as string;

  const { population, infrastructure, candidates, loading } =
    useConstituencyData({
      divisionSlug,
      districtSlug,
      constituencySlug,
    });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!population) {
    return <NotFound />;
  }

  const voters = population.registered_voters || 400000;
  const constituencyId = population.id;

  return (
    <div className='min-h-screen bg-[#0c0c0c] relative overflow-hidden'>
      <ParallaxBackground />

      <header className='sticky top-0 z-50 bg-[#0c0c0c]/90 backdrop-blur-xl border-b border-white/[0.04]'>
        <div className='max-w-5xl mx-auto px-4 py-3 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <BackButton onClick={() => router.back()} />
            <Link
              href='/'
              className='text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors'
            >
              জনতার নির্বাচন ২০২৬
            </Link>
          </div>
          <span className='text-sm text-neutral-400 truncate max-w-[150px] md:max-w-none'>
            {population.name_english}
          </span>
        </div>
      </header>

      <main className='relative z-10'>
        {/* Hero Section */}
        <section className='min-h-[60vh] flex flex-col justify-center px-4 py-8 md:py-12'>
          <div className='max-w-5xl mx-auto w-full'>
            <div className='grid md:grid-cols-2 gap-8 md:gap-12 items-center'>
              <div className='text-center md:text-left'>
                <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 leading-tight'>
                  {population.name_english}
                </h1>
                <p className='text-xl md:text-2xl text-neutral-400 mb-6'>
                  {population.name}
                </p>

                <div className='flex flex-wrap gap-2 justify-center md:justify-start mb-8'>
                  <span className='px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-neutral-300'>
                    {population.district_english}
                  </span>
                  <span className='px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-neutral-300'>
                    {population.division_english}
                  </span>
                </div>

                <div className='p-6 rounded-2xl bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/20'>
                  <div className='text-5xl md:text-6xl lg:text-7xl font-black text-white mb-1'>
                    {formatNumberBn(voters)}
                  </div>
                  <div className='text-lg text-teal-400 font-medium'>
                    নিবন্ধিত ভোটার
                  </div>
                  <p className='text-sm text-neutral-500 mt-2'>
                    আপনি {formatNumberBn(voters)} ভোটারের একজন যারা পরবর্তী এমপি
                    নির্বাচন করবেন
                  </p>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div className='p-4 rounded-xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] hover:border-white/[0.12] transition-all'>
                  <div className='text-3xl font-bold text-rose-400'>
                    {candidates.length || '—'}
                  </div>
                  <div className='text-sm text-neutral-400'>প্রার্থী</div>
                </div>
                <div className='p-4 rounded-xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] hover:border-white/[0.12] transition-all'>
                  <div className='text-3xl font-bold text-emerald-400'>
                    {infrastructure?.schools || '—'}
                  </div>
                  <div className='text-sm text-neutral-400'>বিদ্যালয়</div>
                </div>
                <div className='p-4 rounded-xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] hover:border-white/[0.12] transition-all'>
                  <div className='text-3xl font-bold text-sky-400'>
                    {(infrastructure?.hospitals || 0) +
                      (infrastructure?.clinics || 0) || '—'}
                  </div>
                  <div className='text-sm text-neutral-400'>
                    স্বাস্থ্য সুবিধা
                  </div>
                </div>
                <div className='p-4 rounded-xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] hover:border-white/[0.12] transition-all'>
                  <div className='text-3xl font-bold text-amber-400'>
                    {infrastructure?.markets || '—'}
                  </div>
                  <div className='text-sm text-neutral-400'>বাজার</div>
                </div>
                <div className='col-span-2 flex items-center justify-center py-4 opacity-15'>
                  <ParliamentIllustration className='w-full max-w-xs h-auto text-white' />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* জনতার দাবি Section */}
        <section className='py-12 px-4 border-t border-white/5'>
          <div className='max-w-5xl mx-auto'>
            <JanatarDabi
              constituencyId={constituencyId}
              constituencyName={
                population?.name_english || `Constituency ${constituencyId}`
              }
              constituencyNameBn={population?.name}
            />
          </div>
        </section>

        {/* Candidates Section */}
        <section className='py-12 px-4 border-t border-white/5'>
          <div className='max-w-5xl mx-auto'>
            <div className='flex items-center justify-between mb-8'>
              <div>
                <h2 className='text-2xl md:text-3xl font-bold text-white'>
                  প্রার্থী
                </h2>
                <p className='text-neutral-500 mt-1'>
                  এই নির্বাচনী এলাকায় কারা এমপি পদপ্রার্থী
                </p>
              </div>
              {candidates.length > 0 && (
                <span className='px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-sm font-medium backdrop-blur-sm'>
                  {candidates.length} জন প্রার্থী
                </span>
              )}
            </div>

            {candidates.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {candidates.map((candidate, idx) => (
                  <CandidateCard key={idx} candidate={candidate} />
                ))}
              </div>
            ) : (
              <EmptyCandidates />
            )}
          </div>
        </section>

        {/* Area Videos Section */}
        <section className='py-12 px-4 border-t border-white/5'>
          <div className='max-w-5xl mx-auto'>
            <AreaVideos
              districtName={population?.district_english || 'District'}
            />
          </div>
        </section>

        {/* Infrastructure Section */}
        <section className='py-12 px-4 border-t border-white/5'>
          <div className='max-w-5xl mx-auto'>
            <div className='flex items-center justify-between mb-8'>
              <div>
                <h2 className='text-2xl md:text-3xl font-bold text-white'>
                  স্থানীয় অবকাঠামো
                </h2>
                <p className='text-neutral-500 mt-1'>OpenStreetMap থেকে তথ্য</p>
              </div>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3'>
              <InfraStatCard
                icon='🏫'
                value={infrastructure?.schools || 0}
                label='বিদ্যালয়'
                color='emerald'
              />
              <InfraStatCard
                icon='🏥'
                value={infrastructure?.hospitals || 0}
                label='হাসপাতাল'
                color='rose'
              />
              <InfraStatCard
                icon='🏪'
                value={infrastructure?.clinics || 0}
                label='ক্লিনিক'
                color='sky'
              />
              <InfraStatCard
                icon='🏦'
                value={infrastructure?.banks || 0}
                label='ব্যাংক'
                color='amber'
              />
              <InfraStatCard
                icon='🛒'
                value={infrastructure?.markets || 0}
                label='বাজার'
                color='purple'
              />
              <InfraStatCard
                icon='🕌'
                value={infrastructure?.mosques || 0}
                label='মসজিদ'
                color='teal'
              />
            </div>

            <div className='mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/5'>
              <p className='text-sm text-neutral-400'>
                <span className='text-white font-medium'>
                  প্রতি 10,000 ভোটারে:
                </span>{' '}
                {infrastructure?.schools
                  ? ((infrastructure.schools / voters) * 10000).toFixed(1)
                  : '—'}{' '}
                বিদ্যালয়,{' '}
                {infrastructure?.hospitals || infrastructure?.clinics
                  ? (
                      (((infrastructure.hospitals || 0) +
                        (infrastructure.clinics || 0)) /
                        voters) *
                      10000
                    ).toFixed(1)
                  : '—'}{' '}
                স্বাস্থ্য সুবিধা
              </p>
            </div>
          </div>
        </section>

        {/* MP Info Section */}
        <section className='py-12 px-4 border-t border-white/5'>
          <div className='max-w-5xl mx-auto'>
            <details className='group'>
              <summary className='flex items-center justify-between cursor-pointer list-none'>
                <div>
                  <h2 className='text-2xl md:text-3xl font-bold text-white'>
                    একজন এমপি কী করতে পারেন?
                  </h2>
                  <p className='text-neutral-500 mt-1'>
                    আপনার প্রতিনিধির ক্ষমতা সম্পর্কে জানুন
                  </p>
                </div>
                <span className='text-neutral-500 group-open:rotate-180 transition-transform'>
                  <svg
                    className='w-6 h-6'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                </span>
              </summary>

              <div className='mt-8 grid md:grid-cols-3 gap-4'>
                <div className='p-5 rounded-xl bg-teal-500/5 border border-teal-500/10'>
                  <div className='text-2xl mb-2'>🗣️</div>
                  <h3 className='text-white font-semibold mb-1'>
                    আপনার প্রতিনিধিত্ব
                  </h3>
                  <p className='text-neutral-400 text-sm'>
                    এমপিরা সংসদে আপনার পক্ষে কথা বলেন এবং স্থানীয় প্রয়োজনের
                    পক্ষে সওয়াল করেন।
                  </p>
                </div>
                <div className='p-5 rounded-xl bg-amber-500/5 border border-amber-500/10'>
                  <div className='text-2xl mb-2'>💰</div>
                  <h3 className='text-white font-semibold mb-1'>
                    বাজেটে প্রভাব
                  </h3>
                  <p className='text-neutral-400 text-sm'>
                    প্রতি নির্বাচনী এলাকায় উন্নয়ন তহবিল বরাদ্দ হয়। এমপিরা
                    ব্যয়ের অগ্রাধিকার নির্ধারণে প্রভাব রাখেন।
                  </p>
                </div>
                <div className='p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/10'>
                  <div className='text-2xl mb-2'>🏗️</div>
                  <h3 className='text-white font-semibold mb-1'>প্রকল্প আনা</h3>
                  <p className='text-neutral-400 text-sm'>
                    রাস্তা, স্কুল, হাসপাতাল, বিদ্যুৎ - এমপিরা অবকাঠামো প্রকল্প
                    আনতে পারেন।
                  </p>
                </div>
              </div>

              <div className='mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/5'>
                <p className='text-sm text-neutral-400'>
                  <span className='text-teal-400 font-medium'>বিঃদ্রঃ</span>{' '}
                  এমপিরা 5 বছরের মেয়াদে কাজ করেন। আপনার ভোট এই নির্বাচনী এলাকার
                  দীর্ঘমেয়াদী উন্নয়নে প্রভাব ফেলে।
                </p>
              </div>
            </details>
          </div>
        </section>

        {/* Footer */}
        <footer className='py-8 px-4 border-t border-white/5 pb-16'>
          <div className='max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4'>
            <Link
              href='/'
              className='inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white rounded-lg transition-colors text-sm'
            >
              <svg
                className='w-4 h-4'
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
              মানচিত্রে ফিরুন
            </Link>
            <p className='text-xs text-neutral-600'>
              অবকাঠামো তথ্য OpenStreetMap অবদানকারীদের থেকে
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

function EmptyCandidates() {
  return (
    <div className='text-center py-16 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-dashed border-white/10'>
      <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-white/[0.03] flex items-center justify-center'>
        <svg
          className='w-8 h-8 text-neutral-600'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
          />
        </svg>
      </div>
      <p className='text-neutral-400 font-medium'>
        প্রার্থীদের তথ্য শীঘ্রই আসছে
      </p>
      <p className='text-neutral-600 text-sm mt-1'>আপডেটের জন্য পরে দেখুন</p>
    </div>
  );
}
