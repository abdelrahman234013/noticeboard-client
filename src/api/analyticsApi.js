import api from './axios';

export const getAnalyticsOverview = async () => {
  const response = await api.get('/api/admin/analytics/overview');
  return response.data;
};

export const getPopularNotices = async (limit = 5) => {
  const response = await api.get('/api/admin/analytics/popular-notices', {
    params: { limit },
  });
  return response.data;
};

export const getPopularCategories = async () => {
  const response = await api.get('/api/admin/analytics/popular-categories');
  return response.data;
};

export const getExpiringSoon = async (days = 3) => {
  const response = await api.get('/api/admin/analytics/expiring-soon', {
    params: { days },
  });
  return response.data;
};
