import api from './api';
import apiCache from '../utils/apiCache';

export const habitService = {
  async getAll() {
    const response = await api.get('/habits');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/habits/${id}`);
    return response.data;
  },

  async create(habitData) {
    const response = await api.post('/habits', habitData);
    // Invalidate habits cache
    apiCache.invalidate('/habits');
    return response.data;
  },

  async update(id, habitData) {
    const response = await api.put(`/habits/${id}`, habitData);
    // Invalidate habits cache
    apiCache.invalidate('/habits');
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/habits/${id}`);
    // Invalidate habits cache
    apiCache.invalidate('/habits');
    return response.data;
  },

  async complete(id, date = null) {
    // Send the user's local date in YYYY-MM-DD format to ensure correct calendar day
    // If no date provided, use today in user's local timezone
    let body = {};
    if (!date) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      body.date = `${year}-${month}-${day}`;
    } else {
      body.date = date;
    }
    const response = await api.post(`/habits/${id}/complete`, body);
    // Invalidate habits and analytics cache
    apiCache.invalidate('/habits');
    apiCache.invalidate('/analytics');
    return response.data;
  },

  async uncomplete(id) {
    const response = await api.post(`/habits/${id}/uncomplete`);
    // Invalidate habits and analytics cache
    apiCache.invalidate('/habits');
    apiCache.invalidate('/analytics');
    return response.data;
  },

  async getStats() {
    const response = await api.get('/habits/stats');
    return response.data;
  },

  async reorder(habitIds) {
    const response = await api.put('/habits/reorder', { habitIds });
    // Invalidate habits cache
    apiCache.invalidate('/habits');
    return response.data;
  },

  async completeForDate(id, date, note = '', mood = null) {
    const response = await api.post(`/habits/${id}/complete-date`, { date, note, mood });
    // Invalidate habits and analytics cache
    apiCache.invalidate('/habits');
    apiCache.invalidate('/analytics');
    return response.data;
  },

  async uncompleteForDate(id, date) {
    const response = await api.post(`/habits/${id}/uncomplete-date`, { date });
    // Invalidate habits and analytics cache
    apiCache.invalidate('/habits');
    apiCache.invalidate('/analytics');
    return response.data;
  },
};
