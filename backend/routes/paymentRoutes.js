import express from 'express';
import { Order } from '../models/Order.js';
import mongoose from 'mongoose';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const findOrderByIdOrNumber = async (id) => {
  if (!id) return null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const order = await Order.findById(id);
    if (order) return order;
  }
  return await Order.findOne({ $or: [{ orderId: id }, { orderNumber: id }] });
};

// PROCESS FAKE PAYMENT - POST /api/payment/fake-payment
router.post('/fake-payment', protect, async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required to process payment.' });
    }

    const order = await findOrderByIdOrNumber(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Simulate Payment with 90% success rate
    const isSuccessful = Math.random() < 0.9;

    if (paymentMethod) {
      order.paymentMethod = paymentMethod;
    }

    if (isSuccessful) {
      order.paymentStatus = 'completed';
      order.status = 'accepted';
      order.acceptedAt = new Date();
      await order.save();

      return res.json({
        success: true,
        isSuccessful: true,
        message: 'Payment processed successfully!',
        paymentStatus: 'completed',
        orderStatus: 'accepted',
        order
      });
    } else {
      order.paymentStatus = 'failed';
      // Order status remains 'placed' so student can retry or cancel
      order.status = 'placed';
      await order.save();

      return res.json({
        success: false,
        isSuccessful: false,
        error: 'Payment transaction failed. Please retry your payment or select another payment method.',
        paymentStatus: 'failed',
        orderStatus: 'placed',
        order
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Payment gateway error: ' + err.message });
  }
});

// GET PAYMENT STATUS - GET /api/payment/status/:id
router.get('/status/:id', async (req, res) => {
  try {
    const order = await findOrderByIdOrNumber(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({
      success: true,
      paymentStatus: order.paymentStatus,
      status: order.status,
      paymentMethod: order.paymentMethod,
      totalAmount: order.totalAmount,
      orderNumber: order.orderNumber || order.orderId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
