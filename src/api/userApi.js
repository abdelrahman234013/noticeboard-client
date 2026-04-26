import api from './axios';

export const getUserStats = async () => {
  const response = await api.get('/api/admin/users/stats');
  return response.data;
};

export const getAllUsers = async (params = {}) => {
  const response = await api.get('/api/admin/users', { params });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/api/admin/users/${id}`);
  return response.data;
};

export const updateUserRole = async (id, role) => {
  const response = await api.patch(`/api/admin/users/${id}/role`, { role });
  return response.data;
};

export const deactivateUser = async (id) => {
  const response = await api.patch(`/api/admin/users/${id}/deactivate`);
  return response.data;
};

export const activateUser = async (id) => {
  const response = await api.patch(`/api/admin/users/${id}/activate`);
  return response.data;
};

export const getMyPreferences = async () => {
  const response = await api.get('/api/notifications/preferences');
  return response.data;
};

export const updateMyPreferences = async (preferences) => {
  const response = await api.put('/api/notifications/preferences', preferences);
  return response.data;
};

export const getMyNotificationHistory = async (params = {}) => {
  const response = await api.get('/api/notifications/history', { params });
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await api.get('/api/notifications/unread-count');
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await api.patch('/api/notifications/read-all');
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await api.patch(`/api/notifications/${id}/read`);
  return response.data;
};
