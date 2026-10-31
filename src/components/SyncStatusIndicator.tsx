import { AlertCircle, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useSyncStatus } from '../hooks/useSyncStatus';

export function SyncStatusIndicator() {
  const { online, pending, failed, syncing, retry } = useSyncStatus();

  if (!online) {
    return (
      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
        <CloudOff />
        Offline — {pending > 0 ? `${pending} saved locally` : 'local mode'}
      </Badge>
    );
  }

  if (syncing) {
    return (
      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
        <RefreshCw className="animate-spin" />
        Syncing {pending > 0 ? pending : ''}
      </Badge>
    );
  }

  if (failed > 0) {
    return (
      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => void retry()}>
        <AlertCircle />
        Sync error — retry
      </Button>
    );
  }

  if (pending > 0) {
    return (
      <Button variant="ghost" size="sm" className="text-warning" onClick={() => void retry()}>
        <RefreshCw />
        Sync pending — {pending}
      </Button>
    );
  }

  return (
    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
      <Cloud />
      Online — Synced
    </Badge>
  );
}
