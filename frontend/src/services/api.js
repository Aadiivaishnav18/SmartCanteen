const getApiBaseUrl = () => {
  const envUrl =
    (typeof import.meta !== 'undefined' &&
      import.meta.env &&
      (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL)) ||
    (typeof process !== 'undefined' &&
      process.env &&
      (process.env.VITE_API_BASE_URL || process.env.VITE_API_URL));

  // Local development fallback only
  const baseUrl = envUrl || 'https://smart-canteen-nine-opal.vercel.app/api';

  const cleanUrl = String(baseUrl)
    .trim()
    .replace(/\/+$/, '');

  return cleanUrl.endsWith('/api')
    ? cleanUrl
    : `${cleanUrl}/api`;
};

const API_BASE_URL = getApiBaseUrl();

console.log('[API] Base URL:', API_BASE_URL);

const getAuthHeader = () => {
  const token = localStorage.getItem('smartcanteen_token');

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
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

    // Handle non-JSON responses safely
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
        error:
          data?.error ||
          data?.message ||
          `HTTP ${response.status}: ${response.statusText}`,
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
  },

  login: async (email, password) => {
    return safeFetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
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
  // FOODS
  // =========================

  getFoods: async (category = '', search = '') => {
    const params = new URLSearchParams();

    if (category) {
      params.append('category', category);
    }

    if (search) {
      params.append('search', search);
    }

    const query = params.toString();

    const url = query
      ? `${API_BASE_URL}/foods?${query}`
      : `${API_BASE_URL}/foods`;

    return safeFetch(url);
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
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
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

  // =========================
  // ORDERS
  // =========================

  getOrders: async ({
    userId = '',
    status = '',
    startDate = '',
    endDate = '',
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
  } = {}) => {
    const params = new URLSearchParams();

    params.append('page', page);
    params.append('limit', limit);
    params.append('sortBy', sortBy);

    if (userId) {
      params.append('userId', userId);
    }

    if (status && status !== 'All') {
      params.append('status', status);
    }

    if (startDate) {
      params.append('startDate', startDate);
    }

    if (endDate) {
      params.append('endDate', endDate);
    }

    return safeFetch(
      `${API_BASE_URL}/orders?${params.toString()}`,
      {
        headers: {
          ...getAuthHeader(),
        },
      }
    );
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

  cancelOrder: async (id) => {
    return safeFetch(`${API_BASE_URL}/orders/${id}/cancel`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
      },
    });
  },

  // =========================
  // SEED
  // =========================

  resetSeed: async () => {
    return safeFetch(`${API_BASE_URL}/seed/reset`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
      },
    });
  },
};