import express from 'express';
import { Order } from '../models/Order.js';
import { Food } from '../models/Food.js';
import { Slot } from '../models/Slot.js';

const router = express.Router();

// GET ORDERS WITH PAGINATION, SERVER-SIDE DATE FILTERING, & SORTING
router.get('/', async (req, res) => {
  try {
    const { userId, status, startDate, endDate, page = 1, limit = 10, sortBy = 'createdAt' } = req.query;

    let query = {};

    if (userId) {
      query.userId = userId;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate).toISOString();
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate).toISOString();
      }
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ [sortBy]: sortBy === 'pickupSlotTime' ? 1 : -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      orders,
      pagination: {
        total: totalOrders,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalOrders / limitNum),
        hasMore: pageNum * limitNum < totalOrders
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PLACE ORDER (WITH BACKEND STOCK & SLOT CAPACITY VALIDATION)
router.post('/', async (req, res) => {
  try {
    const { userId, userName, userEmail, items, pickupSlotId, paymentMethod } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Order cart cannot be empty.' });
    }

    // 1. Slot Capacity Validation
    const slot = await Slot.findById(pickupSlotId);
    if (!slot) {
      return res.status(400).json({ error: 'Selected pickup time slot does not exist.' });
    }
    if (!slot.active) {
      return res.status(400).json({ error: 'Selected pickup slot is inactive.' });
    }
    if (slot.bookedCount >= slot.capacity) {
      return res.status(400).json({ 
        error: `Pickup slot (${slot.startTime} – ${slot.endTime}) has reached full capacity (${slot.bookedCount}/${slot.capacity}). Please choose another slot.` 
      });
    }

    // 2. Backend Stock Validation
    for (const item of items) {
      const food = await Food.findById(item.foodId || item.id);
      if (!food) {
        return res.status(400).json({ error: `Food item ${item.name} is no longer available.` });
      }
      if (item.quantity > food.stock) {
        return res.status(400).json({ 
          error: `Insufficient stock available for ${food.name}. Available: ${food.stock}, Requested: ${item.quantity}.` 
        });
      }
    }

    // 3. Deduct Stock in MongoDB
    for (const item of items) {
      const food = await Food.findById(item.foodId || item.id);
      const newStock = Math.max(0, food.stock - item.quantity);
      food.stock = newStock;
      food.available = newStock > 0;
      await food.save();
    }

    // 4. Increment Slot Booking Count
    slot.bookedCount = slot.bookedCount + 1;
    await slot.save();

    // 5. Create Order Document
    const orderId = `SC-${Math.floor(1000 + Math.random() * 9000)}`;
    const subtotal = items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const totalAmount = Math.round(subtotal * 1.05); // 5% GST tax

    const activeOrdersCount = await Order.countDocuments({ status: { $in: ['Placed', 'Accepted', 'Preparing'] } });

    const newOrder = await Order.create({
      orderId,
      userId: userId || 'usr-1',
      userName: userName || 'Aditya Sharma',
      userEmail: userEmail || 'student@college.edu',
      items,
      totalAmount,
      pickupSlotId: slot._id,
      pickupSlotTime: `${slot.startTime} – ${slot.endTime}`,
      status: 'Placed',
      queuePosition: activeOrdersCount + 1,
      counterNumber: 'Counter 1 (Express Pickup)',
      estimatedPrepTime: '10-12 mins',
      paymentMethod: paymentMethod || 'Campus Wallet'
    });

    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    res.status(400).json({ error: 'Order processing failed: ' + err.message });
  }
});

// STRICT LIFECYCLE STATE PROGRESSION: Placed -> Accepted -> Preparing -> Ready -> Collected
const VALID_TRANSITIONS = {
  'Placed': 'Accepted',
  'Accepted': 'Preparing',
  'Preparing': 'Ready',
  'Ready': 'Collected'
};

router.patch('/:id/status', async (req, res) => {
  try {
    const { status: targetStatus } = req.body;
    const order = await Order.findOne({ $or: [{ _id: req.params.id }, { orderId: req.params.id }] });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const allowedNext = VALID_TRANSITIONS[order.status];
    if (allowedNext !== targetStatus && targetStatus !== 'Cancelled') {
      return res.status(400).json({ 
        error: `Invalid status transition! Cannot jump from state "${order.status}" to "${targetStatus}".` 
      });
    }

    order.status = targetStatus;
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// CANCEL ORDER & RESTORE STOCK + SLOT CAPACITY
router.post('/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findOne({ $or: [{ _id: req.params.id }, { orderId: req.params.id }] });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.status === 'Collected' || order.status === 'Cancelled') {
      return res.status(400).json({ error: `Cannot cancel order in status ${order.status}` });
    }

    // Restore Stock
    for (const item of order.items) {
      const food = await Food.findById(item.foodId);
      if (food) {
        food.stock += item.quantity;
        food.available = true;
        await food.save();
      }
    }

    // Release Slot Capacity
    const slot = await Slot.findById(order.pickupSlotId);
    if (slot) {
      slot.bookedCount = Math.max(0, slot.bookedCount - 1);
      await slot.save();
    }

    order.status = 'Cancelled';
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
