import React from "react";

const RazorpayPayment = () => {
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
    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      alert("Failed to load Razorpay SDK. Please check your internet connection.");
      return;
    }

    // Replace with your backend API to create an order
    const response = await fetch("https://skillsharehubbackend.onrender.com/api/payments/create-order", {
      method: "POST",
    });
    const orderData = await response.json();

    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Razorpay Key ID
      amount: orderData.amount, // Amount in paise (e.g., 50000 for ₹500)
      currency: "INR",
      name: "Your Company Name",
      description: "Test Transaction",
      order_id: orderData.id, // Order ID from your backend
      handler: function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        // You can verify the payment on your backend here
      },
      prefill: {
        name: "Your Name",
        email: "your.email@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div>
      <button onClick={handlePayment}>Pay with Razorpay</button>
    </div>
  );
};

export default RazorpayPayment;
