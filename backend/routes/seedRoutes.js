import express from 'express';
import { User } from '../models/User.js';
import { Food } from '../models/Food.js';
import { Slot } from '../models/Slot.js';
import { Order } from '../models/Order.js';

const router = express.Router();

export const seedMongoData = async () => {
  try {
    try {
      await Order.collection.dropIndex('pickup.token_1');
    } catch (e) {}

    await User.deleteMany({});
    await Food.deleteMany({});
    await Slot.deleteMany({});
    await Order.deleteMany({});

    // 1. Seed Default Users
    const users = await User.create([
      {
        name: 'Aditya Sharma',
        email: 'student@college.edu',
        password: 'password123',
        role: 'student',
        rollNumber: 'CS2024-089',
        department: 'Computer Science',
        phone: '+91 98765 43210',
        phoneNumber: '+91 98765 43210',
        balance: 1450,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Chef Rajesh Kumar',
        email: 'staff@canteen.edu',
        password: 'password123',
        role: 'staff',
        rollNumber: 'STF-402',
        department: 'Canteen Operations',
        phone: '+91 98123 45678',
        phoneNumber: '+91 98123 45678',
        balance: 5000,
        avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Administrator',
        email: 'admin@canteen.edu',
        password: 'password123',
        role: 'admin',
        rollNumber: 'ADM-001',
        department: 'Management',
        phone: '+91 99999 88888',
        phoneNumber: '+91 99999 88888',
        balance: 10000,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      }
    ]);

    // 2. Seed Menu Items
    const foods = await Food.create([
      {
        name: 'Masala Dosa with Sambhar',
        category: 'breakfast',
        description: 'Crispy golden crepe filled with spiced potato masala, served with piping hot Sambhar & coconut chutney.',
        price: 70,
        stock: 25,
        available: true,
        isAvailable: true,
        prepTimeMinutes: 12,
        preparationTime: 12,
        rating: 4.9,
        ratings: { average: 4.9, count: 120 },
        tags: ['vegetarian', 'south-indian'],
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80',
        popular: true
      },
      {
        name: 'Paneer Butter Masala Thali',
        category: 'lunch',
        description: 'Rich cottage cheese curry served with 2 Butter Naans, Jeera Rice, Dal Makhani & Salad.',
        price: 140,
        stock: 18,
        available: true,
        isAvailable: true,
        prepTimeMinutes: 15,
        preparationTime: 15,
        rating: 4.8,
        ratings: { average: 4.8, count: 95 },
        tags: ['vegetarian', 'north-indian'],
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80',
        popular: true
      },
      {
        name: 'Veg Cheese Grilled Sandwich',
        category: 'snacks',
        description: 'Triple-decker grilled sandwich packed with fresh veggies, green chutney & melted mozzarella cheese.',
        price: 65,
        stock: 3,
        available: true,
        isAvailable: true,
        prepTimeMinutes: 8,
        preparationTime: 8,
        rating: 4.7,
        ratings: { average: 4.7, count: 88 },
        tags: ['vegetarian', 'cheese'],
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80',
        popular: true
      },
      {
        name: 'Cold Coffee with Ice Cream',
        category: 'beverages',
        description: 'Thick creamy blended cold coffee topped with a rich scoop of vanilla ice cream & chocolate drizzle.',
        price: 60,
        stock: 30,
        available: true,
        isAvailable: true,
        prepTimeMinutes: 5,
        preparationTime: 5,
        rating: 4.9,
        ratings: { average: 4.9, count: 210 },
        tags: ['beverage', 'chilled'],
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=80',
        popular: true
      },
      {
        name: 'Chocolate Lava Cake',
        category: 'desserts',
        description: 'Warm, gooey chocolate cake with molten chocolate core center.',
        price: 80,
        stock: 4,
        available: true,
        isAvailable: true,
        prepTimeMinutes: 10,
        preparationTime: 10,
        rating: 4.9,
        ratings: { average: 4.9, count: 75 },
        tags: ['sweet', 'dessert'],
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80',
        popular: true
      },
      {
        name: 'Samosa Pav (2 pcs)',
        category: 'snacks',
        description: 'Golden fried potato samosas stuffed inside soft buttered pav with spicy garlic & sweet tamarind chutneys.',
        price: 40,
        stock: 40,
        available: true,
        isAvailable: true,
        prepTimeMinutes: 5,
        preparationTime: 5,
        rating: 4.6,
        ratings: { average: 4.6, count: 140 },
        tags: ['vegetarian', 'spicy'],
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80',
        popular: false
      },
      {
        name: 'Fresh Mango Lassi',
        category: 'beverages',
        description: 'Traditional thick yogurt drink blended with fresh Alphonso mango pulp and cardamom.',
        price: 50,
        stock: 20,
        available: true,
        isAvailable: true,
        prepTimeMinutes: 5,
        preparationTime: 5,
        rating: 4.8,
        ratings: { average: 4.8, count: 64 },
        tags: ['beverage', 'chilled'],
        image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=80',
        popular: false
      }
    ]);

    // 3. Seed Time Slots
    const slots = await Slot.create([
      { startTime: '09:00 AM', endTime: '09:30 AM', capacity: 10, bookedCount: 3, ordersCount: 3, active: true, isActive: true },
      { startTime: '09:30 AM', endTime: '10:00 AM', capacity: 10, bookedCount: 5, ordersCount: 5, active: true, isActive: true },
      { startTime: '12:00 PM', endTime: '12:30 PM', capacity: 15, bookedCount: 12, ordersCount: 12, active: true, isActive: true },
      { startTime: '12:30 PM', endTime: '01:00 PM', capacity: 12, bookedCount: 8, ordersCount: 8, active: true, isActive: true },
      { startTime: '01:00 PM', endTime: '01:30 PM', capacity: 10, bookedCount: 10, ordersCount: 10, active: true, isActive: true },
      { startTime: '04:00 PM', endTime: '04:30 PM', capacity: 15, bookedCount: 2, ordersCount: 2, active: true, isActive: true }
    ]);

    // 4. Seed Sample Orders
    const studentUser = users[0];
    const firstSlot = slots[2];

    await Order.create([
      {
        orderNumber: 'ORD-1712000001-101',
        orderId: 'ORD-1712000001-101',
        student: studentUser._id,
        userId: studentUser._id.toString(),
        userName: studentUser.name,
        userEmail: studentUser.email,
        items: [
          { menuItem: foods[1]._id, foodId: foods[1]._id.toString(), name: foods[1].name, price: foods[1].price, quantity: 1, subtotal: 140, image: foods[1].image },
          { menuItem: foods[3]._id, foodId: foods[3]._id.toString(), name: foods[3].name, price: foods[3].price, quantity: 1, subtotal: 60, image: foods[3].image }
        ],
        totalAmount: 210,
        status: 'placed',
        paymentStatus: 'completed',
        paymentMethod: 'Campus Wallet',
        pickupSlotId: firstSlot._id.toString(),
        pickupSlot: firstSlot._id,
        pickupSlotTime: `${firstSlot.startTime} – ${firstSlot.endTime}`,
        pickupTime: { date: new Date(), startTime: firstSlot.startTime, endTime: firstSlot.endTime },
        queuePosition: 3,
        counterNumber: 'Counter 1 (Express Pickup)',
        estimatedPrepTime: '10-12 mins',
        specialRequests: 'Extra chutney please'
      },
      {
        orderNumber: 'ORD-1712000002-102',
        orderId: 'ORD-1712000002-102',
        student: studentUser._id,
        userId: studentUser._id.toString(),
        userName: studentUser.name,
        userEmail: studentUser.email,
        items: [
          { menuItem: foods[0]._id, foodId: foods[0]._id.toString(), name: foods[0].name, price: foods[0].price, quantity: 2, subtotal: 140, image: foods[0].image }
        ],
        totalAmount: 147,
        status: 'ready',
        paymentStatus: 'completed',
        paymentMethod: 'UPI',
        pickupSlotId: firstSlot._id.toString(),
        pickupSlot: firstSlot._id,
        pickupSlotTime: `${firstSlot.startTime} – ${firstSlot.endTime}`,
        pickupTime: { date: new Date(), startTime: firstSlot.startTime, endTime: firstSlot.endTime },
        queuePosition: 1,
        counterNumber: 'Counter 1 (Express Pickup)',
        estimatedPrepTime: 'Ready for Collection',
        specialRequests: ''
      }
    ]);

    console.log('🌱 Seed successful: Clean data initialized.');
    return { success: true, message: 'Database seeded successfully' };
  } catch (err) {
    console.error('❌ SEED ERROR STACK:', err);
    throw err;
  }
};

router.post('/reset', async (req, res) => {
  try {
    await seedMongoData();
    res.json({ success: true, message: 'Database reset & re-seeded successfully' });
  } catch (err) {
    console.error('❌ SEED ROUTE ERROR:', err);
    res.status(500).json({ error: 'Failed to reset seed data: ' + err.message, stack: err.stack });
  }
});

export default router;
