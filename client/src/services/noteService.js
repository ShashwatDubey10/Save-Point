import api from './api';

export const noteService = {
  // Get all notes
  async getAll(archived = false) {
    const response = await api.get(`/notes?archived=${archived}`);
    return response.data.data;
  },

  // Get single note
  async getById(id) {
    const response = await api.get(`/notes/${id}`);
    return response.data.data;
  },

  // Create note
  async create(noteData) {
    const response = await api.post('/notes', noteData);
    return response.data.data;
  },

  // Update note
  async update(id, noteData) {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data.data;
  },

  // Delete note
  async delete(id) {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },

  // Toggle pin
  async togglePin(id) {
    const response = await api.post(`/notes/${id}/toggle-pin`);
    return response.data.data;
  },

  // Toggle archive
  async toggleArchive(id) {
    const response = await api.post(`/notes/${id}/toggle-archive`);
    return response.data.data;
  },

  // Duplicate note
  async duplicate(id) {
    const response = await api.post(`/notes/${id}/duplicate`);
    return response.data.data;
  }
};
