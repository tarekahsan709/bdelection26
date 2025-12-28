'use client';

import type { ReactNode } from 'react';

import OfflineIndicator from '@/components/ui/OfflineIndicator';

import { ConstituencyDataProvider } from '@/contexts/ConstituencyDataContext';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ConstituencyDataProvider>
      <OfflineIndicator />
      {children}
    </ConstituencyDataProvider>
  );
}
