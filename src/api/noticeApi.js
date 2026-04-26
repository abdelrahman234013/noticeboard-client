import api from './axios';

export const getPublicNotices = async (params) => {
  const response = await api.get('/api/notices', { params });
  return response.data;
};

export const getNoticeDetails = async (id) => {
  const response = await api.get(`/api/notices/${id}`);
  return response.data;
};

export const getAdminNotices = async (params) => {
  const response = await api.get('/api/notices/admin/all', { params });
  return response.data;
};

export const createNotice = async (formData) => {
  const response = await api.post('/api/notices', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateNotice = async (id, formData) => {
  const response = await api.put(`/api/notices/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const pinNotice = async (id) => {
  const response = await api.patch(`/api/notices/${id}/pin`);
  return response.data;
};

export const unpinNotice = async (id) => {
  const response = await api.patch(`/api/notices/${id}/unpin`);
  return response.data;
};

export const deleteNotice = async (id) => {
  const response = await api.delete(`/api/notices/${id}`);
  return response.data;
};
