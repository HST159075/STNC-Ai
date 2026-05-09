import apiClient from '@/lib/axios';

export const userService = {
  syncUser: async (userData: { id: string; email: string; name: string; avatarUrl?: string }) => {
    const response = await apiClient.post('/users/sync', userData);
    return response.data;
  },

  getProfile: async (userId: string) => {
    const response = await apiClient.get(`/users/profile/${userId}`);
    return response.data;
  },
  
  updateProfile: async (userData: any) => {
    const response = await apiClient.put('/users/profile', userData);
    return response.data;
  },

  getStats: async () => {
    const response = await apiClient.get('/users/stats');
    return response.data;
  },

  getHireHistory: async () => {
    const response = await apiClient.get('/users/hire-history');
    return response.data;
  },
};
