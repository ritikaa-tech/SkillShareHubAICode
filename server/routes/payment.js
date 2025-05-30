// routes/payments.js
const Razorpay = require('razorpay');
const express = require('express');
const crypto = require('crypto');
const Order = require('../models/Order');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const auth = require('../middleware/auth');
const router = express.Router();

// Check if Razorpay credentials are available
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
  console.warn('Razorpay credentials are missing. Payment functionality will not work.');
}

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_I32MxpVUddAgQo',
  key_secret: process.env.RAZORPAY_SECRET || 'your_razorpay_secret_key_here',
});

// Create order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { courseId } = req.body;
    
    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    const options = {
      amount: course.price * 100, // amount in paise
      currency: 'INR',
      receipt: `rcpt_${req.user._id}_${courseId}`,
    };

    const order = await razorpay.orders.create(options);

    // Save order to DB
    const newOrder = new Order({
      orderid: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: 'PENDING',
      userId: req.user._id,
      courseId: courseId,
    });

    await newOrder.save();

    res.json({ 
      success: true, 
      order,
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_I32MxpVUddAgQo'
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify payment
router.post('/verify', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET || 'your_razorpay_secret_key_here')
      .update(sign.toString())
      .digest('hex');

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // Update order status
    const order = await Order.findOne({ orderid: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = 'COMPLETED';
    order.paymentid = razorpay_payment_id;
    await order.save();

    // Create enrollment
    const enrollment = new Enrollment({
      student: req.user._id,
      course: order.courseId,
      status: 'active',
      enrolledAt: new Date()
    });

    await enrollment.save();

    // Update course enrolled students
    await Course.findByIdAndUpdate(order.courseId, {
      $addToSet: { enrolledStudents: req.user._id }
    });

    res.json({ 
      success: true, 
      message: "Payment verified and enrollment completed",
      enrollment
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;