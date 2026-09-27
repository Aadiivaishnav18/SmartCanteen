import express from 'express';
import { Order } from '../models/Order.js';
import { Food } from '../models/Food.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// GET STAFF ORDERS - GET /api/staff/orders
router.get('/orders', protect, authorize('staff', 'admin'), async (req, res) => {
  try {
    const { status, pickupSlotId } = req.query;
    let query = {};
    if (status && status !== 'All') {
      query.status = new RegExp(`^${status}$`, 'i');
    }
    if (pickupSlotId) {
      query.pickupSlotId = pickupSlotId;
    }

    const orders = await Order.find(query).sort({ pickupSlotTime: 1, createdAt: 1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE SINGLE ORDER STATUS - PUT /api/staff/orders/:id/status
router.put('/orders/:id/status', protect, authorize('staff', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id) || await Order.findOne({ orderId: req.params.id });

    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = status.toLowerCase();
    const now = new Date();
    if (order.status === 'accepted') order.acceptedAt = now;
    if (order.status === 'preparing') order.preparingAt = now;
    if (order.status === 'ready') order.readyAt = now;
    if (order.status === 'collected') order.collectedAt = now;

    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// BULK ORDER STATUS UPDATE - PATCH /api/staff/orders/bulk-status
router.patch('/orders/bulk-status', protect, authorize('staff', 'admin'), async (req, res) => {
  try {
    const { orderIds, status } = req.body;
    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ error: 'orderIds array is required.' });
    }

    const normStatus = status.toLowerCase();
    const now = new Date();
    const updateFields = { status: normStatus };

    if (normStatus === 'accepted') updateFields.acceptedAt = now;
    if (normStatus === 'preparing') updateFields.preparingAt = now;
    if (normStatus === 'ready') updateFields.readyAt = now;
    if (normStatus === 'collected') updateFields.collectedAt = now;

    const result = await Order.updateMany(
      { $or: [{ _id: { $in: orderIds } }, { orderId: { $in: orderIds } }, { orderNumber: { $in: orderIds } }] },
      { $set: updateFields }
    );

    res.json({ success: true, modifiedCount: result.modifiedCount, message: `Updated ${result.modifiedCount} orders to ${status}` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// LOW STOCK ALERTS - GET /api/staff/alerts/low-stock
router.get('/alerts/low-stock', protect, authorize('staff', 'admin'), async (req, res) => {
  try {
    const lowStockItems = await Food.find({ stock: { $lte: 5 } }).sort({ stock: 1 });
    res.json({ success: true, count: lowStockItems.length, items: lowStockItems });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// STAFF ANALYTICS - GET /api/staff/analytics
router.get('/analytics', protect, authorize('staff', 'admin'), async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const readyOrders = await Order.countDocuments({ status: { $in: ['ready', 'Ready'] } });
    const collectedOrders = await Order.countDocuments({ status: { $in: ['collected', 'Collected'] } });
    
    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

    res.json({
      success: true,
      analytics: {
        totalOrders,
        readyOrders,
        collectedOrders,
        totalRevenue,
        peakOrderTime: '12:30 PM - 01:30 PM'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
