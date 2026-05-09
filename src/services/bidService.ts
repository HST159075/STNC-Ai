import apiClient from '@/lib/axios';

// Better Auth uses cookie-based sessions - no manual token needed
export const bidService = {
  placeBid: async (bidData: any) => {
    const response = await apiClient.post('/bids', bidData);
    return response.data;
  },

  getProjectBids: async (projectId: string) => {
    const response = await apiClient.get(`/bids/${projectId}`);
    return response.data;
  },
};
