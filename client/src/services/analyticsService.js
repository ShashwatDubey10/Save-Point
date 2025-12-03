import api from './api';

export const analyticsService = {
  // Get complete dashboard overview
  getDashboardOverview: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  // Get weekly summary for progress chart
  getWeeklySummary: async () => {
    const response = await api.get('/analytics/weekly');
    return response.data;
  },

  // Get heatmap data
  getHeatmapData: async (startDate = null, endDate = null, habitId = null) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (habitId) params.habitId = habitId;

    const response = await api.get('/analytics/heatmap', { params });
    return response.data;
  },

  // Get habit trends
  getHabitTrends: async (period = 30, habitId = null) => {
    const params = { period };
    if (habitId) params.habitId = habitId;

    const response = await api.get('/analytics/trends', { params });
    return response.data;
  },

  // Get category breakdown
  getCategoryBreakdown: async () => {
    const response = await api.get('/analytics/categories');
    return response.data;
  },

  // Get monthly summary
  getMonthlySummary: async (month = null, year = null) => {
    const params = {};
    if (month) params.month = month;
    if (year) params.year = year;

    const response = await api.get('/analytics/monthly', { params });
    return response.data;
  },

  // Get personal records
  getPersonalRecords: async () => {
    const response = await api.get('/analytics/records');
    return response.data;
  }
};

export default analyticsService;
