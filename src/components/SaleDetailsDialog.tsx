import {
  Calendar,
  CreditCard,
  Hash,
  MapPin,
  ReceiptText,
  User,
} from 'lucide-react';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface SaleDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: any | null;
  branchName?: string;
}

function money(value: unknown) {
  return Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function SaleDetailsDialog({
  open,
  onOpenChange,
  sale,
  branchName,
}: SaleDetailsDialogProps) {
  if (!sale) return null;

  const receiptNumber =
    sale.receipt_number || sale.receiptNumber || sale.transactionId || sale.id;
  const createdAt = sale.created_at || sale.createdAt || sale.date;
  const customer =
    sale.customer_name || sale.customerName || sale.customer || 'Walk-in Customer';
  const customerPhone = sale.customer_phone || sale.customerPhone || '';
  const paymentMethod = sale.payment_method || sale.paymentMethod || 'cash';
  const cashier =
    sale.cashierName || sale.processed_by || sale.processedBy || 'Not available';
  const resolvedBranch =
    sale.branch?.name || sale.branchName || branchName || 'Current branch';
  const items = sale.items || sale.sale_items || [];
  const subtotal = Number(sale.subtotal || 0);
  const discount = Number(sale.discount || 0);
  const total = Number(sale.total || 0);
  const amountPaid = Number(sale.amount_paid ?? sale.amountPaid ?? total);
  const change = Number(sale.change || 0);
  const syncStatus =
    sale.sync_status || (sale.pendingSync === true ? 'pending' : 'synced');
  const syncLabel =
    syncStatus === 'synced'
      ? 'Fully synchronized'
      : syncStatus === 'failed'
        ? 'Synchronization failed'
        : syncStatus === 'syncing'
          ? 'Synchronizing'
          : 'Synchronization pending';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <ReceiptText className="w-5 h-5 text-primary" />
                Sale Receipt
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Complete transaction information and purchased items
              </p>
            </div>
            <Badge
              variant={
                syncStatus === 'failed'
                  ? 'destructive'
                  : syncStatus === 'synced'
                    ? 'secondary'
                    : 'outline'
              }
            >
              {syncLabel}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Hash className="w-4 h-4" />
              Receipt number
            </div>
            <p className="font-mono font-medium mt-1 break-all">{receiptNumber}</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Date and time
            </div>
            <p className="font-medium mt-1">
              {createdAt ? new Date(createdAt).toLocaleString() : 'Not available'}
            </p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              Customer
            </div>
            <p className="font-medium mt-1">{customer}</p>
            {customerPhone && (
              <p className="text-sm text-muted-foreground">{customerPhone}</p>
            )}
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              Branch and cashier
            </div>
            <p className="font-medium mt-1">{resolvedBranch}</p>
            <p className="text-sm text-muted-foreground">Cashier: {cashier}</p>
          </div>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Discount</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item: any, index: number) => {
                const name = item.product?.name || item.name || 'Unknown item';
                const sku = item.product?.sku || item.sku || '—';
                const quantity = Number(item.quantity || 0);
                const price = Number(item.price || item.unit_price || 0);
                const itemDiscount = Number(item.discount || 0);
                const itemTotal =
                  Number(item.subtotal) ||
                  price * quantity * (1 - itemDiscount / 100);
                return (
                  <TableRow key={item.id || item.product_id || item.productId || index}>
                    <TableCell className="font-medium">{name}</TableCell>
                    <TableCell className="text-muted-foreground">{sku}</TableCell>
                    <TableCell className="text-right">{quantity}</TableCell>
                    <TableCell className="text-right">₦{money(price)}</TableCell>
                    <TableCell className="text-right">{itemDiscount}%</TableCell>
                    <TableCell className="text-right font-medium">
                      ₦{money(itemTotal)}
                    </TableCell>
                  </TableRow>
                );
              })}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No item details are available for this transaction.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="w-4 h-4" />
              Payment information
            </div>
            <div className="flex justify-between text-sm">
              <span>Method</span>
              <span className="font-medium capitalize">{paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Amount paid</span>
              <span className="font-medium">₦{money(amountPaid)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Change</span>
              <span className="font-medium">₦{money(change)}</span>
            </div>
          </div>

          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₦{money(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span>-₦{money(discount)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">₦{money(total)}</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground break-all">
          Transaction ID: {sale.id || sale.transactionId}
        </div>
        {syncStatus === 'failed' && sale.sync_error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
            Sync error: {sale.sync_error}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
