import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Download, Printer, Home, Receipt as ReceiptIcon, FileText } from 'lucide-react';

interface ReceiptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBackToHome?: () => void;
  sale: {
    id: string;
    receiptNumber: string;
    date: string;
    customer: string;
    customerPhone?: string;
    customerBirthDate?: string;
    cashierName?: string;
    items: Array<{
      name: string;
      sku: string;
      quantity: number;
      price: number;
      total: number;
    }>;
    subtotal: number;
    discount: number;
    total: number;
    paymentMethod: string;
  };
  branch?: {
    name: string;
    address?: string;
    phone?: string;
  };
  businessName?: string;
  receiptType?: 'thermal' | 'a4';
}

export function Receipt({
  open,
  onOpenChange,
  onBackToHome,
  sale,
  branch,
  businessName = 'ShopSpot',
  receiptType = 'thermal'
}: ReceiptProps) {

  const [currentType, setCurrentType] = useState<'thermal' | 'a4'>(receiptType);

  // ✅ FIXED PRINT FUNCTION
  const handlePrint = () => {
    const activeContent = document.querySelector(
      `[data-receipt="${currentType}"]`
    ) as HTMLElement;

    if (!activeContent) {
      alert('Nothing to print');
      return;
    }

    const printWindow = window.open('', '', 'width=400,height=600');

    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt-${sale.receiptNumber}</title>
          <style>
            body {
              font-family: monospace;
              padding: 10px;
              margin: 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 4px 0;
              font-size: 12px;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
            .border-b { border-bottom: 1px dashed #000; margin-bottom: 6px; }
          </style>
        </head>
        <body>
          ${activeContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleDownloadPDF = () => {
    alert('PDF download coming soon');
  };

  const renderReceiptContent = (type: 'thermal' | 'a4') => {
    const isThermal = type === 'thermal';

    return (
      <div
        data-receipt={type} // ✅ IMPORTANT FIX
        className={`bg-white text-black ${isThermal ? 'p-4 text-xs' : 'p-8 text-sm'}`}
      >
        {/* Header */}
        <div className="text-center border-b pb-2 mb-2">
          <h1 className="font-bold">{businessName}</h1>

          {branch && (
            <>
              <p>{branch.name}</p>
              {branch.address && <p>{branch.address}</p>}
              {branch.phone && <p>{branch.phone}</p>}
            </>
          )}
        </div>

        {/* Info */}
        <div className="mb-2">
          <div className="flex justify-between">
            <span>Receipt:</span>
            <span>{sale.receiptNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{new Date(sale.date).toLocaleString()}</span>
          </div>
        </div>

        {/* Items */}
        <table>
          <thead>
            <tr className="border-b">
              <th className="text-left">Item</th>
              <th>Qty</th>
              <th className="text-right">Price</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td className="text-right">₦{item.price.toFixed(2)}</td>
                <td className="text-right">₦{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="mt-2 border-b pb-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₦{sale.subtotal.toFixed(2)}</span>
          </div>

          {sale.discount > 0 && (
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>-₦{sale.discount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between font-bold">
            <span>TOTAL:</span>
            <span>₦{sale.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-2">
          <p>Thank you!</p>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex justify-between">
            <DialogTitle>Receipt</DialogTitle>

            <div className="flex gap-2">
              <Button size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>

              <Button size="sm" onClick={handleDownloadPDF}>
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={currentType} onValueChange={(v) => setCurrentType(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="thermal">
              <ReceiptIcon className="w-4 h-4 mr-2" />
              Thermal
            </TabsTrigger>

            <TabsTrigger value="a4">
              <FileText className="w-4 h-4 mr-2" />
              A4
            </TabsTrigger>
          </TabsList>

          <TabsContent value="thermal">
            <div className="max-w-sm mx-auto">
              {renderReceiptContent('thermal')}
            </div>
          </TabsContent>

          <TabsContent value="a4">
            {renderReceiptContent('a4')}
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 mt-4">
          {onBackToHome && (
            <Button className="flex-1" onClick={onBackToHome}>
              <Home className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}

          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
