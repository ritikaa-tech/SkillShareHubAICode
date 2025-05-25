// routes/payments.js
const Razorpay = require('razorpay');
const express = require('express');
const crypto = require('crypto');
const Order = require('../models/order'); // Adjust the path if needed
const router = express.Router();
console.log("process.env.RAZORPAY_KEY_ID", process.env.RAZORPAY_KEY_ID);
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

 router.post('/create-order', async (req, res) => {
  const { amount, userId, courseId } = req.body;
  console.log("Creating order with amount:", amount, "userId:", userId, "courseId:", courseId);
  const options = {
    amount: amount * 100, // amount in paise
    currency: 'INR',
    receipt: `rcpt_${userId}_${courseId}`,
  };

  try {
    razorpay.orders.create(options, async (err, order) => {
      if (err) {
        console.error("Razorpay order creation error:", err);
        return res.status(500).json({ success: false, error: "Failed to create order" });
      }

      // Save order to DB
      const newOrder = new Order({
        orderid: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: 'PENDING',
        userId: req.user?._id || userId,
        courseId: courseId,
      });

      await newOrder.save();

      res.json({ success: true, order });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


router.post('/verify', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(sign.toString())
    .digest('hex');

  if (expectedSign === razorpay_signature) {
    // Update your DB to mark course as purchased by user
    res.json({ success: true, message: "Payment verified" });
  } else {
    res.status(400).json({ success: false, message: "Invalid signature" });
  }
});
module.exports = router;