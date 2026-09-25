import express from 'express';
import mongoose from 'mongoose';
import { Food } from '../models/Food.js';

const router = express.Router();

// Helper to safely find food by ObjectId or string ID
const findFoodById = async (id) => {
  if (!id) return null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const food = await Food.findById(id);
    if (food) return food;
  }
  return await Food.findOne({ name: id });
};

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

    const food = await findFoodById(req.params.id);
    if (!food) return res.status(404).json({ error: 'Food item not found' });

    if (name) food.name = name;
    if (category) food.category = category;
    if (description) food.description = description;
    if (price !== undefined) food.price = Number(price);
    food.stock = stockVal;
    if (image) food.image = image;
    food.available = isAvailable;
    if (prepTimeMinutes !== undefined) food.prepTimeMinutes = Number(prepTimeMinutes) || 10;

    await food.save();
    res.json({ success: true, food });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH STOCK LEVEL (Staff)
router.patch('/:id/stock', async (req, res) => {
  try {
    const stockVal = Math.max(0, Number(req.body.stock));
    const food = await findFoodById(req.params.id);
    if (!food) return res.status(404).json({ error: 'Food item not found' });

    food.stock = stockVal;
    food.available = stockVal > 0;
    await food.save();

    res.json({ success: true, food });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH TOGGLE AVAILABILITY
router.patch('/:id/toggle', async (req, res) => {
  try {
    const food = await findFoodById(req.params.id);
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
    const food = await findFoodById(req.params.id);
    if (food) {
      await Food.deleteOne({ _id: food._id });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
