'use client';

import Link from 'next/link';

import { CloseIcon, ExternalLinkIcon, WarningIcon } from '@/components/icons';

import {
  EXTERNAL_LINKS,
  SIDEBAR_STYLES,
  SIDEBAR_TEXT,
} from '@/constants/sidebar';

import FilterPanel from './FilterPanel';
import LegendPanel from './LegendPanel';
import StatsPanel from './StatsPanel';

import type { ConstituencyInfo } from '@/types/constituency';
import type { FilterState } from '@/types/map';

// =============================================================================
// Types
// =============================================================================

interface SidebarProps {
  filterState: FilterState;
  onFilterChange: (filters: FilterState) => void;
  selectedConstituency: ConstituencyInfo | null;
  onConstituencySelect: (constituency: ConstituencyInfo | null) => void;
}

// =============================================================================
// Sub-Components
// =============================================================================

function SidebarHeader() {
  return (
    <div className='px-5 pt-6 pb-5 border-b border-white/[0.04]'>
      <h1 className='text-xl font-bold text-teal-400 tracking-tight'>
        {SIDEBAR_TEXT.header.title}
      </h1>
      <p className='mt-1.5 text-sm text-neutral-400'>
        {SIDEBAR_TEXT.header.subtitle}
      </p>
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  accentColor: 'teal' | 'amber';
}

function SectionHeader({ title, accentColor }: SectionHeaderProps) {
  const gradientClass =
    accentColor === 'teal'
      ? 'from-teal-400 to-teal-600'
      : 'from-amber-400 to-amber-600';

  return (
    <div className='flex items-center gap-2 mb-4'>
      <div
        className={`w-1 h-4 bg-gradient-to-b ${gradientClass} rounded-full`}
      />
      <h3 className='text-xs font-semibold text-neutral-500 uppercase tracking-wider'>
        {title}
      </h3>
    </div>
  );
}

function Divider() {
  return <div className={SIDEBAR_STYLES.divider} />;
}

interface SelectedConstituencyCardProps {
  constituency: ConstituencyInfo;
  onClose: () => void;
}

function SelectedConstituencyCard({
  constituency,
  onClose,
}: SelectedConstituencyCardProps) {
  return (
    <>
      <div className={SIDEBAR_STYLES.section}>
        <div className='p-4 rounded-xl bg-teal-500/[0.06] border border-teal-500/20'>
          <div className='flex items-start justify-between'>
            <div className='min-w-0 flex-1'>
              <p className='text-sm font-semibold text-white/90 truncate'>
                {constituency.name || constituency.name_english}
              </p>
              <p className='text-xs text-neutral-500 mt-0.5'>
                {constituency.district || constituency.district_english}
              </p>
              <div className='flex items-center gap-3 mt-2'>
                <span className='text-xs text-teal-400'>
                  {constituency.registered_voters.toLocaleString('en-US')}{' '}
                  {SIDEBAR_TEXT.stats.voters}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className='p-1.5 text-neutral-600 hover:text-white hover:bg-white/5 rounded-lg transition-colors'
            >
              <CloseIcon className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>
      <Divider />
    </>
  );
}

function SidebarFooter() {
  return (
    <div className='shrink-0 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-white/[0.04] space-y-3'>
      <DisclaimerBadge />
      <FooterLinks />
      <p className='text-xs text-neutral-600 text-center'>
        {SIDEBAR_TEXT.footer.source}
      </p>
    </div>
  );
}

function DisclaimerBadge() {
  return (
    <div className='flex items-center justify-center gap-2 text-amber-400/80'>
      <WarningIcon className='w-4 h-4 shrink-0' />
      <span className='text-xs'>{SIDEBAR_TEXT.footer.disclaimer}</span>
    </div>
  );
}

function FooterLinks() {
  return (
    <div className='flex items-center justify-center gap-3 text-xs'>
      <Link
        href='/terms'
        className='text-neutral-500 hover:text-white transition-colors'
      >
        {SIDEBAR_TEXT.footer.terms}
      </Link>
      <span className='text-neutral-700'>•</span>
      <Link
        href='/privacy'
        className='text-neutral-500 hover:text-white transition-colors'
      >
        {SIDEBAR_TEXT.footer.privacy}
      </Link>
      <span className='text-neutral-700'>•</span>
      <a
        href={EXTERNAL_LINKS.electionCommission}
        target='_blank'
        rel='noopener noreferrer'
        className='text-neutral-500 hover:text-white transition-colors inline-flex items-center gap-1'
      >
        EC
        <ExternalLinkIcon />
      </a>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export default function Sidebar({
  filterState,
  onFilterChange,
  selectedConstituency,
  onConstituencySelect,
}: SidebarProps) {
  return (
    <div className='relative flex h-full w-80 flex-col overflow-hidden bg-[#0c0c0c]'>
      {/* Subtle glow edge connecting sidebar to map */}
      <div className='absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-teal-500/30 via-transparent to-amber-500/20 z-10' />

      <SidebarHeader />

      {/* Scrollable content */}
      <div className='flex-1 overflow-y-auto'>
        {/* Filters Section */}
        <div className={SIDEBAR_STYLES.section}>
          <SectionHeader
            title={SIDEBAR_TEXT.sections.regionFilter}
            accentColor='teal'
          />
          <FilterPanel
            value={filterState}
            onChange={onFilterChange}
            onConstituencySelect={onConstituencySelect}
            selectedConstituency={selectedConstituency}
          />
        </div>

        <Divider />

        {/* Selected Constituency */}
        {selectedConstituency && (
          <SelectedConstituencyCard
            constituency={selectedConstituency}
            onClose={() => onConstituencySelect(null)}
          />
        )}

        {/* Stats Section */}
        <div className={SIDEBAR_STYLES.section}>
          <SectionHeader
            title={SIDEBAR_TEXT.sections.statistics}
            accentColor='amber'
          />
          <StatsPanel filterState={filterState} />
        </div>

        <Divider />

        {/* Legend Section */}
        <div className={SIDEBAR_STYLES.section}>
          <LegendPanel />
        </div>
      </div>

      <SidebarFooter />
    </div>
  );
}
