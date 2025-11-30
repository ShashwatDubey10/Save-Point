import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    const { data } = response.data; // Backend returns { success, data: { user, token } }

    if (!data || !data.token || !data.user) {
      throw new Error('Invalid response from server');
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return { user: data.user, token: data.token };
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    const { data } = response.data; // Backend returns { success, data: { user, token } }

    if (!data || !data.token || !data.user) {
      throw new Error('Invalid response from server');
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return { user: data.user, token: data.token };
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  async getMe() {
    const response = await api.get('/auth/me');
    // Backend returns { success, data: user }
    return { user: response.data.data };
  },

  async updateProfile(profileData) {
    const response = await api.put('/auth/me', profileData);
    const user = response.data.data;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    return { user };
  },

  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
