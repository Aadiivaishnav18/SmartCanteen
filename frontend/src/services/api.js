const API_BASE_URL = (typeof process !== 'undefined' && process.env && process.env.VITE_API_BASE_URL) 
  || (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) 
  || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('smartcanteen_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  // Authentication
  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  updateProfile: async (profileData) => {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(profileData)
    });
    return res.json();
  },

  // Foods
  getFoods: async (category = '', search = '') => {
    let url = `${API_BASE_URL}/foods?`;
    if (category) url += `category=${encodeURIComponent(category)}&`;
    if (search) url += `search=${encodeURIComponent(search)}`;
    const res = await fetch(url);
    return res.json();
  },

  createFood: async (foodData) => {
    const res = await fetch(`${API_BASE_URL}/foods`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(foodData)
    });
    return res.json();
  },

  updateFood: async (id, foodData) => {
    const res = await fetch(`${API_BASE_URL}/foods/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(foodData)
    });
    return res.json();
  },

  updateFoodStock: async (id, stock) => {
    const res = await fetch(`${API_BASE_URL}/foods/${id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ stock })
    });
    return res.json();
  },

  toggleFoodAvailability: async (id) => {
    const res = await fetch(`${API_BASE_URL}/foods/${id}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeader()
    });
    return res.json();
  },

  deleteFood: async (id) => {
    const res = await fetch(`${API_BASE_URL}/foods/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Slots
  getSlots: async () => {
    const res = await fetch(`${API_BASE_URL}/slots`);
    return res.json();
  },

  createSlot: async (slotData) => {
    const res = await fetch(`${API_BASE_URL}/slots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(slotData)
    });
    return res.json();
  },

  updateSlot: async (id, slotData) => {
    const res = await fetch(`${API_BASE_URL}/slots/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(slotData)
    });
    return res.json();
  },

  // Orders with Pagination & Date Filtering
  getOrders: async ({ userId = '', status = '', startDate = '', endDate = '', page = 1, limit = 10, sortBy = 'createdAt' } = {}) => {
    let url = `${API_BASE_URL}/orders?page=${page}&limit=${limit}&sortBy=${sortBy}&`;
    if (userId) url += `userId=${encodeURIComponent(userId)}&`;
    if (status && status !== 'All') url += `status=${encodeURIComponent(status)}&`;
    if (startDate) url += `startDate=${encodeURIComponent(startDate)}&`;
    if (endDate) url += `endDate=${encodeURIComponent(endDate)}&`;

    const res = await fetch(url, { headers: getAuthHeader() });
    return res.json();
  },

  placeOrder: async (orderData) => {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  updateOrderStatus: async (id, status) => {
    const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  cancelOrder: async (id) => {
    const res = await fetch(`${API_BASE_URL}/orders/${id}/cancel`, {
      method: 'POST',
      headers: getAuthHeader()
    });
    return res.json();
  },

  resetSeed: async () => {
    const res = await fetch(`${API_BASE_URL}/seed/reset`, {
      method: 'POST'
    });
    return res.json();
  }
};
