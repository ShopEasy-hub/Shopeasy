import {
  notifySyncStatus,
  OfflineSalePayload,
  openOfflineDb,
  QueuedOperation,
  transactionDone,
} from './offline-db';

const DEVICE_ID_KEY = 'shopspot-device-id';

export function getDeviceId() {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

export function createTransactionIdentity() {
  const transactionId = crypto.randomUUID();
  const compactDate = new Date().toISOString().replace(/\D/g, '').slice(2, 14);
  return {
    transactionId,
    receiptNumber: `OFF-${compactDate}-${transactionId.slice(0, 6).toUpperCase()}`,
  };
}

export async function saveCashSaleLocally(payload: OfflineSalePayload) {
  const db = await openOfflineDb();
  const transaction = db.transaction(['sales', 'operations', 'inventory'], 'readwrite');
  const operation: QueuedOperation = {
    id: payload.transactionId,
    organizationId: payload.orgId,
    branchId: payload.branchId,
    deviceId: payload.deviceId,
    userId: payload.userId,
    operationType: 'cash_sale',
    recordId: payload.transactionId,
    payload,
    createdAt: payload.createdAt,
    status: 'pending',
    attempts: 0,
    nextAttemptAt: payload.createdAt,
  };

  transaction.objectStore('sales').add(payload);
  transaction.objectStore('operations').add(operation);

  const inventoryStore = transaction.objectStore('inventory');
  for (const item of payload.items) {
    const key = `${payload.orgId}:${payload.branchId}:${item.productId}`;
    const inventory = await new Promise<any>((resolve, reject) => {
      const request = inventoryStore.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    inventoryStore.put({
      id: key,
      organizationId: payload.orgId,
      branchId: payload.branchId,
      productId: item.productId,
      quantity: Math.max(0, (inventory?.quantity || 0) - item.quantity),
      syncedAt: inventory?.syncedAt || payload.createdAt,
      locallyModifiedAt: payload.createdAt,
    });
  }

  await transactionDone(transaction);
  notifySyncStatus();
  return { success: true, pendingSync: true, sale: payload };
}
