import express from 'express';
import { Cart } from '../models/Cart.js';
import { Food } from '../models/Food.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Helper to get or create cart for user
const getUserCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.menuItem');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [], totalPrice: 0, totalItems: 0 });
  }
  return cart;
};

// GET CART - GET /api/cart
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) {
      return res.json({ success: true, cart: { items: [], totalPrice: 0, totalItems: 0 } });
    }
    const cart = await getUserCart(userId);
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD ITEM TO CART - POST /api/cart/add
router.post('/add', protect, async (req, res) => {
  try {
    const { userId: reqUserId, menuItemId, foodId, quantity = 1 } = req.body;
    const userId = req.user?.id || reqUserId;

    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    const targetFoodId = menuItemId || foodId;
    const food = await Food.findById(targetFoodId) || await Food.findOne({ name: targetFoodId });
    if (!food) {
      return res.status(404).json({ error: 'Menu item not found or unavailable' });
    }

    if (food.stock <= 0 || !food.available) {
      return res.status(400).json({ error: `${food.name} is currently out of stock.` });
    }

    const cart = await Cart.findOne({ user: userId }) || new Cart({ user: userId, items: [] });

    const existingIndex = cart.items.findIndex(i => String(i.menuItem) === String(food._id));
    const currentQty = existingIndex > -1 ? cart.items[existingIndex].quantity : 0;
    const newQty = currentQty + Number(quantity);

    if (newQty > food.stock) {
      return res.status(400).json({ 
        error: `Cannot add ${quantity} more. Stock limit for ${food.name} is ${food.stock} (already in cart: ${currentQty}).` 
      });
    }

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity = newQty;
      cart.items[existingIndex].price = food.price;
    } else {
      cart.items.push({
        menuItem: food._id,
        quantity: Number(quantity),
        price: food.price
      });
    }

    cart.calculateTotals();
    await cart.save();
    await cart.populate('items.menuItem');

    res.json({ success: true, cart });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE ITEM QUANTITY - PUT /api/cart/update
router.put('/update', protect, async (req, res) => {
  try {
    const { userId: reqUserId, menuItemId, foodId, quantity } = req.body;
    const userId = req.user?.id || reqUserId;

    const targetFoodId = menuItemId || foodId;
    const food = await Food.findById(targetFoodId) || await Food.findOne({ name: targetFoodId });
    if (!food) return res.status(404).json({ error: 'Item not found' });

    const newQty = Number(quantity);
    if (newQty > food.stock) {
      return res.status(400).json({ error: `Requested quantity exceeds available stock (${food.stock}).` });
    }

    const cart = await getUserCart(userId);
    if (newQty <= 0) {
      cart.items = cart.items.filter(i => String(i.menuItem._id || i.menuItem) !== String(food._id));
    } else {
      const item = cart.items.find(i => String(i.menuItem._id || i.menuItem) === String(food._id));
      if (item) item.quantity = newQty;
    }

    cart.calculateTotals();
    await cart.save();
    await cart.populate('items.menuItem');

    res.json({ success: true, cart });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// REMOVE ITEM FROM CART - DELETE /api/cart/remove
router.delete('/remove', protect, async (req, res) => {
  try {
    const { userId: reqUserId, menuItemId, foodId } = req.body;
    const userId = req.user?.id || reqUserId || req.query.userId;
    const targetId = menuItemId || foodId || req.query.menuItemId;

    const cart = await getUserCart(userId);
    cart.items = cart.items.filter(i => String(i.menuItem._id || i.menuItem) !== String(targetId));

    cart.calculateTotals();
    await cart.save();
    await cart.populate('items.menuItem');

    res.json({ success: true, cart });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// CLEAR ENTIRE CART - DELETE /api/cart/clear
router.delete('/clear', protect, async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId || req.query.userId;
    const cart = await getUserCart(userId);
    cart.items = [];
    cart.totalPrice = 0;
    cart.totalItems = 0;
    await cart.save();

    res.json({ success: true, message: 'Cart cleared successfully', cart });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
