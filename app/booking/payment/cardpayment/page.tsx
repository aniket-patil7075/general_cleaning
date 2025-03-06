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
    const flagParam = searchParams.get('flag');
    const token = searchParams.get('token');

    // Store the flag value
    setFlag(flagParam || '');
    console.log('Flag:', flagParam);
    console.log('Encoded Token:', token);

    if (token) {
      try {
        const decodedToken = atob(token); // Decode Base64 token
        console.log('Decoded Token:', decodedToken);

        // Convert `&&` to `&` for proper parsing
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
      router.push('/booking/confirmation');
      setLoading(false);
    } else {
      router.push('/booking/payment-failed');
      setLoading(false);
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Page;
