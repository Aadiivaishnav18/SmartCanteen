const getApiBaseUrl = () => {
  const envUrl = process.env.VITE_API_BASE_URL || process.env.VITE_API_URL || process.env.REACT_APP_API_URL;

  if (!envUrl) {
    return 'http://localhost:5000/api';
  }

  const cleanUrl = String(envUrl).trim().replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const API_BASE_URL = getApiBaseUrl();

console.log('[API] Base URL:', API_BASE_URL);

const getAuthHeader = () => {
  const token = localStorage.getItem('smartcanteen_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const safeFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
      },
    });

    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[API Non-JSON Response]', {
        url,
        status: response.status,
        contentType,
        response: text.substring(0, 300),
      });

      return {
        success: false,
        error: `API returned non-JSON response (${response.status})`,
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return data;
  } catch (error) {
    console.error('[API Call Failed]', url, error);
    return {
      success: false,
      error: error?.message || 'Server connection failed',
    };
  }
};

export const api = {
  // =========================
  // AUTHENTICATION
  // =========================

  register: async (userData) => {
    return safeFetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
  },

  signup: async (userData) => {
    return safeFetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
  },

  login: async (email, password) => {
    return safeFetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    return safeFetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
  },

  getProfile: async () => {
    return safeFetch(`${API_BASE_URL}/auth/profile`, {
      headers: { ...getAuthHeader() },
    });
  },

  updateProfile: async (profileData) => {
    return safeFetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(profileData),
    });
  },

  // =========================
  // FOODS / MENU
  // =========================

  getFoods: async (category = '', search = '', page = 1, limit = 100) => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);

    const query = params.toString();
    const url = query ? `${API_BASE_URL}/foods?${query}` : `${API_BASE_URL}/foods`;
    return safeFetch(url);
  },

  getCategories: async () => {
    return safeFetch(`${API_BASE_URL}/foods/categories`);
  },

  getFoodById: async (id) => {
    return safeFetch(`${API_BASE_URL}/foods/${id}`);
  },

  createFood: async (foodData) => {
    return safeFetch(`${API_BASE_URL}/foods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(foodData),
    });
  },

  updateFood: async (id, foodData) => {
    return safeFetch(`${API_BASE_URL}/foods/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(foodData),
    });
  },

  updateFoodStock: async (id, stock) => {
    return safeFetch(`${API_BASE_URL}/foods/${id}/stock`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ stock }),
    });
  },

  toggleFoodAvailability: async (id) => {
    return safeFetch(`${API_BASE_URL}/foods/${id}/toggle`, {
      method: 'PATCH',
      headers: {
        ...getAuthHeader(),
      },
    });
  },

  bulkPriceUpdate: async (percentage, fixedAmount, category) => {
    return safeFetch(`${API_BASE_URL}/foods/bulk-price`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ percentage, fixedAmount, category }),
    });
  },

  deleteFood: async (id) => {
    return safeFetch(`${API_BASE_URL}/foods/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader(),
      },
    });
  },

  // =========================
  // CART
  // =========================

  getCart: async (userId) => {
    return safeFetch(`${API_BASE_URL}/cart${userId ? `?userId=${userId}` : ''}`, {
      headers: { ...getAuthHeader() },
    });
  },

  addToCart: async (foodId, quantity = 1, userId) => {
    return safeFetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ foodId, menuItemId: foodId, quantity, userId }),
    });
  },

  updateCartQty: async (foodId, quantity, userId) => {
    return safeFetch(`${API_BASE_URL}/cart/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ foodId, menuItemId: foodId, quantity, userId }),
    });
  },

  removeFromCart: async (foodId, userId) => {
    return safeFetch(`${API_BASE_URL}/cart/remove`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ foodId, menuItemId: foodId, userId }),
    });
  },

  clearCart: async (userId) => {
    return safeFetch(`${API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ userId }),
    });
  },

  // =========================
  // SLOTS
  // =========================

  getSlots: async () => {
    return safeFetch(`${API_BASE_URL}/slots`);
  },

  createSlot: async (slotData) => {
    return safeFetch(`${API_BASE_URL}/slots`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(slotData),
    });
  },

  createBulkSlots: async (slots) => {
    return safeFetch(`${API_BASE_URL}/slots/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ slots }),
    });
  },

  updateSlot: async (id, slotData) => {
    return safeFetch(`${API_BASE_URL}/slots/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(slotData),
    });
  },

  deleteSlot: async (id) => {
    return safeFetch(`${API_BASE_URL}/slots/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
  },

  // =========================
  // ORDERS
  // =========================

  getOrders: async ({
    userId = '',
    status = '',
    startDate = '',
    endDate = '',
    search = '',
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
  } = {}) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    params.append('sortBy', sortBy);

    if (userId) params.append('userId', userId);
    if (status && status !== 'All') params.append('status', status);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (search) params.append('search', search);

    return safeFetch(`${API_BASE_URL}/orders?${params.toString()}`, {
      headers: { ...getAuthHeader() },
    });
  },

  getOrderById: async (id) => {
    return safeFetch(`${API_BASE_URL}/orders/${id}`, {
      headers: { ...getAuthHeader() },
    });
  },

  getOrderStatus: async (id) => {
    return safeFetch(`${API_BASE_URL}/orders/${id}/status`);
  },

  placeOrder: async (orderData) => {
    return safeFetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(orderData),
    });
  },

  updateOrderStatus: async (id, status) => {
    return safeFetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status }),
    });
  },

  cancelOrder: async (id, reason = '') => {
    return safeFetch(`${API_BASE_URL}/orders/${id}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ reason }),
    });
  },

  // =========================
  // PAYMENT
  // =========================

  processFakePayment: async (orderId, paymentMethod = 'Campus Wallet') => {
    return safeFetch(`${API_BASE_URL}/payment/fake-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ orderId, paymentMethod }),
    });
  },

  getPaymentStatus: async (orderId) => {
    return safeFetch(`${API_BASE_URL}/payment/status/${orderId}`);
  },

  // =========================
  // STAFF & ADMIN ANALYTICS
  // =========================

  getStaffOrders: async (status = '', pickupSlotId = '') => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (pickupSlotId) params.append('pickupSlotId', pickupSlotId);
    return safeFetch(`${API_BASE_URL}/staff/orders?${params.toString()}`, {
      headers: { ...getAuthHeader() },
    });
  },

  bulkUpdateOrderStatus: async (orderIds, status) => {
    return safeFetch(`${API_BASE_URL}/staff/orders/bulk-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ orderIds, status }),
    });
  },

  getLowStockAlerts: async () => {
    return safeFetch(`${API_BASE_URL}/staff/alerts/low-stock`, {
      headers: { ...getAuthHeader() },
    });
  },

  getStaffAnalytics: async () => {
    return safeFetch(`${API_BASE_URL}/staff/analytics`, {
      headers: { ...getAuthHeader() },
    });
  },

  getSalesAnalytics: async () => {
    return safeFetch(`${API_BASE_URL}/admin/analytics/sales`, {
      headers: { ...getAuthHeader() },
    });
  },

  getItemAnalytics: async () => {
    return safeFetch(`${API_BASE_URL}/admin/analytics/items`, {
      headers: { ...getAuthHeader() },
    });
  },

  getOverviewAnalytics: async () => {
    return safeFetch(`${API_BASE_URL}/admin/analytics/overview`, {
      headers: { ...getAuthHeader() },
    });
  },

  // =========================
  // SEED
  // =========================

  resetSeed: async () => {
    return safeFetch(`${API_BASE_URL}/seed/reset`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
  },
};