"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import React, { useState, useEffect, Suspense } from 'react';
import { useApiContext } from '@/lib/api/ApiContext';

// Client-side component that uses `useSearchParams`
const PaymentRedirectHandler = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const { 
    flag, 
    setFlag, 
    paymentMethod, 
    setPaymentMethod, 
    attributeId, 
    setAttributeId, 
    transactionReference, 
    setTransactionReference 
  } = useApiContext();

  useEffect(() => {
    if (!searchParams) return;

    const flagParam = searchParams.get('flag');
    const token = searchParams.get('token');

    setFlag(flagParam || '');

    if (token) {
      try {
        const decodedToken = atob(token);
        const params = new URLSearchParams(decodedToken.replace(/&&/g, '&'));
        setPaymentMethod(params.get('payment_method') || '');
        setAttributeId(params.get('attribute_id') || '');
        setTransactionReference(params.get('transaction_reference') || '');
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    // Redirect based on the flag value
    if (flagParam === 'success') {
      router.replace('/booking/confirmation'); // `replace` prevents history stacking
    } else {
      router.replace('/booking/payment-failed');
    }
    setLoading(false);
  }, [searchParams, router]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
      ) : null}
    </>
  );
};

// Main page component
const Page = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentRedirectHandler />
      </Suspense>
    </div>
  );
};

export default Page;