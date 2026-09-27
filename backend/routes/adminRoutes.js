import express from 'express';
import { Order } from '../models/Order.js';
import { Food } from '../models/Food.js';
import { Slot } from '../models/Slot.js';
import { User } from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// ADMIN SALES ANALYTICS - GET /api/admin/analytics/sales
router.get('/analytics/sales', protect, authorize('admin'), async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: { $ne: 'failed' } });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Revenue per category calculation
    const categoryRevenue = {};
    orders.forEach(o => {
      (o.items || []).forEach(item => {
        const cat = item.category || 'Snacks';
        categoryRevenue[cat] = (categoryRevenue[cat] || 0) + (item.subtotal || item.price * item.quantity);
      });
    });

    res.json({
      success: true,
      sales: {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        categoryRevenue,
        peakTime: '12:30 PM - 01:30 PM'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN ITEM ANALYTICS - GET /api/admin/analytics/items
router.get('/analytics/items', protect, authorize('admin'), async (req, res) => {
  try {
    const orders = await Order.find({ status: { $ne: 'cancelled' } });
    const itemMap = {};

    orders.forEach(order => {
      (order.items || []).forEach(item => {
        const key = item.name || 'Unknown Item';
        if (!itemMap[key]) {
          itemMap[key] = { name: key, quantitySold: 0, totalRevenue: 0 };
        }
        itemMap[key].quantitySold += (item.quantity || 1);
        itemMap[key].totalRevenue += (item.subtotal || (item.price * item.quantity));
      });
    });

    const popularItems = Object.values(itemMap).sort((a, b) => b.quantitySold - a.quantitySold);

    res.json({
      success: true,
      items: popularItems
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN OVERVIEW ANALYTICS - GET /api/admin/analytics/overview
router.get('/analytics/overview', protect, authorize('admin'), async (req, res) => {
  try {
    const [totalOrders, totalUsers, foodCount, lowStockCount, slots] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'student' }),
      Food.countDocuments(),
      Food.countDocuments({ stock: { $lte: 5 } }),
      Slot.find()
    ]);

    const orders = await Order.find({ paymentStatus: { $ne: 'failed' } });
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const totalSlotCapacity = slots.reduce((sum, s) => sum + (s.capacity || 0), 0);
    const totalSlotBooked = slots.reduce((sum, s) => sum + (s.bookedCount || 0), 0);
    const slotUtilizationRate = totalSlotCapacity > 0 ? Math.round((totalSlotBooked / totalSlotCapacity) * 100) : 0;

    res.json({
      success: true,
      overview: {
        totalRevenue,
        totalOrders,
        totalStudents: totalUsers,
        totalMenuItems: foodCount,
        lowStockItemsCount: lowStockCount,
        slotUtilizationRate,
        peakHours: '12:00 PM – 02:00 PM'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
