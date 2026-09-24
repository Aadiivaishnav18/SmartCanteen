import express from 'express';
import { User } from '../models/User.js';
import { Food } from '../models/Food.js';
import { Slot } from '../models/Slot.js';
import { Order } from '../models/Order.js';

const router = express.Router();

export async function seedMongoData() {
  await User.deleteMany({});
  await Food.deleteMany({});
  await Slot.deleteMany({});
  await Order.deleteMany({});

  await User.create([
    { name: 'Aditya Sharma', email: 'student@college.edu', password: 'password123', role: 'student', rollNumber: 'CS2024-089', department: 'Computer Science', balance: 1250 },
    { name: 'Chef Ramesh Kumar', email: 'staff@canteen.edu', password: 'password123', role: 'staff', rollNumber: 'STAFF-01', department: 'Kitchen Station 1', balance: 0 },
    { name: 'Dr. Vikrant Kapoor', email: 'admin@canteen.edu', password: 'password123', role: 'admin', rollNumber: 'ADMIN-01', department: 'Campus Management', balance: 0 }
  ]);

  await Food.create([
    { name: 'Veg Burger', category: 'Snacks', description: 'Crispy vegetable patty with fresh lettuce, tomatoes, creamy mayo, and soft sesame bun.', price: 80, stock: 5, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80', available: true, rating: 4.8, prepTimeMinutes: 10, popular: true },
    { name: 'Cheese Sandwich', category: 'Snacks', description: 'Grilled double-layered sandwich stuffed with melted cheddar cheese and herbs.', price: 70, stock: 12, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80', available: true, rating: 4.6, prepTimeMinutes: 8, popular: true },
    { name: 'French Fries', category: 'Snacks', description: 'Golden salted crisp potato fries served with tangy tomato ketchup and peri peri seasoning.', price: 60, stock: 20, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80', available: true, rating: 4.7, prepTimeMinutes: 6, popular: false },
    { name: 'Masala Maggi', category: 'Snacks', description: 'Hot piping noodle bowl seasoned with authentic Indian spices, peas, and butter.', price: 50, stock: 15, image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80', available: true, rating: 4.9, prepTimeMinutes: 7, popular: true },
    { name: 'Cold Coffee', category: 'Beverages', description: 'Rich blended espresso coffee with chilled milk, dark chocolate syrup, and vanilla ice cream scoop.', price: 50, stock: 18, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80', available: true, rating: 4.9, prepTimeMinutes: 5, popular: true },
    { name: 'Masala Dosa', category: 'Meals', description: 'Crispy South Indian rice crepe filled with spiced potato mash, served with coconut chutney & sambar.', price: 90, stock: 8, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80', available: true, rating: 4.8, prepTimeMinutes: 12, popular: true },
    { name: 'Paneer Roll', category: 'Meals', description: 'Soft whole wheat wrap loaded with marinated cottage cheese cubes, onions, and mint chutney.', price: 100, stock: 0, image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80', available: false, rating: 4.5, prepTimeMinutes: 10, popular: false },
    { name: 'Fresh Lime Soda', category: 'Beverages', description: 'Refreshing sparkling soda infused with freshly squeezed lime, mint leaves, and sweet syrup.', price: 40, stock: 25, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80', available: true, rating: 4.4, prepTimeMinutes: 4, popular: false },
    { name: 'Chocolate Brownie', category: 'Desserts', description: 'Warm fudgy chocolate brownie topped with chocolate drizzle and walnuts.', price: 65, stock: 4, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80', available: true, rating: 4.9, prepTimeMinutes: 3, popular: true },
    { name: 'Samosa Duo', category: 'Snacks', description: 'Two crispy golden samosas packed with spicy potato fillings, served with sweet tamarind chutney.', price: 40, stock: 14, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80', available: true, rating: 4.7, prepTimeMinutes: 5, popular: true }
  ]);

  const slots = await Slot.create([
    { startTime: '12:30 PM', endTime: '12:45 PM', capacity: 10, bookedCount: 10, active: true },
    { startTime: '12:45 PM', endTime: '1:00 PM', capacity: 10, bookedCount: 6, active: true },
    { startTime: '1:00 PM', endTime: '1:15 PM', capacity: 10, bookedCount: 8, active: true },
    { startTime: '1:15 PM', endTime: '1:30 PM', capacity: 10, bookedCount: 3, active: true },
    { startTime: '1:30 PM', endTime: '1:45 PM', capacity: 10, bookedCount: 1, active: true }
  ]);

  const student = await User.findOne({ email: 'student@college.edu' });
  const burger = await Food.findOne({ name: 'Veg Burger' });
  const coffee = await Food.findOne({ name: 'Cold Coffee' });

  await Order.create([
    {
      orderId: 'SC-9401',
      userId: student._id.toString(),
      userName: student.name,
      userEmail: student.email,
      items: [
        { foodId: burger._id.toString(), name: burger.name, price: burger.price, quantity: 1, image: burger.image },
        { foodId: coffee._id.toString(), name: coffee.name, price: coffee.price, quantity: 1, image: coffee.image }
      ],
      totalAmount: 130,
      pickupSlotId: slots[2]._id.toString(),
      pickupSlotTime: '1:00 PM – 1:15 PM',
      status: 'Preparing',
      queuePosition: 2,
      counterNumber: 'Counter 1 (Express)',
      createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      estimatedPrepTime: '8 mins',
      paymentMethod: 'Campus Wallet'
    },
    {
      orderId: 'SC-9400',
      userId: student._id.toString(),
      userName: student.name,
      userEmail: student.email,
      items: [
        { foodId: burger._id.toString(), name: burger.name, price: burger.price, quantity: 2, image: burger.image }
      ],
      totalAmount: 160,
      pickupSlotId: slots[1]._id.toString(),
      pickupSlotTime: '12:45 PM – 1:00 PM',
      status: 'Ready',
      queuePosition: 1,
      counterNumber: 'Counter 2',
      createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      estimatedPrepTime: 'Ready now!',
      paymentMethod: 'UPI'
    }
  ]);
}

router.post('/reset', async (req, res) => {
  try {
    await seedMongoData();
    res.json({ success: true, message: 'MongoDB re-seeded successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
