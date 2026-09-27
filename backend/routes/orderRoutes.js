import express from 'express';
import mongoose from 'mongoose';
import { Order } from '../models/Order.js';
import { Food } from '../models/Food.js';
import { Slot } from '../models/Slot.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Safe helper to find order by _id or orderId / orderNumber
const findOrderByIdOrNumber = async (id) => {
  if (!id) return null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const order = await Order.findById(id);
    if (order) return order;
  }
  return await Order.findOne({ $or: [{ orderId: id }, { orderNumber: id }] });
};

// Safe helper to find food item
const findFoodByIdOrString = async (id) => {
  if (!id) return null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const food = await Food.findById(id);
    if (food) return food;
  }
  return await Food.findOne({ $or: [{ _id: id }, { name: id }] });
};

// Safe helper to find slot
const findSlotByIdOrString = async (id) => {
  if (!id) return null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const slot = await Slot.findById(id);
    if (slot) return slot;
  }
  return await Slot.findOne({ startTime: id });
};

// GET ORDERS WITH PAGINATION, FILTERS & SORTING
router.get('/', protect, async (req, res) => {
  try {
    const { userId, status, startDate, endDate, search, page = 1, limit = 10, sortBy = 'createdAt' } = req.query;

    let query = {};

    if (userId) {
      query.userId = userId;
    }

    if (status && status !== 'All') {
      query.status = new RegExp(`^${status}$`, 'i');
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { orderId: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } }
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
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
        totalPages: Math.ceil(totalOrders / limitNum) || 1,
        hasMore: pageNum * limitNum < totalOrders
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SPECIFIC ORDER DETAILS - GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await findOrderByIdOrNumber(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ORDER STATUS - GET /api/orders/:id/status
router.get('/:id/status', async (req, res) => {
  try {
    const order = await findOrderByIdOrNumber(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.json({
      success: true,
      status: order.status,
      paymentStatus: order.paymentStatus,
      queuePosition: order.queuePosition,
      estimatedPrepTime: order.estimatedPrepTime,
      pickupSlotTime: order.pickupSlotTime,
      updatedAt: order.updatedAt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE / PLACE ORDER - POST /api/orders
router.post('/', protect, async (req, res) => {
  try {
    const { userId, userName, userEmail, items, pickupSlotId, paymentMethod, specialRequests } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Order cart cannot be empty.' });
    }

    // 1. Slot Capacity Validation
    const slot = await findSlotByIdOrString(pickupSlotId);
    if (!slot) {
      return res.status(400).json({ error: 'Selected pickup time slot does not exist.' });
    }
    if (slot.active === false || slot.isActive === false) {
      return res.status(400).json({ error: 'Selected pickup slot is inactive.' });
    }
    if (slot.bookedCount >= slot.capacity) {
      return res.status(400).json({ 
        error: `Pickup slot (${slot.startTime} – ${slot.endTime}) has reached full capacity (${slot.bookedCount}/${slot.capacity}). Please select another time slot.` 
      });
    }

    // 2. Stock Availability Validation
    for (const item of items) {
      const food = await findFoodByIdOrString(item.foodId || item.id || item.menuItem);
      if (!food) {
        return res.status(400).json({ error: `Food item ${item.name || 'requested'} is no longer available.` });
      }
      if (item.quantity > food.stock) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${food.name}. Available: ${food.stock}, Requested: ${item.quantity}.` 
        });
      }
    }

    // 3. Atomically Deduct Stock in Database
    for (const item of items) {
      const food = await findFoodByIdOrString(item.foodId || item.id || item.menuItem);
      if (food) {
        food.stock = Math.max(0, food.stock - item.quantity);
        food.available = food.stock > 0;
        food.isAvailable = food.available;
        await food.save();
      }
    }

    // 4. Increment Slot Booking Count
    slot.bookedCount = slot.bookedCount + 1;
    slot.ordersCount = slot.bookedCount;
    await slot.save();

    // 5. Generate Order Number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const subtotal = items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const totalAmount = Math.round(subtotal * 1.05); // 5% GST tax

    const activeOrdersCount = await Order.countDocuments({ 
      status: { $in: ['placed', 'accepted', 'preparing', 'Placed', 'Accepted', 'Preparing'] } 
    });

    const formattedItems = items.map(i => ({
      menuItem: i.menuItem || i.foodId || i.id,
      foodId: i.foodId || i.id || i.menuItem,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      subtotal: i.price * i.quantity,
      image: i.image || ''
    }));

    const newOrder = await Order.create({
      orderNumber,
      orderId: orderNumber,
      userId: userId || req.user?.id || 'usr-1',
      student: mongoose.Types.ObjectId.isValid(userId) ? userId : undefined,
      userName: userName || req.user?.name || 'Student User',
      userEmail: userEmail || req.user?.email || 'student@college.edu',
      items: formattedItems,
      totalAmount,
      pickupSlotId: slot._id.toString(),
      pickupSlot: slot._id,
      pickupSlotTime: `${slot.startTime} – ${slot.endTime}`,
      pickupTime: {
        date: slot.date || new Date(),
        startTime: slot.startTime,
        endTime: slot.endTime
      },
      status: 'placed',
      paymentStatus: 'pending',
      paymentMethod: paymentMethod || 'fake-payment',
      queuePosition: activeOrdersCount + 1,
      counterNumber: 'Counter 1 (Express Pickup)',
      estimatedPrepTime: '10-15 mins',
      specialRequests: specialRequests || ''
    });

    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    res.status(400).json({ error: 'Order creation failed: ' + err.message });
  }
});

// UPDATE ORDER STATUS (State machine enforcement)
const VALID_STATUSES = ['placed', 'accepted', 'preparing', 'ready', 'collected', 'cancelled', 'Placed', 'Accepted', 'Preparing', 'Ready', 'Collected', 'Cancelled'];

router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status: targetStatus } = req.body;
    const order = await findOrderByIdOrNumber(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (!VALID_STATUSES.includes(targetStatus)) {
      return res.status(400).json({ 
        error: `Invalid status "${targetStatus}". Must be one of: ${VALID_STATUSES.join(', ')}.` 
      });
    }

    const normTarget = targetStatus.toLowerCase();

    order.status = normTarget;
    const now = new Date();

    if (normTarget === 'accepted') order.acceptedAt = now;
    if (normTarget === 'preparing') order.preparingAt = now;
    if (normTarget === 'ready') order.readyAt = now;
    if (normTarget === 'collected') order.collectedAt = now;
    if (normTarget === 'cancelled') order.cancelledAt = now;

    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// CANCEL ORDER (Only if status is 'placed' or 'Placed')
const handleCancelOrder = async (req, res) => {
  try {
    const order = await findOrderByIdOrNumber(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const currentStatus = order.status.toLowerCase();
    if (currentStatus !== 'placed') {
      return res.status(400).json({ 
        error: `Cannot cancel order in status "${order.status}". Orders can only be cancelled when in "placed" status.` 
      });
    }

    // 1. Automatic Stock Restoration
    for (const item of order.items) {
      const food = await findFoodByIdOrString(item.foodId || item.menuItem);
      if (food) {
        food.stock += item.quantity;
        food.available = true;
        food.isAvailable = true;
        await food.save();
      }
    }

    // 2. Release Pickup Slot Capacity
    if (order.pickupSlotId) {
      const slot = await findSlotByIdOrString(order.pickupSlotId);
      if (slot) {
        slot.bookedCount = Math.max(0, slot.bookedCount - 1);
        slot.ordersCount = slot.bookedCount;
        await slot.save();
      }
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = req.body?.reason || 'Cancelled by student';
    if (order.paymentStatus === 'completed') {
      order.paymentStatus = 'refunded';
    }
    await order.save();

    res.json({ success: true, message: 'Order cancelled and stock restored successfully.', order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

router.put('/:id/cancel', protect, handleCancelOrder);
router.post('/:id/cancel', protect, handleCancelOrder);

export default router;
