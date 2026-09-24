import express from 'express';
import { Slot } from '../models/Slot.js';

const router = express.Router();

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
    const slot = await Slot.findByIdAndUpdate(
      req.params.id,
      { capacity: Number(capacity), active: Boolean(active) },
      { new: true }
    );
    if (!slot) return res.status(404).json({ error: 'Slot not found' });
    res.json({ success: true, slot });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
