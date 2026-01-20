import api from './api';

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
    return response.data;
  },

  async update(id, habitData) {
    const response = await api.put(`/habits/${id}`, habitData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/habits/${id}`);
    return response.data;
  },

  async complete(id) {
    const response = await api.post(`/habits/${id}/complete`);
    return response.data;
  },

  async uncomplete(id) {
    const response = await api.post(`/habits/${id}/uncomplete`);
    return response.data;
  },

  async getStats() {
    const response = await api.get('/habits/stats');
    return response.data;
  },

  async reorder(habitIds) {
    const response = await api.put('/habits/reorder', { habitIds });
    return response.data;
  },

  async completeForDate(id, date, note = '', mood = null) {
    const response = await api.post(`/habits/${id}/complete-date`, { date, note, mood });
    return response.data;
  },

  async uncompleteForDate(id, date) {
    const response = await api.post(`/habits/${id}/uncomplete-date`, { date });
    return response.data;
  },
};
