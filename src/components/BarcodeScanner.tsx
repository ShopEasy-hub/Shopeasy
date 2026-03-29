import { useState, useRef, useEffect } from 'react';
import { Camera, X, Monitor, Keyboard } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import Quagga from 'quagga';

interface BarcodeScannerProps {
    onScan: (barcode: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

export function BarcodeScanner({ onScan, isOpen, onClose }: BarcodeScannerProps) {
    const [scanning, setScanning] = useState(false);
    const [manualInput, setManualInput] = useState('');
    const [showManualEntry, setShowManualEntry] = useState(false);

    const scannerRef = useRef<HTMLDivElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // 🔥 START SCAN
    const startScan = async () => {
        setScanning(true);

        // ✅ Try BarcodeDetector
        if ('BarcodeDetector' in window) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' },
                });

                streamRef.current = stream;

                const video = document.createElement('video');
                video.srcObject = stream;
                await video.play();

                const detector = new (window as any).BarcodeDetector({
                    formats: ['ean_13', 'code_128', 'qr_code'],
                });

                const scan = async () => {
                    if (!streamRef.current) return;

                    try {
                        const barcodes = await detector.detect(video);

                        if (barcodes.length > 0) {
                            const code = barcodes[0].rawValue;

                            stopCamera();
                            setScanning(false);

                            onScan(code);
                            toast.success('Scanned successfully');
                            onClose();
                            return;
                        }
                    } catch (err) { }

                    requestAnimationFrame(scan);
                };

                scan();
                return;
            } catch (err) {
                console.log('BarcodeDetector failed, fallback...');
            }
        }

        // 🔁 Fallback → QuaggaJS
        if (scannerRef.current) {
            Quagga.init(
                {
                    inputStream: {
                        type: 'LiveStream',
                        target: scannerRef.current,
                        constraints: {
                            facingMode: 'environment',
                        },
                    },
                    decoder: {
                        readers: ['ean_reader', 'ean_8_reader', 'code_128_reader'],
                    },
                },
                (err) => {
                    if (err) {
                        console.error(err);
                        toast.error('Camera failed');
                        return;
                    }

                    Quagga.start();
                }
            );

            // 🔥 FIX: remove previous listeners first
            Quagga.offDetected();

            Quagga.onDetected((data) => {
                const code = data.codeResult.code;

                Quagga.stop();
                setScanning(false);

                onScan(code);
                toast.success('Scanned successfully');
                onClose();
            });
        }
    };

    // 🔥 STOP CAMERA CLEANLY
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
    };

    // 🔥 STOP SCAN
    const stopScan = () => {
        setScanning(false);

        try {
            Quagga.stop();
            Quagga.offDetected();
        } catch (e) { }

        stopCamera();
    };

    const handleClose = () => {
        stopScan();
        onClose();
    };

    useEffect(() => {
        return () => stopScan();
    }, []);

    // 🔴 FULLSCREEN SCANNER
    if (scanning) {
        return (
            <div className="fixed inset-0 z-[9999] bg-black">
                <div ref={scannerRef} className="absolute inset-0 z-0" />

                <div className="absolute top-0 left-0 right-0 p-4 text-white flex justify-between z-10">
                    <div className="flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        <span>Scan Barcode</span>
                    </div>
                    <Button variant="ghost" onClick={stopScan}>
                        <X className="h-5 w-5 text-white" />
                    </Button>
                </div>

                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="w-72 h-48 border-2 border-white rounded-lg" />
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
                    {/* Info */}
                    <div className="flex items-center justify-center gap-2 p-3 bg-muted rounded-lg">
                        <Monitor className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">
                            Camera or POS Scanner Supported
                        </span>
                    </div>

                    <Alert>
                        <Camera className="h-4 w-4" />
                        <AlertDescription>
                            Use camera or connect a barcode scanner device.
                        </AlertDescription>
                    </Alert>

                    <Button onClick={startScan} size="lg" className="w-full">
                        <Camera className="h-4 w-4 mr-2" />
                        Start Scanning
                    </Button>

                    {/* Manual / Hardware Scanner */}
                    {showManualEntry && (
                        <div className="space-y-2">
                            <Label>Scan or Enter Barcode</Label>
                            <Input
                                autoFocus
                                value={manualInput}
                                onChange={(e) => setManualInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onScan(manualInput);
                                        setManualInput('');
                                        toast.success('Scanned successfully');
                                        onClose();
                                    }
                                }}
                                placeholder="Scan or type barcode"
                            />
                        </div>
                    )}

                    {!showManualEntry && (
                        <Button onClick={() => setShowManualEntry(true)} className="w-full">
                            <Keyboard className="h-4 w-4 mr-2" />
                            Use POS Scanner / Manual Entry
                        </Button>
                    )}

                    <Button variant="outline" onClick={handleClose} className="w-full">
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
