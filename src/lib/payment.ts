/**
 * Payment Integration Service - CLEAN VERSION
 * NO AUTH REQUIRED for verification
 */

import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/payments-simple`;

export type PaymentProvider = 'paystack' | 'flutterwave';

export function isLivePaymentMode(): boolean {
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';
  return publicKey.startsWith('pk_live_');
}

export function getPaymentEnvironment(): 'live' | 'test' | 'not-configured' {
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';
  
  if (publicKey.startsWith('pk_live_')) return 'live';
  if (publicKey.startsWith('pk_test_')) return 'test';
  return 'not-configured';
}

export function getPaystackPublicKey(): string {
  const key = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  
  if (!key) {
    console.warn('⚠️ PAYSTACK_PUBLIC_KEY not configured');
    return 'pk_test_fallback';
  }
  
  const env = getPaymentEnvironment();
  console.log(`💳 Payment Environment: ${env.toUpperCase()}`);
  
  return key;
}

export interface PaymentRequest {
  email: string;
  amount: number;
  currency: string;
  reference: string;
  metadata: {
    orgId: string;
    userId: string;
    planId: string;
    billingCycle: 'monthly' | 'yearly';
    planName: string;
  };
}

export interface PaymentInitResponse {
  success: boolean;
  authorizationUrl?: string;
  reference?: string;
  error?: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  status?: 'success' | 'failed' | 'pending';
  amount?: number;
  reference?: string;
  paidAt?: string;
  error?: string;
}

export function generatePaymentReference(prefix: string = 'SUB'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9).toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Initialize PayStack payment (requires auth)
 */
export async function initializePaystackPayment(
  request: PaymentRequest,
  accessToken: string
): Promise<PaymentInitResponse> {
  try {
    const response = await fetch(`${API_BASE}/paystack/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to initialize PayStack payment');
    }

    return data;
  } catch (error: any) {
    console.error('PayStack initialization error:', error);
    return {
      success: false,
      error: error.message || 'Failed to initialize payment',
    };
  }
}

/**
 * Verify PayStack payment (NO AUTH REQUIRED!)
 */
export async function verifyPaystackPayment(
  reference: string
): Promise<PaymentVerifyResponse> {
  try {
    console.log('🔍 Verifying PayStack payment (NO AUTH):', reference);
    
    const response = await fetch(
      `${API_BASE}/paystack/verify/${reference}`
    );

    console.log('📋 Response status:', response.status);

    const data = await response.json();
    console.log('📋 Response data:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Failed to verify payment');
    }

    return data;
  } catch (error: any) {
    console.error('❌ PayStack verification error:', error);
    return {
      success: false,
      error: error.message || 'Failed to verify payment',
    };
  }
}

/**
 * Initialize Flutterwave payment (requires auth)
 */
export async function initializeFlutterwavePayment(
  request: PaymentRequest,
  accessToken: string
): Promise<PaymentInitResponse> {
  try {
    const response = await fetch(`${API_BASE}/flutterwave/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to initialize Flutterwave payment');
    }

    return data;
  } catch (error: any) {
    console.error('Flutterwave initialization error:', error);
    return {
      success: false,
      error: error.message || 'Failed to initialize payment',
    };
  }
}

/**
 * Verify Flutterwave payment (NO AUTH REQUIRED!)
 */
export async function verifyFlutterwavePayment(
  transactionId: string
): Promise<PaymentVerifyResponse> {
  try {
    console.log('🔍 Verifying Flutterwave payment (NO AUTH):', transactionId);
    
    const response = await fetch(
      `${API_BASE}/flutterwave/verify/${transactionId}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to verify payment');
    }

    return data;
  } catch (error: any) {
    console.error('Flutterwave verification error:', error);
    return {
      success: false,
      error: error.message || 'Failed to verify payment',
    };
  }
}

/**
 * Initialize payment based on provider
 */
export async function initializePayment(
  provider: PaymentProvider,
  request: PaymentRequest,
  accessToken: string
): Promise<PaymentInitResponse> {
  if (provider === 'paystack') {
    return initializePaystackPayment(request, accessToken);
  } else {
    return initializeFlutterwavePayment(request, accessToken);
  }
}

/**
 * Verify payment based on provider (NO AUTH REQUIRED)
 */
export async function verifyPayment(
  provider: PaymentProvider,
  reference: string
): Promise<PaymentVerifyResponse> {
  if (provider === 'paystack') {
    return verifyPaystackPayment(reference);
  } else {
    return verifyFlutterwavePayment(reference);
  }
}

export function calculateSubscriptionAmount(
  monthlyPrice: number,
  billingCycle: 'monthly' | 'yearly'
): number {
  if (billingCycle === 'yearly') {
    return Math.round(monthlyPrice * 12 * 0.85);
  }
  return monthlyPrice;
}

export function formatAmountToKobo(amount: number): number {
  return Math.round(amount * 100);
}

export function formatAmountFromKobo(amount: number): number {
  return amount / 100;
}
