import api from './api';
import apiCache from '../utils/apiCache';

export const taskService = {
  // Create a new task
  async create(taskData) {
    const response = await api.post('/tasks', taskData);
    // Invalidate tasks cache
    apiCache.invalidate('/tasks');
    return response.data.data;
  },

  // Get all tasks with optional filters
  async getAll(filters = {}) {
    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.category) params.append('category', filters.category);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const response = await api.get(`/tasks?${params.toString()}`);
    return response.data.data;
  },

  // Get a single task by ID
  async getById(id) {
    const response = await api.get(`/tasks/${id}`);
    return response.data.data;
  },

  // Update a task
  async update(id, updates) {
    const response = await api.put(`/tasks/${id}`, updates);
    // Invalidate tasks cache
    apiCache.invalidate('/tasks');
    return response.data.data;
  },

  // Delete a task
  async delete(id) {
    const response = await api.delete(`/tasks/${id}`);
    // Invalidate tasks cache
    apiCache.invalidate('/tasks');
    return response.data;
  },

  // Toggle task completion status
  async toggleStatus(id) {
    const response = await api.post(`/tasks/${id}/toggle`);
    // Invalidate tasks cache
    apiCache.invalidate('/tasks');
    return response.data; // Return full response including points data
  },

  // Update task status directly
  async updateStatus(id, status) {
    const response = await api.put(`/tasks/${id}`, { status });
    // Invalidate tasks cache
    apiCache.invalidate('/tasks');
    return response.data; // Return full response including points data
  },

  // Toggle subtask completion
  async toggleSubtask(taskId, subtaskId) {
    const response = await api.post(`/tasks/${taskId}/subtasks/${subtaskId}/toggle`);
    return response.data.data;
  },

  // Get upcoming tasks
  async getUpcoming(days = 7) {
    const response = await api.get(`/tasks/upcoming/${days}`);
    return response.data.data;
  },

  // Get overdue tasks
  async getOverdue() {
    const response = await api.get('/tasks/overdue');
    return response.data.data;
  },

  // Get task statistics
  async getStats() {
    const response = await api.get('/tasks/stats');
    return response.data.data;
  },
};
