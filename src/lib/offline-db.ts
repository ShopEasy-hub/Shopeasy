export const OFFLINE_DB_NAME = 'shopspot-offline';
export const OFFLINE_DB_VERSION = 1;

export type SyncOperationStatus = 'pending' | 'syncing' | 'failed' | 'synced';

export interface OfflineSaleItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  discount: number;
}

export interface OfflineSalePayload {
  transactionId: string;
  receiptNumber: string;
  orgId: string;
  branchId: string;
  userId: string;
  deviceId: string;
  customer: string;
  customerPhone?: string;
  customerBirthDate?: string;
  items: OfflineSaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'cash';
  amountPaid: number;
  change: number;
  pricingVersion: string;
  createdAt: string;
}

export interface QueuedOperation {
  id: string;
  organizationId: string;
  branchId: string;
  deviceId: string;
  userId: string;
  operationType: 'cash_sale';
  recordId: string;
  payload: OfflineSalePayload;
  createdAt: string;
  status: SyncOperationStatus;
  attempts: number;
  nextAttemptAt: string;
  serverAcknowledgement?: unknown;
  error?: string;
}

export interface CachedInventory {
  id: string;
  organizationId: string;
  branchId: string;
  productId: string;
  quantity: number;
  syncedAt: string;
}

export interface CachedCatalog {
  id: string;
  organizationId: string;
  branchId: string;
  products: any[];
  syncedAt: string;
}

export interface OfflineAppSnapshot {
  id: 'current';
  appState: Record<string, unknown>;
  cachedAt: string;
}

export const OFFLINE_SYNC_EVENT = 'shopspot:sync-status';

let dbPromise: Promise<IDBDatabase> | null = null;

export function openOfflineDb(): Promise<IDBDatabase> {
  if (!('indexedDB' in window)) {
    return Promise.reject(new Error('This browser does not support offline storage.'));
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(OFFLINE_DB_NAME, OFFLINE_DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains('catalogs')) {
        const store = db.createObjectStore('catalogs', { keyPath: 'id' });
        store.createIndex('organizationBranch', ['organizationId', 'branchId'], { unique: true });
      }

      if (!db.objectStoreNames.contains('inventory')) {
        const store = db.createObjectStore('inventory', { keyPath: 'id' });
        store.createIndex('organizationBranch', ['organizationId', 'branchId']);
        store.createIndex('product', 'productId');
      }

      if (!db.objectStoreNames.contains('sales')) {
        const store = db.createObjectStore('sales', { keyPath: 'transactionId' });
        store.createIndex('organizationBranch', ['orgId', 'branchId']);
        store.createIndex('createdAt', 'createdAt');
      }

      if (!db.objectStoreNames.contains('operations')) {
        const store = db.createObjectStore('operations', { keyPath: 'id' });
        store.createIndex('status', 'status');
        store.createIndex('nextAttemptAt', 'nextAttemptAt');
        store.createIndex('organizationBranch', ['organizationId', 'branchId']);
      }

      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('appSnapshot')) {
        db.createObjectStore('appSnapshot', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      dbPromise = null;
      reject(request.error || new Error('Unable to open offline storage.'));
    };
  });

  return dbPromise;
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveCatalog(
  organizationId: string,
  branchId: string,
  products: any[],
  inventory: Array<{ productId: string; quantity: number }>,
) {
  const db = await openOfflineDb();
  const transaction = db.transaction(['catalogs', 'inventory'], 'readwrite');
  const syncedAt = new Date().toISOString();
  const catalog: CachedCatalog = {
    id: `${organizationId}:${branchId}`,
    organizationId,
    branchId,
    products,
    syncedAt,
  };

  transaction.objectStore('catalogs').put(catalog);
  const inventoryStore = transaction.objectStore('inventory');
  inventory.forEach((item) => {
    const record: CachedInventory = {
      id: `${organizationId}:${branchId}:${item.productId}`,
      organizationId,
      branchId,
      productId: item.productId,
      quantity: item.quantity,
      syncedAt,
    };
    inventoryStore.put(record);
  });

  await transactionDone(transaction);
}

export async function getCachedCatalog(organizationId: string, branchId: string) {
  const db = await openOfflineDb();
  const transaction = db.transaction(['catalogs', 'inventory'], 'readonly');
  const completed = transactionDone(transaction);
  const catalogRequest = transaction
    .objectStore('catalogs')
    .get(`${organizationId}:${branchId}`);
  const inventoryRequest = transaction
    .objectStore('inventory')
    .index('organizationBranch')
    .getAll([organizationId, branchId]);
  const [catalog, inventory] = await Promise.all([
    requestResult<CachedCatalog | undefined>(catalogRequest),
    requestResult<CachedInventory[]>(inventoryRequest),
  ]);
  await completed;

  return {
    products: catalog?.products || [],
    stockLevels: Object.fromEntries(inventory.map((item) => [item.productId, item.quantity])),
    syncedAt: catalog?.syncedAt || null,
  };
}

export async function saveAppSnapshot(appState: Record<string, unknown>) {
  if (!appState.orgId || !appState.userId) return;
  const db = await openOfflineDb();
  const transaction = db.transaction('appSnapshot', 'readwrite');
  const snapshot: OfflineAppSnapshot = {
    id: 'current',
    appState,
    cachedAt: new Date().toISOString(),
  };
  transaction.objectStore('appSnapshot').put(snapshot);
  await transactionDone(transaction);
}

export async function getAppSnapshot(): Promise<OfflineAppSnapshot | null> {
  const db = await openOfflineDb();
  const transaction = db.transaction('appSnapshot', 'readonly');
  const snapshot = await requestResult<OfflineAppSnapshot | undefined>(
    transaction.objectStore('appSnapshot').get('current'),
  );
  await transactionDone(transaction);
  return snapshot || null;
}

export async function getPendingOperations(
  limit = 20,
  includeDelayed = false,
): Promise<QueuedOperation[]> {
  const db = await openOfflineDb();
  const transaction = db.transaction('operations', 'readonly');
  const records = await requestResult<QueuedOperation[]>(
    transaction.objectStore('operations').getAll(),
  );
  await transactionDone(transaction);
  const now = new Date().toISOString();
  return records
    .filter(
      (record) =>
        record.status !== 'synced' && (includeDelayed || record.nextAttemptAt <= now),
    )
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .slice(0, limit);
}

export async function updateOperation(id: string, updates: Partial<QueuedOperation>) {
  const db = await openOfflineDb();
  const transaction = db.transaction('operations', 'readwrite');
  const completed = transactionDone(transaction);
  const store = transaction.objectStore('operations');
  const request = store.get(id);
  request.onsuccess = () => {
    if (request.result) store.put({ ...request.result, ...updates });
  };
  await completed;
  notifySyncStatus();
}

export async function getSyncCounts() {
  const db = await openOfflineDb();
  const transaction = db.transaction('operations', 'readonly');
  const records = await requestResult<QueuedOperation[]>(
    transaction.objectStore('operations').getAll(),
  );
  await transactionDone(transaction);
  return {
    pending: records.filter((item) => item.status === 'pending' || item.status === 'syncing').length,
    failed: records.filter((item) => item.status === 'failed').length,
  };
}

export function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error || new Error('Offline transaction aborted.'));
  });
}

export function notifySyncStatus() {
  window.dispatchEvent(new CustomEvent(OFFLINE_SYNC_EVENT));
}
