interface IconProps {
  className?: string;
}

export function CloseIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg
      className={className}
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M6 18L18 6M6 6l12 12'
      />
    </svg>
  );
}

export function SearchIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg
      className={className}
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
      />
    </svg>
  );
}

export function MenuIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg
      className={className}
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M4 6h16M4 12h16M4 18h16'
      />
    </svg>
  );
}

export function ChevronLeftIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg
      className={className}
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
  );
}

export function ChevronRightIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      className={className}
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M9 5l7 7-7 7'
      />
    </svg>
  );
}
