import express from 'express';
import mongoose from 'mongoose';
import { Slot } from '../models/Slot.js';

const router = express.Router();

// Safe helper to find slot by ObjectId or string ID
const findSlotById = async (id) => {
  if (!id) return null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const slot = await Slot.findById(id);
    if (slot) return slot;
  }
  return await Slot.findOne({ startTime: id });
};

// GET ALL SLOTS
router.get('/', async (req, res) => {
  try {
    const slots = await Slot.find().sort({ startTime: 1 });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE SLOT (Admin)
router.post('/', async (req, res) => {
  try {
    const { startTime, endTime, capacity } = req.body;
    const slot = await Slot.create({
      startTime,
      endTime,
      capacity: Number(capacity) || 10,
      bookedCount: 0,
      active: true
    });
    res.status(201).json({ success: true, slot });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE SLOT CAPACITY / ACTIVE STATUS
router.put('/:id', async (req, res) => {
  try {
    const { capacity, active } = req.body;
    const slot = await findSlotById(req.params.id);
    if (!slot) return res.status(404).json({ error: 'Slot not found' });

    if (capacity !== undefined) slot.capacity = Number(capacity);
    if (active !== undefined) slot.active = Boolean(active);

    await slot.save();
    res.json({ success: true, slot });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
