import { useCallback, useEffect, useState } from 'react';
import { getSyncCounts, OFFLINE_SYNC_EVENT } from '../lib/offline-db';
import {
  isSynchronizing,
  startSyncEngine,
  synchronizePendingOperations,
} from '../lib/sync-engine';

export function useSyncStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  const [pending, setPending] = useState(0);
  const [failed, setFailed] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const refresh = useCallback(async () => {
    setOnline(navigator.onLine);
    setSyncing(isSynchronizing());
    try {
      const counts = await getSyncCounts();
      setPending(counts.pending);
      setFailed(counts.failed);
    } catch {
      setPending(0);
      setFailed(0);
    }
  }, []);

  useEffect(() => {
    const stop = startSyncEngine();
    const handleChange = () => void refresh();
    window.addEventListener('online', handleChange);
    window.addEventListener('offline', handleChange);
    window.addEventListener(OFFLINE_SYNC_EVENT, handleChange);
    void refresh();

    return () => {
      stop();
      window.removeEventListener('online', handleChange);
      window.removeEventListener('offline', handleChange);
      window.removeEventListener(OFFLINE_SYNC_EVENT, handleChange);
    };
  }, [refresh]);

  return {
    online,
    pending,
    failed,
    syncing,
    retry: () => synchronizePendingOperations(true),
  };
}
