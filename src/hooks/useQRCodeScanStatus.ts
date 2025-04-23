import { useEffect, useState } from 'react';

type ScanStatus = { scanned: boolean };

export const useQRCodeScanStatus = (sessionId: string, pollInterval = 2000) => {
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    let isMounted = true;
    const poll = async () => {
      try {
        const res = await fetch(`https://a746-136-24-91-134.ngrok-free.app/status/${sessionId}`);
        if (!res.ok) return;
        const data: ScanStatus = await res.json();
        if (isMounted && data.scanned) setScanned(true);
      } catch (e) {
        // Optionally handle error
      }
    };

    const interval = setInterval(poll, pollInterval);
    poll(); // Initial check

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [sessionId, pollInterval]);

  return scanned;
}; 