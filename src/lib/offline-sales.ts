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
  const completed = transactionDone(transaction);
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
  let itemIndex = 0;
  const updateNextInventoryItem = () => {
    const item = payload.items[itemIndex];
    if (!item) return;
    const key = `${payload.orgId}:${payload.branchId}:${item.productId}`;
    const request = inventoryStore.get(key);
    request.onsuccess = () => {
      const inventory = request.result;
      inventoryStore.put({
        id: key,
        organizationId: payload.orgId,
        branchId: payload.branchId,
        productId: item.productId,
        quantity: Math.max(0, (inventory?.quantity || 0) - item.quantity),
        syncedAt: inventory?.syncedAt || payload.createdAt,
        locallyModifiedAt: payload.createdAt,
      });
      itemIndex += 1;
      updateNextInventoryItem();
    };
  };
  updateNextInventoryItem();

  await completed;
  notifySyncStatus();
  return { success: true, pendingSync: true, sale: payload };
}
