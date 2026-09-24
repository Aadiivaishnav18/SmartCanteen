export const INITIAL_USERS = [
  {
    id: 'usr-1',
    name: 'Aditya Sharma',
    email: 'student@college.edu',
    password: 'password123',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rollNumber: 'CS2024-089',
    department: 'Computer Science',
    balance: 850
  },
  {
    id: 'usr-2',
    name: 'Chef Ramesh Kumar',
    email: 'staff@canteen.edu',
    password: 'password123',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80',
    station: 'Counter 1 (Main Kitchen)'
  },
  {
    id: 'usr-3',
    name: 'Dr. Vikrant Kapoor',
    email: 'admin@canteen.edu',
    password: 'password123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    title: 'Campus Food Services Director'
  }
];

export const INITIAL_FOODS = [
  {
    id: 'food-1',
    name: 'Veg Burger',
    category: 'Snacks',
    description: 'Crispy vegetable patty with fresh lettuce, tomatoes, creamy mayo, and soft sesame bun.',
    price: 80,
    stock: 5, // Low stock for demo!
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    available: true,
    rating: 4.8,
    prepTimeMinutes: 10,
    popular: true
  },
  {
    id: 'food-2',
    name: 'Cheese Sandwich',
    category: 'Snacks',
    description: 'Grilled double-layered sandwich stuffed with melted cheddar cheese and herbs.',
    price: 70,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
    available: true,
    rating: 4.6,
    prepTimeMinutes: 8,
    popular: true
  },
  {
    id: 'food-3',
    name: 'French Fries',
    category: 'Snacks',
    description: 'Golden salted crisp potato fries served with tangy tomato ketchup and peri peri seasoning.',
    price: 60,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80',
    available: true,
    rating: 4.7,
    prepTimeMinutes: 6,
    popular: false
  },
  {
    id: 'food-4',
    name: 'Masala Maggi',
    category: 'Snacks',
    description: 'Hot piping noodle bowl seasoned with authentic Indian spices, peas, and butter.',
    price: 50,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80',
    available: true,
    rating: 4.9,
    prepTimeMinutes: 7,
    popular: true
  },
  {
    id: 'food-5',
    name: 'Cold Coffee',
    category: 'Beverages',
    description: 'Rich blended espresso coffee with chilled milk, dark chocolate syrup, and vanilla ice cream scoop.',
    price: 50,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80',
    available: true,
    rating: 4.9,
    prepTimeMinutes: 5,
    popular: true
  },
  {
    id: 'food-6',
    name: 'Masala Dosa',
    category: 'Meals',
    description: 'Crispy South Indian rice crepe filled with spiced potato mash, served with coconut chutney & sambar.',
    price: 90,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
    available: true,
    rating: 4.8,
    prepTimeMinutes: 12,
    popular: true
  },
  {
    id: 'food-7',
    name: 'Paneer Roll',
    category: 'Meals',
    description: 'Soft whole wheat wrap loaded with marinated cottage cheese cubes, onions, and mint chutney.',
    price: 100,
    stock: 0, // Out of stock for demo!
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
    available: false,
    rating: 4.5,
    prepTimeMinutes: 10,
    popular: false
  },
  {
    id: 'food-8',
    name: 'Fresh Lime Soda',
    category: 'Beverages',
    description: 'Refreshing sparkling soda infused with freshly squeezed lime, mint leaves, and sweet syrup.',
    price: 40,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    available: true,
    rating: 4.4,
    prepTimeMinutes: 4,
    popular: false
  },
  {
    id: 'food-9',
    name: 'Chocolate Brownie',
    category: 'Desserts',
    description: 'Warm fudgy chocolate brownie topped with chocolate drizzle and walnuts.',
    price: 65,
    stock: 4, // Low stock for demo!
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    available: true,
    rating: 4.9,
    prepTimeMinutes: 3,
    popular: true
  },
  {
    id: 'food-10',
    name: 'Samosa Duo',
    category: 'Snacks',
    description: 'Two crispy golden samosas packed with spicy potato fillings, served with sweet tamarind chutney.',
    price: 40,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
    available: true,
    rating: 4.7,
    prepTimeMinutes: 5,
    popular: true
  }
];

export const INITIAL_SLOTS = [
  {
    id: 'slot-1',
    startTime: '12:30 PM',
    endTime: '12:45 PM',
    capacity: 10,
    bookedCount: 10, // Full slot for demo!
    active: true
  },
  {
    id: 'slot-2',
    startTime: '12:45 PM',
    endTime: '1:00 PM',
    capacity: 10,
    bookedCount: 6,
    active: true
  },
  {
    id: 'slot-3',
    startTime: '1:00 PM',
    endTime: '1:15 PM',
    capacity: 10,
    bookedCount: 8,
    active: true
  },
  {
    id: 'slot-4',
    startTime: '1:15 PM',
    endTime: '1:30 PM',
    capacity: 10,
    bookedCount: 3,
    active: true
  },
  {
    id: 'slot-5',
    startTime: '1:30 PM',
    endTime: '1:45 PM',
    capacity: 10,
    bookedCount: 1,
    active: true
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'SC-9401',
    userId: 'usr-1',
    userName: 'Aditya Sharma',
    userEmail: 'student@college.edu',
    items: [
      { foodId: 'food-1', name: 'Veg Burger', price: 80, quantity: 1, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80' },
      { foodId: 'food-5', name: 'Cold Coffee', price: 50, quantity: 1, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80' }
    ],
    totalAmount: 130,
    pickupSlotId: 'slot-3',
    pickupSlotTime: '1:00 PM – 1:15 PM',
    status: 'Preparing', // Active order for student dashboard demo!
    queuePosition: 2,
    counterNumber: 'Counter 1 (Express)',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    estimatedPrepTime: '8 mins',
    paymentMethod: 'Campus Wallet'
  },
  {
    id: 'SC-9400',
    userId: 'usr-1',
    userName: 'Aditya Sharma',
    userEmail: 'student@college.edu',
    items: [
      { foodId: 'food-4', name: 'Masala Maggi', price: 50, quantity: 2, image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80' }
    ],
    totalAmount: 100,
    pickupSlotId: 'slot-2',
    pickupSlotTime: '12:45 PM – 1:00 PM',
    status: 'Ready',
    queuePosition: 1,
    counterNumber: 'Counter 2',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    estimatedPrepTime: 'Ready now!',
    paymentMethod: 'UPI'
  },
  {
    id: 'SC-9398',
    userId: 'usr-4',
    userName: 'Neha Patel',
    userEmail: 'neha.p@college.edu',
    items: [
      { foodId: 'food-6', name: 'Masala Dosa', price: 90, quantity: 1, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80' },
      { foodId: 'food-8', name: 'Fresh Lime Soda', price: 40, quantity: 1, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80' }
    ],
    totalAmount: 130,
    pickupSlotId: 'slot-3',
    pickupSlotTime: '1:00 PM – 1:15 PM',
    status: 'Placed',
    queuePosition: 4,
    counterNumber: 'Counter 1',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    estimatedPrepTime: '12 mins',
    paymentMethod: 'Pay at Counter'
  },
  {
    id: 'SC-9395',
    userId: 'usr-5',
    userName: 'Rohan Verma',
    userEmail: 'rohan.v@college.edu',
    items: [
      { foodId: 'food-2', name: 'Cheese Sandwich', price: 70, quantity: 2, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80' },
      { foodId: 'food-3', name: 'French Fries', price: 60, quantity: 1, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80' }
    ],
    totalAmount: 200,
    pickupSlotId: 'slot-3',
    pickupSlotTime: '1:00 PM – 1:15 PM',
    status: 'Accepted',
    queuePosition: 3,
    counterNumber: 'Counter 1',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    estimatedPrepTime: '10 mins',
    paymentMethod: 'Campus Wallet'
  },
  {
    id: 'SC-9390',
    userId: 'usr-1',
    userName: 'Aditya Sharma',
    userEmail: 'student@college.edu',
    items: [
      { foodId: 'food-10', name: 'Samosa Duo', price: 40, quantity: 1, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80' }
    ],
    totalAmount: 40,
    pickupSlotId: 'slot-1',
    pickupSlotTime: '12:30 PM – 12:45 PM',
    status: 'Collected',
    queuePosition: 0,
    counterNumber: 'Counter 1',
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    estimatedPrepTime: 'Completed',
    paymentMethod: 'UPI'
  },
  {
    id: 'SC-9385',
    userId: 'usr-6',
    userName: 'Ananya Gupta',
    userEmail: 'ananya.g@college.edu',
    items: [
      { foodId: 'food-9', name: 'Chocolate Brownie', price: 65, quantity: 2, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80' }
    ],
    totalAmount: 130,
    pickupSlotId: 'slot-1',
    pickupSlotTime: '12:30 PM – 12:45 PM',
    status: 'Collected',
    queuePosition: 0,
    counterNumber: 'Counter 2',
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    estimatedPrepTime: 'Completed',
    paymentMethod: 'Campus Wallet'
  }
];
