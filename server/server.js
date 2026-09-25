import express from 'express';
import cors from 'cors';
import db, { initDb, seedData } from './database.js';

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration for Local & Deployed Frontend (Vercel, custom domains, etc.)
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'https://smart-canteen-nine-opal.vercel.app',
      'http://localhost:1234',
      'http://localhost:3000',
      'http://localhost:5000',
      'http://127.0.0.1:1234',
      'http://127.0.0.1:5000'
    ].filter(Boolean);

    if (
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin) ||
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Initialize DB schema on start
initDb();

// ==================== AUTH ROUTES ====================
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?) AND password = ?').get(email, password);
  if (user) {
    return res.json({ success: true, user });
  }
  return res.status(401).json({ error: 'Invalid campus email or password.' });
});

app.get('/api/users', (req, res) => {
  const users = db.prepare('SELECT id, name, email, role, avatar, rollNumber, department, balance FROM users').all();
  res.json(users);
});

// ==================== FOOD MENU ROUTES ====================
app.get('/api/foods', (req, res) => {
  const foods = db.prepare('SELECT * FROM foods ORDER BY category, name').all();
  const formatted = foods.map(f => ({
    ...f,
    available: Boolean(f.available),
    popular: Boolean(f.popular)
  }));
  res.json(formatted);
});

app.post('/api/foods', (req, res) => {
  const { name, category, description, price, stock, image, available, prepTimeMinutes } = req.body;
  const id = `food-${Date.now()}`;
  const isAvailable = Number(stock) > 0 && available ? 1 : 0;

  const stmt = db.prepare(`
    INSERT INTO foods (id, name, category, description, price, stock, image, available, rating, prepTimeMinutes, popular)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(id, name, category, description, Number(price), Number(stock), image, isAvailable, 4.8, Number(prepTimeMinutes) || 10, 0);

  const newFood = db.prepare('SELECT * FROM foods WHERE id = ?').get(id);
  res.status(201).json({ success: true, food: { ...newFood, available: Boolean(newFood.available) } });
});

app.put('/api/foods/:id', (req, res) => {
  const { id } = req.params;
  const { name, category, description, price, stock, image, available, prepTimeMinutes } = req.body;
  const isAvailable = Number(stock) > 0 && available ? 1 : 0;

  const stmt = db.prepare(`
    UPDATE foods 
    SET name = ?, category = ?, description = ?, price = ?, stock = ?, image = ?, available = ?, prepTimeMinutes = ?
    WHERE id = ?
  `);

  const result = stmt.run(name, category, description, Number(price), Number(stock), image, isAvailable, Number(prepTimeMinutes) || 10, id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Food item not found.' });
  }

  const updatedFood = db.prepare('SELECT * FROM foods WHERE id = ?').get(id);
  res.json({ success: true, food: { ...updatedFood, available: Boolean(updatedFood.available) } });
});

app.patch('/api/foods/:id/stock', (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;
  const stockVal = Math.max(0, Number(stock));
  const isAvailable = stockVal > 0 ? 1 : 0;

  const stmt = db.prepare('UPDATE foods SET stock = ?, available = ? WHERE id = ?');
  stmt.run(stockVal, isAvailable, id);

  const updatedFood = db.prepare('SELECT * FROM foods WHERE id = ?').get(id);
  res.json({ success: true, food: { ...updatedFood, available: Boolean(updatedFood.available) } });
});

app.patch('/api/foods/:id/toggle', (req, res) => {
  const { id } = req.params;
  const food = db.prepare('SELECT * FROM foods WHERE id = ?').get(id);
  if (!food) return res.status(404).json({ error: 'Food item not found.' });

  const newStatus = food.available ? 0 : 1;
  db.prepare('UPDATE foods SET available = ? WHERE id = ?').run(newStatus, id);

  res.json({ success: true, available: Boolean(newStatus) });
});

app.delete('/api/foods/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM foods WHERE id = ?').run(id);
  res.json({ success: true });
});

// ==================== PICKUP SLOTS ROUTES ====================
app.get('/api/slots', (req, res) => {
  const slots = db.prepare('SELECT * FROM slots ORDER BY startTime').all();
  const formatted = slots.map(s => ({
    ...s,
    active: Boolean(s.active)
  }));
  res.json(formatted);
});

app.post('/api/slots', (req, res) => {
  const { startTime, endTime, capacity } = req.body;
  const id = `slot-${Date.now()}`;

  const stmt = db.prepare(`
    INSERT INTO slots (id, startTime, endTime, capacity, bookedCount, active)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(id, startTime, endTime, Number(capacity), 0, 1);
  const newSlot = db.prepare('SELECT * FROM slots WHERE id = ?').get(id);
  res.status(201).json({ success: true, slot: { ...newSlot, active: Boolean(newSlot.active) } });
});

app.put('/api/slots/:id', (req, res) => {
  const { id } = req.params;
  const { capacity, active } = req.body;

  const stmt = db.prepare('UPDATE slots SET capacity = ?, active = ? WHERE id = ?');
  stmt.run(Number(capacity), active ? 1 : 0, id);

  const updatedSlot = db.prepare('SELECT * FROM slots WHERE id = ?').get(id);
  res.json({ success: true, slot: { ...updatedSlot, active: Boolean(updatedSlot.active) } });
});

// ==================== ORDERS & BUSINESS LOGIC API ====================
app.get('/api/orders', (req, res) => {
  const { userId } = req.query;
  let orders;
  if (userId) {
    orders = db.prepare('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC').all(userId);
  } else {
    orders = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all();
  }

  const formatted = orders.map(o => ({
    ...o,
    items: JSON.parse(o.items)
  }));

  res.json(formatted);
});

// ATOMIC ORDER PLACEMENT TRANSACTION WITH STOCK & SLOT VALIDATION
app.post('/api/orders', (req, res) => {
  const { userId, userName, userEmail, items, pickupSlotId, paymentMethod } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ error: 'Order cart cannot be empty.' });
  }

  // Execute database transaction
  const executeOrderTransaction = db.transaction(() => {
    // 1. Slot Capacity Check
    const slot = db.prepare('SELECT * FROM slots WHERE id = ?').get(pickupSlotId);
    if (!slot) {
      throw new Error('Invalid pickup time slot selected.');
    }
    if (!slot.active) {
      throw new Error('Selected pickup slot is currently inactive.');
    }
    if (slot.bookedCount >= slot.capacity) {
      throw new Error(`Pickup Slot (${slot.startTime} – ${slot.endTime}) has reached full capacity (${slot.bookedCount}/${slot.capacity}). Please select another slot.`);
    }

    // 2. Stock Validation & Deduction
    for (const item of items) {
      const food = db.prepare('SELECT * FROM foods WHERE id = ?').get(item.foodId || item.id);
      if (!food) {
        throw new Error(`Food item ${item.name} is no longer available.`);
      }
      if (item.quantity > food.stock) {
        throw new Error(`Insufficient stock for ${food.name}. Available: ${food.stock}, Requested: ${item.quantity}.`);
      }
    }

    // Apply Deductions to Foods
    for (const item of items) {
      const food = db.prepare('SELECT stock FROM foods WHERE id = ?').get(item.foodId || item.id);
      const newStock = Math.max(0, food.stock - item.quantity);
      const isAvailable = newStock > 0 ? 1 : 0;
      db.prepare('UPDATE foods SET stock = ?, available = ? WHERE id = ?').run(newStock, isAvailable, item.foodId || item.id);
    }

    // Increment Slot Booked Count
    db.prepare('UPDATE slots SET bookedCount = bookedCount + 1 WHERE id = ?').run(slot.id);

    // Create New Order
    const newOrderId = `SC-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalAmount = items.reduce((acc, i) => acc + (i.price * i.quantity), 0) * 1.05; // Total with 5% tax

    const pendingCount = db.prepare("SELECT count(*) as count FROM orders WHERE status IN ('Placed', 'Accepted', 'Preparing')").get().count;

    const stmt = db.prepare(`
      INSERT INTO orders (id, userId, userName, userEmail, items, totalAmount, pickupSlotId, pickupSlotTime, status, queuePosition, counterNumber, createdAt, estimatedPrepTime, paymentMethod)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      newOrderId,
      userId || 'usr-1',
      userName || 'Student',
      userEmail || 'student@college.edu',
      JSON.stringify(items),
      Math.round(totalAmount),
      slot.id,
      `${slot.startTime} – ${slot.endTime}`,
      'Placed',
      pendingCount + 1,
      'Counter 1 (Express)',
      new Date().toISOString(),
      '10-12 mins',
      paymentMethod || 'Campus Wallet'
    );

    const createdOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(newOrderId);
    return {
      ...createdOrder,
      items: JSON.parse(createdOrder.items)
    };
  });

  try {
    const order = executeOrderTransaction();
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

const VALID_STATUSES = ['Placed', 'Accepted', 'Preparing', 'Ready', 'Collected', 'Cancelled'];

app.patch('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status: targetStatus } = req.body;

  let order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  if (!order) {
    order = db.prepare('SELECT * FROM orders WHERE id = ? OR status IS NOT NULL').all().find(o => o.id === id || o.orderId === id);
  }

  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  if (!VALID_STATUSES.includes(targetStatus)) {
    return res.status(400).json({ 
      error: `Invalid status "${targetStatus}". Must be one of: ${VALID_STATUSES.join(', ')}.` 
    });
  }

  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(targetStatus, order.id);
  const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(order.id);

  res.json({
    success: true,
    order: {
      ...updatedOrder,
      items: JSON.parse(updatedOrder.items)
    }
  });
});

// CANCEL ORDER & RESTORE INVENTORY + SLOT CAPACITY
app.post('/api/orders/:id/cancel', (req, res) => {
  const { id } = req.params;

  const executeCancel = db.transaction(() => {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!order) throw new Error('Order not found.');
    if (order.status === 'Collected' || order.status === 'Cancelled') {
      throw new Error(`Cannot cancel order in status ${order.status}.`);
    }

    const items = JSON.parse(order.items);

    // 1. Restore Food Stock
    for (const item of items) {
      const food = db.prepare('SELECT stock FROM foods WHERE id = ?').get(item.foodId || item.id);
      if (food) {
        const restoredStock = food.stock + item.quantity;
        db.prepare('UPDATE foods SET stock = ?, available = 1 WHERE id = ?').run(restoredStock, item.foodId || item.id);
      }
    }

    // 2. Release Slot Capacity
    const slot = db.prepare('SELECT bookedCount FROM slots WHERE id = ?').get(order.pickupSlotId);
    if (slot) {
      const newBooked = Math.max(0, slot.bookedCount - 1);
      db.prepare('UPDATE slots SET bookedCount = ? WHERE id = ?').run(newBooked, order.pickupSlotId);
    }

    // 3. Mark Status Cancelled
    db.prepare("UPDATE orders SET status = 'Cancelled' WHERE id = ?").run(id);

    return db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  });

  try {
    const cancelledOrder = executeCancel();
    res.json({
      success: true,
      order: {
        ...cancelledOrder,
        items: JSON.parse(cancelledOrder.items)
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// RESET DATABASE SEED
app.post('/api/seed/reset', (req, res) => {
  seedData();
  res.json({ success: true, message: 'Database reset to default presentation seed.' });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 SmartCanteen Express Backend Server running on http://localhost:${PORT}`);
});
