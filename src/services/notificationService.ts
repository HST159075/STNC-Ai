import apiClient from '@/lib/axios';

export const notificationService = {
  getUserNotifications: async (userId: string) => {
    const response = await apiClient.get(`/notifications/${userId}`);
    return response.data;
  },

  markAsRead: async (notificationId: string) => {
    const response = await apiClient.patch(`/notifications/${notificationId}/read`);
    return response.data;
  }
};
