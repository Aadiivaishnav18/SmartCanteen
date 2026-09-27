import express from 'express';
import mongoose from 'mongoose';
import { Slot } from '../models/Slot.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Safe helper to find slot by ObjectId or string ID
const findSlotById = async (id) => {
  if (!id) return null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const slot = await Slot.findById(id);
    if (slot) return slot;
  }
  return await Slot.findOne({ $or: [{ startTime: id }, { _id: id }] });
};

// GET ALL SLOTS - GET /api/slots
router.get('/', async (req, res) => {
  try {
    const slots = await Slot.find().sort({ startTime: 1 });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE SINGLE SLOT (Admin) - POST /api/slots
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { startTime, endTime, capacity, active, estimatedPrepTime } = req.body;
    const slot = await Slot.create({
      startTime,
      endTime,
      capacity: Number(capacity) || 10,
      bookedCount: 0,
      ordersCount: 0,
      active: active !== undefined ? Boolean(active) : true,
      isActive: active !== undefined ? Boolean(active) : true,
      estimatedPrepTime: Number(estimatedPrepTime) || 15
    });
    res.status(201).json({ success: true, slot });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// CREATE BULK SLOTS (Admin) - POST /api/slots/bulk
router.post('/bulk', protect, authorize('admin'), async (req, res) => {
  try {
    const { slots } = req.body; // Array of slot objects { startTime, endTime, capacity }
    if (!Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ error: 'Slots array is required for bulk creation.' });
    }

    const createdSlots = await Slot.insertMany(slots.map(s => ({
      startTime: s.startTime,
      endTime: s.endTime,
      capacity: Number(s.capacity) || 10,
      bookedCount: 0,
      ordersCount: 0,
      active: true,
      isActive: true
    })));

    res.status(201).json({ success: true, count: createdSlots.length, slots: createdSlots });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE SLOT CAPACITY / ACTIVE STATUS - PUT /api/slots/:id
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { capacity, active, isActive, startTime, endTime } = req.body;
    const slot = await findSlotById(req.params.id);
    if (!slot) return res.status(404).json({ error: 'Slot not found' });

    if (capacity !== undefined) slot.capacity = Number(capacity);
    
    const reqActive = active !== undefined ? active : isActive;
    if (reqActive !== undefined) {
      slot.active = Boolean(reqActive);
      slot.isActive = Boolean(reqActive);
    }

    if (startTime) slot.startTime = startTime;
    if (endTime) slot.endTime = endTime;

    await slot.save();
    res.json({ success: true, slot });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE SLOT (Admin) - DELETE /api/slots/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const slot = await findSlotById(req.params.id);
    if (slot) {
      await Slot.deleteOne({ _id: slot._id });
    }
    res.json({ success: true, message: 'Pickup slot deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
