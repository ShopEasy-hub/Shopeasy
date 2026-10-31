import { supabase } from './supabase';
import {
  getPendingOperations,
  notifySyncStatus,
  QueuedOperation,
  updateOperation,
} from './offline-db';

const SYNC_INTERVAL_MS = 30_000;
let syncing = false;
let intervalId: number | null = null;

function retryDelay(attempts: number) {
  const exponential = Math.min(5 * 60_000, 2 ** Math.min(attempts, 8) * 1_000);
  return exponential + Math.floor(Math.random() * 1_000);
}

async function processOperation(operation: QueuedOperation) {
  await updateOperation(operation.id, {
    status: 'syncing',
    error: undefined,
  });

  const { data, error } = await supabase.rpc('process_offline_sale', {
    p_operation_id: operation.id,
    p_payload: operation.payload,
  });

  if (error) throw error;

  await updateOperation(operation.id, {
    status: 'synced',
    serverAcknowledgement: data,
    error: undefined,
  });
}

export async function synchronizePendingOperations(includeDelayed = false) {
  if (syncing || !navigator.onLine) return;
  syncing = true;
  notifySyncStatus();

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return;

    const operations = await getPendingOperations(20, includeDelayed);
    for (const operation of operations) {
      try {
        await processOperation(operation);
      } catch (error) {
        const attempts = operation.attempts + 1;
        await updateOperation(operation.id, {
          status: 'failed',
          attempts,
          error: error instanceof Error ? error.message : 'Synchronization failed',
          nextAttemptAt: new Date(Date.now() + retryDelay(attempts)).toISOString(),
        });

        if (!navigator.onLine) break;
      }
    }
  } finally {
    syncing = false;
    notifySyncStatus();
  }
}

export function isSynchronizing() {
  return syncing;
}

export function startSyncEngine() {
  if (intervalId !== null) return () => undefined;

  const sync = () => void synchronizePendingOperations();
  window.addEventListener('online', sync);
  window.addEventListener('focus', sync);
  document.addEventListener('visibilitychange', sync);
  intervalId = window.setInterval(sync, SYNC_INTERVAL_MS);
  sync();

  return () => {
    window.removeEventListener('online', sync);
    window.removeEventListener('focus', sync);
    document.removeEventListener('visibilitychange', sync);
    if (intervalId !== null) window.clearInterval(intervalId);
    intervalId = null;
  };
}
