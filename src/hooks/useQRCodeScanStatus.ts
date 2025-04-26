/// <reference types="vite/client" />

import { useEffect, useState, useRef } from 'react';

type ScanStatus = { scanned: boolean; handoffComplete: boolean; appReady?: boolean; amount?: number };

export const useQRCodeScanStatus = (sessionId: string, pollInterval = 2000) => {
  const [status, setStatus] = useState<ScanStatus>({ scanned: false, handoffComplete: false, appReady: false, amount: undefined });
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    let isMounted = true;
    const apiBase = import.meta.env.VITE_API_BASE_URL;
    const poll = async () => {
      try {
        const res = await fetch(`${apiBase}/status/${sessionId}`, {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        });
        if (!res.ok) {
          console.log('❌ Response not OK:', res.status);
          return;
        }
        const data: ScanStatus = await res.json();
        console.log('Scan status response:', data);
        if (isMounted) {
          setStatus(data);
          // Stop polling if appReady is true
          if (data.appReady) {
            if (pollingRef.current) {
              clearInterval(pollingRef.current);
              pollingRef.current = null;
            }
          }
        }
      } catch (e) {
        // Optionally handle error
      }
    };

    pollingRef.current = setInterval(poll, pollInterval);
    poll(); // Initial check

    return () => {
      isMounted = false;
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [sessionId, pollInterval]);

  return status;
};