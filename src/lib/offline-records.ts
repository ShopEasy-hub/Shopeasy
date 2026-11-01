import {
  notifySyncStatus,
  openOfflineDb,
  QueuedOperation,
  transactionDone,
} from './offline-db';
import { getDeviceId } from './offline-sales';

interface CachedDataset<T> {
  id: string;
  data: T;
  cachedAt: string;
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveDataset<T>(id: string, data: T) {
  const db = await openOfflineDb();
  const transaction = db.transaction('datasets', 'readwrite');
  transaction.objectStore('datasets').put({
    id,
    data,
    cachedAt: new Date().toISOString(),
  } satisfies CachedDataset<T>);
  await transactionDone(transaction);
}

export async function getDataset<T>(id: string): Promise<T | null> {
  const db = await openOfflineDb();
  const transaction = db.transaction('datasets', 'readonly');
  const record = await requestResult<CachedDataset<T> | undefined>(
    transaction.objectStore('datasets').get(id),
  );
  await transactionDone(transaction);
  return record?.data ?? null;
}

function normalizeOfflineSale(sale: any, operation?: QueuedOperation) {
  return {
    id: sale.transactionId,
    transactionId: sale.transactionId,
    receipt_number: sale.receiptNumber,
    receiptNumber: sale.receiptNumber,
    organization_id: sale.orgId,
    organizationId: sale.orgId,
    branch_id: sale.branchId,
    branchId: sale.branchId,
    customer_name: sale.customer,
    customerName: sale.customer,
    customer_phone: sale.customerPhone,
    customerPhone: sale.customerPhone,
    subtotal: sale.subtotal,
    discount: sale.discount,
    total: sale.total,
    payment_method: sale.paymentMethod,
    paymentMethod: sale.paymentMethod,
    amount_paid: sale.amountPaid,
    amountPaid: sale.amountPaid,
    status: 'completed',
    sync_status: operation?.status || 'pending',
    sync_error: operation?.error,
    created_at: sale.createdAt,
    createdAt: sale.createdAt,
    items: sale.items.map((item: any) => ({
      ...item,
      product_id: item.productId,
      product: { name: item.name, sku: item.sku },
    })),
  };
}

export async function getCachedSales(organizationId: string, branchId?: string) {
  const [remoteSales, localSales, operations] = await Promise.all([
    getDataset<any[]>(`sales:${organizationId}`),
    getLocalStoreRecords<any>('sales'),
    getLocalStoreRecords<QueuedOperation>('operations'),
  ]);
  const local = localSales
    .filter((sale) => sale.orgId === organizationId)
    .map((sale) =>
      normalizeOfflineSale(
        sale,
        operations.find(
          (operation) =>
            operation.operationType === 'cash_sale' &&
            operation.recordId === sale.transactionId,
        ),
      ),
    );
  const merged = [...local, ...(remoteSales || [])].filter(
    (sale, index, all) =>
      all.findIndex((candidate) => candidate.id === sale.id) === index,
  );
  return branchId
    ? merged.filter((sale) => (sale.branch_id || sale.branchId) === branchId)
    : merged;
}

async function getLocalStoreRecords<T>(storeName: string): Promise<T[]> {
  const db = await openOfflineDb();
  const transaction = db.transaction(storeName, 'readonly');
  const records = await requestResult<T[]>(transaction.objectStore(storeName).getAll());
  await transactionDone(transaction);
  return records;
}

export interface OfflineReturnItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  refundAmount: number;
}

export async function saveReturnLocally(input: {
  organizationId: string;
  branchId: string;
  userId: string;
  saleId: string;
  receiptNumber: string;
  reason: string;
  items: OfflineReturnItem[];
}) {
  const db = await openOfflineDb();
  const transaction = db.transaction(
    ['returns', 'operations', 'inventory'],
    'readwrite',
  );
  const completed = transactionDone(transaction);
  const operationId = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const deviceId = getDeviceId();
  const payload = {
    operationId,
    organizationId: input.organizationId,
    branchId: input.branchId,
    userId: input.userId,
    deviceId,
    saleId: input.saleId,
    receiptNumber: input.receiptNumber,
    reason: input.reason,
    items: input.items,
    createdAt,
  };
  const operation: QueuedOperation = {
    id: operationId,
    organizationId: input.organizationId,
    branchId: input.branchId,
    deviceId,
    userId: input.userId,
    operationType: 'return_create',
    recordId: operationId,
    payload,
    createdAt,
    status: 'pending',
    attempts: 0,
    nextAttemptAt: createdAt,
  };
  transaction.objectStore('operations').add(operation);
  const returnsStore = transaction.objectStore('returns');
  const inventoryStore = transaction.objectStore('inventory');
  let index = 0;

  const writeNext = () => {
    const item = input.items[index];
    if (!item) return;
    returnsStore.put({
      id: item.id,
      organizationId: input.organizationId,
      branchId: input.branchId,
      sale_id: input.saleId,
      product_id: item.productId,
      quantity: item.quantity,
      reason: input.reason,
      refund_amount: item.refundAmount,
      status: 'pending_sync',
      created_at: createdAt,
      createdAt,
      product: { name: item.productName, sku: item.sku },
    });
    const inventoryKey = `${input.organizationId}:${input.branchId}:${item.productId}`;
    const request = inventoryStore.get(inventoryKey);
    request.onsuccess = () => {
      const inventory = request.result;
      inventoryStore.put({
        id: inventoryKey,
        organizationId: input.organizationId,
        branchId: input.branchId,
        productId: item.productId,
        quantity: (inventory?.quantity || 0) + item.quantity,
        syncedAt: inventory?.syncedAt || createdAt,
        locallyModifiedAt: createdAt,
      });
      index += 1;
      writeNext();
    };
  };
  writeNext();
  await completed;
  notifySyncStatus();
  return payload;
}

export async function getCachedReturns(organizationId: string, branchId?: string) {
  const [remote, local] = await Promise.all([
    getDataset<any[]>(`returns:${organizationId}`),
    getLocalStoreRecords<any>('returns'),
  ]);
  const merged = [
    ...local.filter((item) => item.organizationId === organizationId),
    ...(remote || []),
  ].filter(
    (item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index,
  );
  return branchId
    ? merged.filter((item) => (item.branch_id || item.branchId) === branchId)
    : merged;
}

export interface OfflineExpense {
  id: string;
  organizationId: string;
  branchId: string;
  branchName: string;
  userId: string;
  recordedBy: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: 'cash' | 'transfer' | 'pos';
  createdAt: string;
  syncStatus: 'pending' | 'synced';
}

export async function saveExpenseLocally(expense: OfflineExpense) {
  const db = await openOfflineDb();
  const transaction = db.transaction(['expenses', 'operations'], 'readwrite');
  const createdAt = expense.createdAt;
  const deviceId = getDeviceId();
  const operation: QueuedOperation = {
    id: expense.id,
    organizationId: expense.organizationId,
    branchId: expense.branchId,
    deviceId,
    userId: expense.userId,
    operationType: 'expense_create',
    recordId: expense.id,
    payload: { ...expense, deviceId },
    createdAt,
    status: 'pending',
    attempts: 0,
    nextAttemptAt: createdAt,
  };
  transaction.objectStore('expenses').put(expense);
  transaction.objectStore('operations').put(operation);
  await transactionDone(transaction);
  notifySyncStatus();
}

export async function getCachedExpenses(organizationId: string, branchId?: string) {
  const [remote, local] = await Promise.all([
    getDataset<any[]>(`expenses:${organizationId}`),
    getLocalStoreRecords<any>('expenses'),
  ]);
  const normalizedRemote = (remote || []).map((expense) => ({
    id: expense.id,
    organizationId: expense.organization_id,
    branchId: expense.branch_id,
    branchName: expense.branch?.name || 'Unknown',
    userId: expense.created_by,
    recordedBy: expense.recorded_by || 'User',
    date: expense.date,
    category: expense.category,
    description: expense.description,
    amount: Number(expense.amount),
    paymentMethod: expense.payment_method || expense.paymentMethod,
    createdAt: expense.created_at,
    syncStatus: 'synced',
  }));
  const merged = [
    ...local.filter((item) => item.organizationId === organizationId),
    ...normalizedRemote,
  ].filter(
    (item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index,
  );
  return branchId ? merged.filter((item) => item.branchId === branchId) : merged;
}

export async function markOperationRecordsSynced(operation: QueuedOperation) {
  if (operation.operationType === 'return_create') {
    const db = await openOfflineDb();
    const transaction = db.transaction('returns', 'readwrite');
    const store = transaction.objectStore('returns');
    for (const item of operation.payload.items || []) {
      const request = store.get(item.id);
      request.onsuccess = () => {
        if (request.result) store.put({ ...request.result, status: 'completed' });
      };
    }
    await transactionDone(transaction);
  }

  if (operation.operationType === 'expense_create') {
    const db = await openOfflineDb();
    const transaction = db.transaction('expenses', 'readwrite');
    const store = transaction.objectStore('expenses');
    const request = store.get(operation.recordId);
    request.onsuccess = () => {
      if (request.result) store.put({ ...request.result, syncStatus: 'synced' });
    };
    await transactionDone(transaction);
  }
}
