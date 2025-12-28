'use client';

import type { ReactNode } from 'react';

import { ConstituencyDataProvider } from '@/contexts/ConstituencyDataContext';

export default function Providers({ children }: { children: ReactNode }) {
  return <ConstituencyDataProvider>{children}</ConstituencyDataProvider>;
}
