import { supabase } from './supabase';
import {
  getPendingOperations,
  notifySyncStatus,
  QueuedOperation,
  updateOperation,
} from './offline-db';
import { markOperationRecordsSynced } from './offline-records';

const SYNC_INTERVAL_MS = 30_000;
let syncing = false;
let intervalId: number | null = null;
let syncEngineClients = 0;

function retryDelay(attempts: number) {
  const exponential = Math.min(5 * 60_000, 2 ** Math.min(attempts, 8) * 1_000);
  return exponential + Math.floor(Math.random() * 1_000);
}

async function processOperation(operation: QueuedOperation) {
  await updateOperation(operation.id, {
    status: 'syncing',
    error: undefined,
  });

  const rpcName =
    operation.operationType === 'cash_sale'
      ? 'process_offline_sale'
      : operation.operationType === 'return_create'
        ? 'process_offline_return'
        : 'process_offline_expense';
  const { data, error } = await supabase.rpc(rpcName, {
    p_operation_id: operation.id,
    p_payload: operation.payload,
  });

  if (error) throw error;

  await markOperationRecordsSynced(operation);
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
          error:
            error instanceof Error
              ? error.message
              : (error as any)?.message || 'Synchronization failed',
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
  syncEngineClients += 1;
  if (intervalId !== null) {
    return () => {
      syncEngineClients = Math.max(0, syncEngineClients - 1);
    };
  }

  const syncNow = () => void synchronizePendingOperations(true);
  const syncScheduled = () => void synchronizePendingOperations();
  window.addEventListener('online', syncNow);
  window.addEventListener('focus', syncNow);
  document.addEventListener('visibilitychange', syncNow);
  intervalId = window.setInterval(syncScheduled, SYNC_INTERVAL_MS);
  syncNow();

  return () => {
    syncEngineClients = Math.max(0, syncEngineClients - 1);
    if (syncEngineClients > 0) return;
    window.removeEventListener('online', syncNow);
    window.removeEventListener('focus', syncNow);
    document.removeEventListener('visibilitychange', syncNow);
    if (intervalId !== null) window.clearInterval(intervalId);
    intervalId = null;
  };
}
