'use client';

import { useEffect, useState } from 'react';

type ConnectionType = 'slow' | 'fast' | 'offline' | 'unknown';

interface NetworkStatus {
  isOnline: boolean;
  connectionType: ConnectionType;
  isSlowConnection: boolean;
  effectiveType: string | null;
}

interface NetworkInformation extends EventTarget {
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  downlink: number;
  rtt: number;
  saveData: boolean;
}

declare global {
  interface Navigator {
    connection?: NetworkInformation;
  }
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: true,
    connectionType: 'unknown',
    isSlowConnection: false,
    effectiveType: null,
  });

  useEffect(() => {
    const updateStatus = () => {
      const isOnline = navigator.onLine;
      const connection = navigator.connection;

      let connectionType: ConnectionType = 'unknown';
      let isSlowConnection = false;
      let effectiveType: string | null = null;

      if (!isOnline) {
        connectionType = 'offline';
      } else if (connection) {
        effectiveType = connection.effectiveType;
        const isSlow =
          connection.effectiveType === 'slow-2g' ||
          connection.effectiveType === '2g' ||
          connection.saveData ||
          connection.rtt > 500 ||
          connection.downlink < 1;

        connectionType = isSlow ? 'slow' : 'fast';
        isSlowConnection = isSlow;
      }

      setStatus({
        isOnline,
        connectionType,
        isSlowConnection,
        effectiveType,
      });
    };

    updateStatus();

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    const connection = navigator.connection;
    if (connection) {
      connection.addEventListener('change', updateStatus);
    }

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      if (connection) {
        connection.removeEventListener('change', updateStatus);
      }
    };
  }, []);

  return status;
}
