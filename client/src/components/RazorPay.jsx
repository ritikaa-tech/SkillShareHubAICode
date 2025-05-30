import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RazorpayPayment = ({ course }) => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert("Failed to load Razorpay SDK. Please check your internet connection.");
        return;
      }

      // Create order
      const response = await axios.post(
        "http://localhost:5002/api/payment/create-order",
        { courseId: course._id },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const { order, key } = response.data;

      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: "SkillShareHub",
        description: `Purchase: ${course.title}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await axios.post(
              "http://localhost:5002/api/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );

            if (verifyResponse.data.success) {
              alert("Payment successful! You are now enrolled in the course.");
              navigate("/dashboard");
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: localStorage.getItem("userName") || "",
          email: localStorage.getItem("userEmail") || "",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment. Please try again later.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Buy Now for ₹{course.price}
    </button>
  );
};

export default RazorpayPayment;
