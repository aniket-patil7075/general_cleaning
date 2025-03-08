"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import React, { useState, useEffect } from 'react';
import { useApiContext } from '@/lib/api/ApiContext';

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const { 
    setFlag, 
    setPaymentMethod, 
    setAttributeId, 
    setTransactionReference 
  } = useApiContext();

  useEffect(() => {
    if (!searchParams) return; // Ensure searchParams is available

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

    // Delay navigation slightly to prevent hydration issues
    setTimeout(() => {
      if (flagParam === 'success') {
        router.replace('/booking/confirmation'); // Use replace to prevent navigation history stacking
      } else {
        router.replace('/booking/payment-failed');
      }
      setLoading(false);
    }, 100); // Small delay for smoother transition

  }, [searchParams, router]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default Page;
