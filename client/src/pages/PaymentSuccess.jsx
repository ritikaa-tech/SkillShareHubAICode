import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // optionally confirm enrollment
    console.log('Payment successful, session ID:', sessionId);
  }, [sessionId]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
      <p className="mt-4">Thank you for your purchase. Your course is now unlocked.</p>
    </div>
  );
};

export default PaymentSuccess;
