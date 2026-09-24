import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('smartcanteen_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('smartcanteen_token') || '');

  const [foodItems, setFoodItems] = useState([]);
  const [pickupSlots, setPickupSlots] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  // Filters for Order History & Staff Views
  const [orderFilters, setOrderFilters] = useState({
    status: 'All',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt'
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('smartcanteen_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Navigation Tab State
  const [studentTab, setStudentTab] = useState('dashboard');
  const [staffTab, setStaffTab] = useState('dashboard');
  const [adminTab, setAdminTab] = useState('dashboard');

  // Modals & Active Selections
  const [trackedOrderId, setTrackedOrderId] = useState(null);
  const [staffSelectedOrderId, setStaffSelectedOrderId] = useState(null);
  const [selectedFoodModal, setSelectedFoodModal] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Notification Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Synchronize Backend MERN Data
  const refreshBackendData = useCallback(async () => {
    try {
      const [foodsData, slotsData, ordersRes] = await Promise.all([
        api.getFoods(),
        api.getSlots(),
        api.getOrders({
          userId: currentUser?.role === 'student' ? (currentUser.id || currentUser._id) : '',
          status: orderFilters.status,
          startDate: orderFilters.startDate,
          endDate: orderFilters.endDate,
          page: orderFilters.page,
          limit: orderFilters.limit,
          sortBy: orderFilters.sortBy
        })
      ]);

      setFoodItems(foodsData);
      setPickupSlots(slotsData);

      if (ordersRes && ordersRes.orders) {
        setOrders(ordersRes.orders);
        setPagination(ordersRes.pagination);
        if (!trackedOrderId && ordersRes.orders.length > 0) {
          setTrackedOrderId(ordersRes.orders[0].orderId || ordersRes.orders[0]._id);
        }
      }
    } catch (err) {
      console.error('MERN Sync Error:', err);
    }
  }, [currentUser, orderFilters, trackedOrderId]);

  // Initial Sync & Real-Time Auto Refresh every 3 seconds
  useEffect(() => {
    refreshBackendData();
    const interval = setInterval(refreshBackendData, 3000);
    return () => clearInterval(interval);
  }, [refreshBackendData]);

  // Sync state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('smartcanteen_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('smartcanteen_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('smartcanteen_token', token);
    } else {
      localStorage.removeItem('smartcanteen_token');
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('smartcanteen_cart', JSON.stringify(cart));
  }, [cart]);

  // Authentication Handlers
  const registerUser = async (userData) => {
    try {
      const res = await api.register(userData);
      if (res.success) {
        setToken(res.token);
        setCurrentUser(res.user);
        setStudentTab('dashboard');
        showToast(`Account created! Welcome to SmartCanteen, ${res.user.name}.`, 'success');
        return { success: true };
      } else {
        showToast(res.error, 'error');
        return { success: false, error: res.error };
      }
    } catch (err) {
      showToast('Error registering account', 'error');
      return { success: false, error: err.message };
    }
  };

  const loginUser = async (email, password) => {
    try {
      const res = await api.login(email, password);
      if (res.success) {
        setToken(res.token);
        setCurrentUser(res.user);
        if (res.user.role === 'student') setStudentTab('dashboard');
        if (res.user.role === 'staff') setStaffTab('dashboard');
        if (res.user.role === 'admin') setAdminTab('dashboard');
        showToast(`Signed in as ${res.user.name} (${res.user.role.toUpperCase()})`, 'success');
        return { success: true };
      } else {
        showToast(res.error, 'error');
        return { success: false, error: res.error };
      }
    } catch (err) {
      showToast('Invalid credentials or connection error', 'error');
      return { success: false, error: 'Connection error' };
    }
  };

  const updateUserProfile = async (profileData) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    try {
      const res = await api.updateProfile({
        userId: currentUser.id || currentUser._id,
        ...profileData
      });
      if (res.success) {
        setCurrentUser(res.user);
        showToast('Profile updated successfully!', 'success');
        return { success: true, user: res.user };
      } else {
        showToast(res.error, 'error');
        return { success: false, error: res.error };
      }
    } catch (err) {
      showToast('Error updating profile.', 'error');
      return { success: false, error: err.message };
    }
  };

  const switchRoleDemo = async (role) => {
    if (role === 'student') {
      setCurrentUser(null);
      setToken('');
      localStorage.removeItem('smartcanteen_user');
      localStorage.removeItem('smartcanteen_token');
      setStudentTab('login');
      return;
    }
    const emails = {
      staff: 'staff@canteen.edu',
      admin: 'admin@canteen.edu'
    };
    await loginUser(emails[role], 'password123');
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setToken('');
    setCart([]);
    setStudentTab('landing');
    localStorage.removeItem('smartcanteen_user');
    localStorage.removeItem('smartcanteen_token');
    showToast('Signed out successfully.', 'info');
  };

  // Cart operations
  const addToCart = (foodId, quantity = 1) => {
    const item = foodItems.find(f => (f._id === foodId || f.id === foodId));
    if (!item) return;

    if (!item.available || item.stock <= 0) {
      showToast(`Sorry, ${item.name} is currently out of stock.`, 'error');
      return;
    }

    const existingInCart = cart.find(c => c.foodId === foodId);
    const existingQty = existingInCart ? existingInCart.quantity : 0;
    const requestedTotal = existingQty + quantity;

    if (requestedTotal > item.stock) {
      showToast(`Only ${item.stock} unit(s) available for ${item.name}.`, 'warning');
      return;
    }

    if (existingInCart) {
      setCart(cart.map(c => c.foodId === foodId ? { ...c, quantity: requestedTotal } : c));
    } else {
      setCart([...cart, { foodId, quantity }]);
    }

    showToast(`Added ${item.name} to cart!`, 'success');
  };

  const updateCartQuantity = (foodId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(foodId);
      return;
    }

    const item = foodItems.find(f => (f._id === foodId || f.id === foodId));
    if (item && newQty > item.stock) {
      showToast(`Only ${item.stock} unit(s) available for ${item.name}.`, 'warning');
      return;
    }

    setCart(cart.map(c => c.foodId === foodId ? { ...c, quantity: newQty } : c));
  };

  const removeFromCart = (foodId) => {
    setCart(cart.filter(c => c.foodId !== foodId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartDetails = () => {
    const items = cart.map(c => {
      const food = foodItems.find(f => (f._id === c.foodId || f.id === c.foodId));
      return food ? { ...food, quantity: c.quantity, subtotal: food.price * c.quantity } : null;
    }).filter(Boolean);

    const subtotal = items.reduce((acc, i) => acc + i.subtotal, 0);
    const tax = Math.round(subtotal * 0.05); // 5% GST
    const total = subtotal + tax;

    return { items, subtotal, tax, total };
  };

  // Place Order API Call
  const placeOrder = async ({ pickupSlotId, paymentMethod = 'Campus Wallet' }) => {
    if (cart.length === 0) {
      return { success: false, error: 'Cart is empty.' };
    }

    const { items } = getCartDetails();

    try {
      const res = await api.placeOrder({
        userId: currentUser ? (currentUser.id || currentUser._id) : 'usr-1',
        userName: currentUser ? currentUser.name : 'Aditya Sharma',
        userEmail: currentUser ? currentUser.email : 'student@college.edu',
        items: items.map(i => ({ foodId: i._id || i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
        pickupSlotId,
        paymentMethod
      });

      if (!res.success) {
        showToast(res.error, 'error');
        return { success: false, error: res.error };
      }

      setCart([]);
      setTrackedOrderId(res.order.orderId || res.order._id);
      await refreshBackendData();

      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      showToast(`Order #${res.order.orderId || 'SC-9402'} confirmed! Stock updated in MongoDB.`, 'success');

      return { success: true, order: res.order };
    } catch (err) {
      return { success: false, error: 'Network error placing order.' };
    }
  };

  // Order Lifecycle Status Update
  const updateOrderStatus = async (orderId, targetStatus) => {
    try {
      const res = await api.updateOrderStatus(orderId, targetStatus);
      if (!res.success) {
        showToast(res.error, 'error');
        return;
      }

      await refreshBackendData();

      if (targetStatus === 'Ready') {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.4 } });
        showToast(`🔔 ORDER READY: #${orderId} is ready at Counter 1!`, 'success');
      } else {
        showToast(`Order #${orderId} updated to state: ${targetStatus}`, 'info');
      }
    } catch (err) {
      showToast('Error updating order status.', 'error');
    }
  };

  // Cancel Order & Restore Stock
  const cancelOrder = async (orderId) => {
    try {
      const res = await api.cancelOrder(orderId);
      if (!res.success) {
        showToast(res.error, 'error');
        return;
      }

      await refreshBackendData();
      showToast(`Order #${orderId} cancelled. Stock restored & slot booking decremented!`, 'info');
    } catch (err) {
      showToast('Failed to cancel order.', 'error');
    }
  };

  // Admin & Staff Operations
  const addFoodItem = async (foodData) => {
    const res = await api.createFood(foodData);
    if (res.success) {
      await refreshBackendData();
      showToast(`Added ${foodData.name} to menu!`, 'success');
    }
  };

  const editFoodItem = async (id, updatedData) => {
    const res = await api.updateFood(id, updatedData);
    if (res.success) {
      await refreshBackendData();
      showToast('Food item updated', 'success');
    }
  };

  const deleteFoodItem = async (id) => {
    const res = await api.deleteFood(id);
    if (res.success) {
      await refreshBackendData();
      showToast('Food item deleted', 'info');
    }
  };

  const updateStock = async (id, newStock) => {
    const res = await api.updateFoodStock(id, newStock);
    if (res.success) {
      await refreshBackendData();
      showToast(`Stock level updated to ${newStock}`, 'success');
    }
  };

  const toggleFoodAvailability = async (id) => {
    const res = await api.toggleFoodAvailability(id);
    if (res.success) {
      await refreshBackendData();
      showToast('Availability status toggled', 'info');
    }
  };

  const createPickupSlot = async (slotData) => {
    const res = await api.createSlot(slotData);
    if (res.success) {
      await refreshBackendData();
      showToast(`Created slot ${slotData.startTime} – ${slotData.endTime}`, 'success');
    }
  };

  const updateSlotCapacity = async (id, capacity) => {
    const slot = pickupSlots.find(s => (s._id === id || s.id === id));
    if (!slot) return;
    const res = await api.updateSlot(id, { capacity, active: slot.active });
    if (res.success) {
      await refreshBackendData();
      showToast(`Capacity updated to ${capacity}`, 'success');
    }
  };

  const toggleSlotActive = async (id) => {
    const slot = pickupSlots.find(s => (s._id === id || s.id === id));
    if (!slot) return;
    const res = await api.updateSlot(id, { capacity: slot.capacity, active: !slot.active });
    if (res.success) {
      await refreshBackendData();
      showToast('Slot active state toggled', 'info');
    }
  };

  const resetDemoData = async () => {
    await api.resetSeed();
    await refreshBackendData();
    setCart([
      { foodId: 'food-1', quantity: 1 },
      { foodId: 'food-5', quantity: 1 }
    ]);
    setStudentTab('dashboard');
    showToast('MongoDB collections re-seeded with clean demo data!', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        users: [],
        currentUser,
        registerUser,
        loginUser,
        updateUserProfile,
        isEditProfileOpen,
        setIsEditProfileOpen,
        switchRoleDemo,
        logout: logoutUser,
        logoutUser,
        foodItems,
        pickupSlots,
        orders,
        pagination,
        orderFilters,
        setOrderFilters,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        getCartDetails,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        addFoodItem,
        editFoodItem,
        deleteFoodItem,
        updateStock,
        toggleFoodAvailability,
        createPickupSlot,
        updateSlotCapacity,
        toggleSlotActive,
        studentTab,
        setStudentTab,
        staffTab,
        setStaffTab,
        adminTab,
        setAdminTab,
        trackedOrderId,
        setTrackedOrderId,
        staffSelectedOrderId,
        setStaffSelectedOrderId,
        selectedFoodModal,
        setSelectedFoodModal,
        toast,
        showToast,
        resetDemoData,
        refreshBackendData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
