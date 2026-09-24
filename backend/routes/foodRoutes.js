import express from 'express';
import { Food } from '../models/Food.js';

const router = express.Router();

// GET ALL FOODS
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const foods = await Food.find(query).sort({ category: 1, name: 1 });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE FOOD ITEM (Admin)
router.post('/', async (req, res) => {
  try {
    const { name, category, description, price, stock, image, available, prepTimeMinutes } = req.body;
    const isAvailable = Number(stock) > 0 && (available !== false);

    const food = await Food.create({
      name,
      category,
      description,
      price: Number(price),
      stock: Number(stock),
      image,
      available: isAvailable,
      prepTimeMinutes: Number(prepTimeMinutes) || 10
    });

    res.status(201).json({ success: true, food });
  } catch (err) {
    res.status(400).json({ error: 'Error creating food item: ' + err.message });
  }
});

// UPDATE FOOD ITEM (Admin/Staff)
router.put('/:id', async (req, res) => {
  try {
    const { name, category, description, price, stock, image, available, prepTimeMinutes } = req.body;
    const stockVal = Number(stock);
    const isAvailable = stockVal > 0 && (available !== false);

    const food = await Food.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        description,
        price: Number(price),
        stock: stockVal,
        image,
        available: isAvailable,
        prepTimeMinutes: Number(prepTimeMinutes) || 10
      },
      { new: true }
    );

    if (!food) return res.status(404).json({ error: 'Food item not found' });
    res.json({ success: true, food });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH STOCK LEVEL (Staff)
router.patch('/:id/stock', async (req, res) => {
  try {
    const stockVal = Math.max(0, Number(req.body.stock));
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      { stock: stockVal, available: stockVal > 0 },
      { new: true }
    );
    if (!food) return res.status(404).json({ error: 'Food item not found' });
    res.json({ success: true, food });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH TOGGLE AVAILABILITY
router.patch('/:id/toggle', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ error: 'Food item not found' });

    food.available = !food.available;
    await food.save();
    res.json({ success: true, food });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE FOOD ITEM
router.delete('/:id', async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
