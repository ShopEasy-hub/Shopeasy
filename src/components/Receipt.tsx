import { button } from "@/components/ui/button";

interface ReceiptItem {
    name: string;
    price: number;
    quantity: number;
}

interface ReceiptProps {
    items: ReceiptItem[];
    total: number;
    cashier?: string;
    date?: string;
}

export default function Receipt({
    items,
    total,
    cashier = "Admin",
    date = new Date().toLocaleString(),
}: ReceiptProps) {

    const handlePrint = () => {
        const content = document.getElementById("receipt-content");

        if (!content) {
            alert("Nothing to print");
            return;
        }

        const printWindow = window.open("", "", "width=350,height=600");

        if (!printWindow) {
            alert("Popup blocked. Allow popups to print.");
            return;
        }

        printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body {
              margin: 0;
              padding: 10px;
              font-family: monospace;
              background: #fff;
              color: #000;
              width: 280px;
            }

            @page {
              size: 80mm auto;
              margin: 0;
            }

            h2 {
              text-align: center;
              margin-bottom: 5px;
            }

            .center {
              text-align: center;
            }

            .line {
              border-top: 1px dashed #000;
              margin: 6px 0;
            }

            .row {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              margin: 2px 0;
            }

            .bold {
              font-weight: bold;
            }

            .small {
              font-size: 11px;
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    return (
        <div className="bg-white text-black p-4">
            {/* RECEIPT CONTENT */}
            <div id="receipt-content" style={{ width: "280px" }}>

                {/* Header */}
                <h2 className="text-center font-bold text-lg">SHOPSPOT</h2>
                <p className="text-center text-xs">Sales Receipt</p>

                <div className="text-xs mt-2">
                    <p>Date: {date}</p>
                    <p>Cashier: {cashier}</p>
                </div>

                <div className="border-t border-dashed my-2"></div>

                {/* Items */}
                {items.map((item, index) => (
                    <div key={index} className="text-xs mb-1">
                        <div className="flex justify-between">
                            <span>{item.name}</span>
                            <span>₦{item.price * item.quantity}</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                            <span>{item.quantity} x ₦{item.price}</span>
                        </div>
                    </div>
                ))}

                <div className="border-t border-dashed my-2"></div>

                {/* Total */}
                <div className="flex justify-between font-bold text-sm">
                    <span>Total</span>
                    <span>₦{total}</span>
                </div>

                <div className="border-t border-dashed my-2"></div>

                {/* Footer */}
                <p className="text-center text-xs mt-2">
                    Thank you for your purchase!
                </p>

            </div>

            {/* PRINT BUTTON */}
            <button onClick={handlePrint} className="w-full mt-4">
                Print Receipt
            </button>
        </div>
    );
}
