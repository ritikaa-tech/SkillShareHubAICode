import React from 'react';
import axios from 'axios';

const PaymentButton = ({ course }) => {
  const handlePayment = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await axios.post('/api/payment/create-checkout-session', {
        courseId: course._id,
        courseTitle: course.title,
        price: course.price,
        userId: user._id,
      });

      window.location.href = res.data.url; // Redirect to Stripe
    } catch (err) {
      console.error('Payment failed', err);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Buy Now for ${course.price}
    </button>
  );
};

export default PaymentButton;
