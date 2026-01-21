import { useState, useEffect } from 'react';
import { Camera, X, Smartphone, Monitor, Keyboard } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface BarcodeScannerProps {
    onScan: (barcode: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

export function BarcodeScanner({ onScan, isOpen, onClose }: BarcodeScannerProps) {
    const [isCapacitor, setIsCapacitor] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [manualInput, setManualInput] = useState('');
    const [showManualEntry, setShowManualEntry] = useState(false);

    useEffect(() => {
        checkPlatform();
    }, []);

    const checkPlatform = async () => {
        try {
            const { Capacitor } = await import('@capacitor/core');
            setIsCapacitor(Capacitor.isNativePlatform());
        } catch {
            setIsCapacitor(false);
        }
    };

    const startScan = async () => {
        if (!isCapacitor) {
            toast.info('Barcode scanning requires a physical scanner on web', {
                description: 'Camera scanning is available on the mobile app'
            });
            return;
        }

        try {
            const { Capacitor } = await import('@capacitor/core');
            if (!Capacitor.isNativePlatform()) {
                alert('Barcode scanning is only available on mobile');
                return;
            }

            const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');

            const status = await BarcodeScanner.checkPermission({ force: true });

            if (!status.granted) {
                setHasPermission(false);
                toast.error('Camera permission denied');
                return;
            }

            setHasPermission(true);
            setScanning(true);

            document.body.classList.add('scanner-active');
            await BarcodeScanner.hideBackground();

            const result = await BarcodeScanner.startScan();

            stopScan();

            if (result?.hasContent) {
                onScan(result.content || '');
                toast.success('Barcode scanned successfully!');
                onClose();
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to scan barcode');
            stopScan();
        }
    };

    const stopScan = async () => {
        setScanning(false);
        try {
            const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
            await BarcodeScanner.showBackground();
            await BarcodeScanner.stopScan();
            document.body.classList.remove('scanner-active');
        } catch { }
    };

    const handleClose = () => {
        if (scanning) stopScan();
        onClose();
    };

    useEffect(() => {
        return () => {
            if (scanning) stopScan();
        };
    }, [scanning]);

    if (scanning) {
        return (
            <div className="fixed inset-0 z-[9999] bg-black/95">
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black to-transparent">
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                            <Camera className="h-5 w-5" />
                            <div>
                                <h3 className="font-medium">Scan Barcode</h3>
                                <p className="text-xs text-white/70">Point camera at barcode</p>
                            </div>
                        </div>
                        <Button onClick={stopScan} variant="ghost" size="sm">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        Barcode Scanner
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 p-3 bg-muted rounded-lg">
                        {isCapacitor ? (
                            <>
                                <Smartphone className="h-4 w-4 text-green-600" />
                                <span className="text-sm">Mobile App - Camera Available</span>
                            </>
                        ) : (
                            <>
                                <Monitor className="h-4 w-4 text-blue-600" />
                                <span className="text-sm">Web Version - Use Scanner</span>
                            </>
                        )}
                    </div>

                    {showManualEntry && (
                        <div className="space-y-2">
                            <Label>Enter Barcode</Label>
                            <Input value={manualInput} onChange={e => setManualInput(e.target.value)} />
                            <Button
                                onClick={() => {
                                    onScan(manualInput);
                                    toast.success('Barcode entered');
                                    onClose();
                                }}
                            >
                                Submit
                            </Button>
                        </div>
                    )}

                    {!showManualEntry && (
                        <Button onClick={() => setShowManualEntry(true)}>
                            <Keyboard className="h-4 w-4 mr-2" />
                            Enter Barcode Manually
                        </Button>
                    )}

                    <Button onClick={startScan}>
                        <Camera className="h-4 w-4 mr-2" />
                        Start Scanning
                    </Button>

                    <Button variant="outline" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
