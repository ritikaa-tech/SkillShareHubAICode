import React, { useEffect } from 'react';
import { apiService } from '../utils/api';

const RazorPay = ({ courseId, amount, onSuccess, onError }) => {
  useEffect(() => {
    const loadRazorpay = async () => {
      try {
        const res = await apiService.createOrder(courseId);
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: amount * 100,
          currency: "INR",
          name: "SkillShareHub",
          description: "Course Payment",
          order_id: res.data.id,
          handler: async function (response) {
            try {
              await apiService.verifyPayment({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                courseId
              });
              onSuccess(response);
            } catch (error) {
              onError(error);
            }
          },
          prefill: {
            name: "User Name",
            email: "user@example.com",
            contact: "9999999999"
          },
          theme: {
            color: "#1976d2"
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        onError(error);
      }
    };

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = loadRazorpay;
    script.onerror = () => onError(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [courseId, amount, onSuccess, onError]);

  return null;
};

export default RazorPay;
