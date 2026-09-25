const API_BASE_URL = (typeof process !== 'undefined' && process.env && process.env.VITE_API_BASE_URL) 
  || (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) 
  || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('smartcanteen_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const safeFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      return { success: false, error: errJson.error || `HTTP ${res.status}: ${res.statusText}` };
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn(`[API Call Failed] ${url}:`, err.message);
    return { success: false, error: err.message || 'Server connection failed' };
  }
};

export const api = {
  // Authentication
  register: async (userData) => {
    return await safeFetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
  },

  login: async (email, password) => {
    return await safeFetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  },

  updateProfile: async (profileData) => {
    return await safeFetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(profileData)
    });
  },

  // Foods
  getFoods: async (category = '', search = '') => {
    let url = `${API_BASE_URL}/foods?`;
    if (category) url += `category=${encodeURIComponent(category)}&`;
    if (search) url += `search=${encodeURIComponent(search)}`;
    return await safeFetch(url);
  },

  createFood: async (foodData) => {
    return await safeFetch(`${API_BASE_URL}/foods`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(foodData)
    });
  },

  updateFood: async (id, foodData) => {
    return await safeFetch(`${API_BASE_URL}/foods/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(foodData)
    });
  },

  updateFoodStock: async (id, stock) => {
    return await safeFetch(`${API_BASE_URL}/foods/${id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ stock })
    });
  },

  toggleFoodAvailability: async (id) => {
    return await safeFetch(`${API_BASE_URL}/foods/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() }
    });
  },

  deleteFood: async (id) => {
    return await safeFetch(`${API_BASE_URL}/foods/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
  },

  // Slots
  getSlots: async () => {
    return await safeFetch(`${API_BASE_URL}/slots`);
  },

  createSlot: async (slotData) => {
    return await safeFetch(`${API_BASE_URL}/slots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(slotData)
    });
  },

  updateSlot: async (id, slotData) => {
    return await safeFetch(`${API_BASE_URL}/slots/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(slotData)
    });
  },

  // Orders with Pagination & Date Filtering
  getOrders: async ({ userId = '', status = '', startDate = '', endDate = '', page = 1, limit = 10, sortBy = 'createdAt' } = {}) => {
    let url = `${API_BASE_URL}/orders?page=${page}&limit=${limit}&sortBy=${sortBy}&`;
    if (userId) url += `userId=${encodeURIComponent(userId)}&`;
    if (status && status !== 'All') url += `status=${encodeURIComponent(status)}&`;
    if (startDate) url += `startDate=${encodeURIComponent(startDate)}&`;
    if (endDate) url += `endDate=${encodeURIComponent(endDate)}&`;

    return await safeFetch(url, { headers: getAuthHeader() });
  },

  placeOrder: async (orderData) => {
    return await safeFetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(orderData)
    });
  },

  updateOrderStatus: async (id, status) => {
    return await safeFetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status })
    });
  },

  cancelOrder: async (id) => {
    return await safeFetch(`${API_BASE_URL}/orders/${id}/cancel`, {
      method: 'POST',
      headers: getAuthHeader()
    });
  },

  resetSeed: async () => {
    return await safeFetch(`${API_BASE_URL}/seed/reset`, {
      method: 'POST'
    });
  }
};
