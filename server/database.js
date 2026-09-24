import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'canteen.db');
const db = new Database(dbPath);

// Enable WAL mode for high concurrency
db.pragma('journal_mode = WAL');

// Initialize Database Schemas
export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      avatar TEXT,
      rollNumber TEXT,
      department TEXT,
      balance REAL DEFAULT 1000
    );

    CREATE TABLE IF NOT EXISTS foods (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      stock INTEGER NOT NULL,
      image TEXT NOT NULL,
      available INTEGER DEFAULT 1,
      rating REAL DEFAULT 4.8,
      prepTimeMinutes INTEGER DEFAULT 10,
      popular INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS slots (
      id TEXT PRIMARY KEY,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      capacity INTEGER NOT NULL,
      bookedCount INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      userName TEXT NOT NULL,
      userEmail TEXT NOT NULL,
      items TEXT NOT NULL,
      totalAmount REAL NOT NULL,
      pickupSlotId TEXT NOT NULL,
      pickupSlotTime TEXT NOT NULL,
      status TEXT NOT NULL,
      queuePosition INTEGER DEFAULT 1,
      counterNumber TEXT DEFAULT 'Counter 1',
      createdAt TEXT NOT NULL,
      estimatedPrepTime TEXT DEFAULT '10 mins',
      paymentMethod TEXT DEFAULT 'Campus Wallet'
    );
  `);

  // Seed default data if empty
  const foodCount = db.prepare('SELECT count(*) as count FROM foods').get().count;
  if (foodCount === 0) {
    seedData();
  }
}

export function seedData() {
  db.exec('DELETE FROM users');
  db.exec('DELETE FROM foods');
  db.exec('DELETE FROM slots');
  db.exec('DELETE FROM orders');

  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, password, role, avatar, rollNumber, department, balance)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run('usr-1', 'Aditya Sharma', 'student@college.edu', 'password123', 'student', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'CS2024-089', 'Computer Science', 1250);
  insertUser.run('usr-2', 'Chef Ramesh Kumar', 'staff@canteen.edu', 'password123', 'staff', 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80', null, 'Kitchen Head', 0);
  insertUser.run('usr-3', 'Dr. Vikrant Kapoor', 'admin@canteen.edu', 'password123', 'admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', null, 'Administration', 0);

  const insertFood = db.prepare(`
    INSERT INTO foods (id, name, category, description, price, stock, image, available, rating, prepTimeMinutes, popular)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertFood.run('food-1', 'Veg Burger', 'Snacks', 'Crispy vegetable patty with fresh lettuce, tomatoes, creamy mayo, and soft sesame bun.', 80, 5, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80', 1, 4.8, 10, 1);
  insertFood.run('food-2', 'Cheese Sandwich', 'Snacks', 'Grilled double-layered sandwich stuffed with melted cheddar cheese and herbs.', 70, 12, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80', 1, 4.6, 8, 1);
  insertFood.run('food-3', 'French Fries', 'Snacks', 'Golden salted crisp potato fries served with tangy tomato ketchup and peri peri seasoning.', 60, 20, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80', 1, 4.7, 6, 0);
  insertFood.run('food-4', 'Masala Maggi', 'Snacks', 'Hot piping noodle bowl seasoned with authentic Indian spices, peas, and butter.', 50, 15, 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80', 1, 4.9, 7, 1);
  insertFood.run('food-5', 'Cold Coffee', 'Beverages', 'Rich blended espresso coffee with chilled milk, dark chocolate syrup, and vanilla ice cream scoop.', 50, 18, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80', 1, 4.9, 5, 1);
  insertFood.run('food-6', 'Masala Dosa', 'Meals', 'Crispy South Indian rice crepe filled with spiced potato mash, served with coconut chutney & sambar.', 90, 8, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80', 1, 4.8, 12, 1);
  insertFood.run('food-7', 'Paneer Roll', 'Meals', 'Soft whole wheat wrap loaded with marinated cottage cheese cubes, onions, and mint chutney.', 100, 0, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80', 0, 4.5, 10, 0);
  insertFood.run('food-8', 'Fresh Lime Soda', 'Beverages', 'Refreshing sparkling soda infused with freshly squeezed lime, mint leaves, and sweet syrup.', 40, 25, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80', 1, 4.4, 4, 0);
  insertFood.run('food-9', 'Chocolate Brownie', 'Desserts', 'Warm fudgy chocolate brownie topped with chocolate drizzle and walnuts.', 65, 4, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80', 1, 4.9, 3, 1);
  insertFood.run('food-10', 'Samosa Duo', 'Snacks', 'Two crispy golden samosas packed with spicy potato fillings, served with sweet tamarind chutney.', 40, 14, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80', 1, 4.7, 5, 1);

  const insertSlot = db.prepare(`
    INSERT INTO slots (id, startTime, endTime, capacity, bookedCount, active)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertSlot.run('slot-1', '12:30 PM', '12:45 PM', 10, 10, 1);
  insertSlot.run('slot-2', '12:45 PM', '1:00 PM', 10, 6, 1);
  insertSlot.run('slot-3', '1:00 PM', '1:15 PM', 10, 8, 1);
  insertSlot.run('slot-4', '1:15 PM', '1:30 PM', 10, 3, 1);
  insertSlot.run('slot-5', '1:30 PM', '1:45 PM', 10, 1, 1);

  const insertOrder = db.prepare(`
    INSERT INTO orders (id, userId, userName, userEmail, items, totalAmount, pickupSlotId, pickupSlotTime, status, queuePosition, counterNumber, createdAt, estimatedPrepTime, paymentMethod)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const order1Items = JSON.stringify([
    { foodId: 'food-1', name: 'Veg Burger', price: 80, quantity: 1, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80' },
    { foodId: 'food-5', name: 'Cold Coffee', price: 50, quantity: 1, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80' }
  ]);
  insertOrder.run('SC-9401', 'usr-1', 'Aditya Sharma', 'student@college.edu', order1Items, 130, 'slot-3', '1:00 PM – 1:15 PM', 'Preparing', 2, 'Counter 1 (Express)', new Date(Date.now() - 12 * 60 * 1000).toISOString(), '8 mins', 'Campus Wallet');

  const order2Items = JSON.stringify([
    { foodId: 'food-4', name: 'Masala Maggi', price: 50, quantity: 2, image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80' }
  ]);
  insertOrder.run('SC-9400', 'usr-1', 'Aditya Sharma', 'student@college.edu', order2Items, 100, 'slot-2', '12:45 PM – 1:00 PM', 'Ready', 1, 'Counter 2', new Date(Date.now() - 25 * 60 * 1000).toISOString(), 'Ready now!', 'UPI');

  const order3Items = JSON.stringify([
    { foodId: 'food-6', name: 'Masala Dosa', price: 90, quantity: 1, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80' }
  ]);
  insertOrder.run('SC-9398', 'usr-4', 'Neha Patel', 'neha.p@college.edu', order3Items, 90, 'slot-3', '1:00 PM – 1:15 PM', 'Placed', 4, 'Counter 1', new Date(Date.now() - 5 * 60 * 1000).toISOString(), '12 mins', 'Pay at Counter');
}

export default db;
