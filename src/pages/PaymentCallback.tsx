import { useEffect, useState } from 'react';
import { AppState, Page } from '../App';
import { PaymentVerification } from './PaymentVerification';
import { Card } from '../components/ui/card';
import { Loader2 } from 'lucide-react';

interface PaymentCallbackProps {
    appState: AppState;
    onNavigate: (page: Page) => void;
    updateAppState: (updates: Partial<AppState>) => void;
}

export function PaymentCallback({
    appState,
    onNavigate,
    updateAppState,
}: PaymentCallbackProps) {
    const [loading, setLoading] = useState(true);
    const [paymentDetails, setPaymentDetails] = useState<any>(null);
    const [debugInfo, setDebugInfo] = useState<string>('');

    useEffect(() => {
        console.log('🔥 PaymentCallback component mounted');
        console.log('🔥 App state:', appState);

        try {
            // Get payment details from URL params
            const urlParams = new URLSearchParams(window.location.search);
            const reference = urlParams.get('reference') || urlParams.get('trxref') || urlParams.get('tx_ref');
            const status = urlParams.get('status');
            const transactionId = urlParams.get('transaction_id');

            const allParams = Object.fromEntries(urlParams.entries());
            console.log('🔄 Payment callback received:', {
                reference,
                status,
                transactionId,
                allParams
            });

            setDebugInfo(JSON.stringify({
                url: window.location.href,
                reference,
                status,
                transactionId,
                allParams
            }, null, 2));

            // Get pending payment from sessionStorage
            const pendingPaymentStr = sessionStorage.getItem('pendingPayment');
            console.log('📦 Pending payment from sessionStorage:', pendingPaymentStr);

            // If not in sessionStorage, try localStorage as backup
            const localStoragePendingPayment = !pendingPaymentStr ? localStorage.getItem('pendingPayment') : null;
            if (localStoragePendingPayment) {
                console.log('📦 Found pending payment in localStorage (backup):', localStoragePendingPayment);
            }

            const finalPendingPaymentStr = pendingPaymentStr || localStoragePendingPayment;

            if (!reference && !transactionId) {
                console.warn('⚠️ No payment reference found in URL');
                // No payment reference found, redirect to dashboard
                setTimeout(() => {
                    onNavigate('dashboard');
                }, 2000);
                setLoading(false);
                return;
            }

            if (finalPendingPaymentStr) {
                const pendingPayment = JSON.parse(finalPendingPaymentStr);
                console.log('✅ Using pending payment data:', pendingPayment);
                setPaymentDetails({
                    reference: reference || transactionId || pendingPayment.reference,
                    provider: pendingPayment.provider,
                    planId: pendingPayment.planId,
                    billingCycle: pendingPayment.billingCycle,
                });
                setLoading(false);

                // DON'T clear storage yet - wait until subscription is created
                // We'll clear it in PaymentVerification after success
            } else {
                console.log('⚠️ No pending payment, using URL data only');
                // If no pending payment in storage, try to extract from URL
                setPaymentDetails({
                    reference: reference || transactionId,
                    provider: status ? 'flutterwave' : 'paystack', // Flutterwave includes status in callback
                    planId: 'unknown',
                    billingCycle: 'monthly',
                });
                setLoading(false);
            }
        } catch (err) {
            console.error('❌ Error in PaymentCallback useEffect:', err);
            setDebugInfo('Error: ' + (err as Error).message);
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <Card className="max-w-md w-full p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                    <h2 className="text-2xl font-bold">Processing Payment</h2>
                    <p className="text-muted-foreground">
                        Please wait while we process your payment...
                    </p>
                    {debugInfo && (
                        <details className="text-xs text-left mt-4">
                            <summary className="cursor-pointer text-primary">Show Debug Info</summary>
                            <pre className="bg-muted p-2 rounded mt-2 overflow-auto max-h-32">
                                {debugInfo}
                            </pre>
                        </details>
                    )}
                </Card>
            </div>
        );
    }

    if (!paymentDetails) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <Card className="max-w-md w-full p-8 text-center space-y-4">
                    <h2>Payment Callback</h2>
                    <p className="text-muted-foreground">
                        No payment information found. Redirecting to dashboard...
                    </p>
                    {debugInfo && (
                        <pre className="text-xs text-left bg-muted p-4 rounded overflow-auto max-h-64">
                            {debugInfo}
                        </pre>
                    )}
                </Card>
            </div>
        );
    }

    return (
        <>
            {/* Debug overlay for testing */}
            {debugInfo && (
                <div className="fixed bottom-4 right-4 max-w-sm bg-background border rounded-lg shadow-lg p-4 text-xs z-50">
                    <pre className="overflow-auto max-h-32">
                        {debugInfo}
                    </pre>
                </div>
            )}

            <PaymentVerification
                appState={appState}
                onNavigate={onNavigate}
                updateAppState={updateAppState}
                reference={paymentDetails.reference}
                provider={paymentDetails.provider}
                planId={paymentDetails.planId}
                billingCycle={paymentDetails.billingCycle}
            />
        </>
    );
}