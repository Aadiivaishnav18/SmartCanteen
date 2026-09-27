import express from 'express';
import mongoose from 'mongoose';
import { Food } from '../models/Food.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Helper to safely find food by ObjectId or string ID
const findFoodById = async (id) => {
  if (!id) return null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const food = await Food.findById(id);
    if (food) return food;
  }
  return await Food.findOne({ $or: [{ name: id }, { _id: id }] });
};

// GET CATEGORIES - GET /api/foods/categories & GET /api/menu/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = ['breakfast', 'lunch', 'snacks', 'beverages', 'desserts'];
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// BULK PRICE UPDATE - PATCH /api/foods/bulk-price & PATCH /api/menu/bulk-price
router.patch('/bulk-price', protect, authorize('admin'), async (req, res) => {
  try {
    const { percentage, fixedAmount, category } = req.body;
    let filter = {};
    if (category && category !== 'All') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    const foods = await Food.find(filter);
    for (const food of foods) {
      if (percentage) {
        food.price = Math.max(1, Math.round(food.price * (1 + Number(percentage) / 100)));
      } else if (fixedAmount) {
        food.price = Math.max(1, food.price + Number(fixedAmount));
      }
      await food.save();
    }

    res.json({ success: true, count: foods.length, message: `Updated prices for ${foods.length} items.` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET ALL FOODS (WITH SEARCH, CATEGORY FILTER & PAGINATION)
router.get('/', async (req, res) => {
  try {
    const { category, search, page, limit } = req.query;
    let query = {};
    if (category && category !== 'All') {
      query.category = new RegExp(`^${category}$`, 'i');
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let foodsQuery = Food.find(query).sort({ category: 1, name: 1 });

    if (page && limit) {
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.max(1, parseInt(limit));
      const skip = (pageNum - 1) * limitNum;
      const total = await Food.countDocuments(query);
      const foods = await foodsQuery.skip(skip).limit(limitNum);
      return res.json({
        success: true,
        foods,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1
        }
      });
    }

    const foods = await foodsQuery;
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SPECIFIC ITEM - GET /api/foods/:id & GET /api/menu/:id
router.get('/:id', async (req, res) => {
  try {
    const food = await findFoodById(req.params.id);
    if (!food) return res.status(404).json({ error: 'Food item not found' });
    res.json({ success: true, food });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE FOOD ITEM (Admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, category, description, price, stock, image, available, prepTimeMinutes, preparationTime, tags } = req.body;
    const stockVal = Number(stock);
    const isAvailable = stockVal > 0 && (available !== false);

    const food = await Food.create({
      name,
      category: category || 'snacks',
      description,
      price: Number(price),
      stock: stockVal,
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
      available: isAvailable,
      isAvailable: isAvailable,
      prepTimeMinutes: Number(prepTimeMinutes || preparationTime) || 10,
      preparationTime: Number(preparationTime || prepTimeMinutes) || 10,
      tags: Array.isArray(tags) ? tags : ['vegetarian']
    });

    res.status(201).json({ success: true, food });
  } catch (err) {
    res.status(400).json({ error: 'Error creating food item: ' + err.message });
  }
});

// UPDATE FOOD ITEM (Admin)
router.put('/:id', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { name, category, description, price, stock, image, available, isAvailable, prepTimeMinutes, preparationTime, tags } = req.body;
    const food = await findFoodById(req.params.id);
    if (!food) return res.status(404).json({ error: 'Food item not found' });

    if (name) food.name = name;
    if (category) food.category = category;
    if (description) food.description = description;
    if (price !== undefined) food.price = Number(price);
    if (stock !== undefined) {
      food.stock = Math.max(0, Number(stock));
    }
    if (image) food.image = image;
    
    const reqAvailable = available !== undefined ? available : isAvailable;
    if (reqAvailable !== undefined) {
      food.available = Boolean(reqAvailable) && food.stock > 0;
      food.isAvailable = food.available;
    } else {
      food.available = food.stock > 0;
      food.isAvailable = food.available;
    }

    if (prepTimeMinutes !== undefined || preparationTime !== undefined) {
      const pTime = Number(prepTimeMinutes || preparationTime) || 10;
      food.prepTimeMinutes = pTime;
      food.preparationTime = pTime;
    }
    if (tags && Array.isArray(tags)) food.tags = tags;

    await food.save();
    res.json({ success: true, food });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH STOCK LEVEL (Staff/Admin)
router.patch('/:id/stock', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const stockVal = Math.max(0, Number(req.body.stock));
    const food = await findFoodById(req.params.id);
    if (!food) return res.status(404).json({ error: 'Food item not found' });

    food.stock = stockVal;
    food.available = stockVal > 0;
    food.isAvailable = stockVal > 0;
    await food.save();

    res.json({ success: true, food });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH TOGGLE AVAILABILITY
router.patch('/:id/toggle', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const food = await findFoodById(req.params.id);
    if (!food) return res.status(404).json({ error: 'Food item not found' });

    food.available = !food.available;
    food.isAvailable = food.available;
    await food.save();
    res.json({ success: true, food });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE FOOD ITEM (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const food = await findFoodById(req.params.id);
    if (food) {
      await Food.deleteOne({ _id: food._id });
    }
    res.json({ success: true, message: 'Food item deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
