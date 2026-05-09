import apiClient from '@/lib/axios';

export const aiService = {
  getInsights: async () => {
    const response = await apiClient.get('/ai/insights');
    return response.data;
  },

  getArchitectAdvice: async (message: string) => {
    const response = await apiClient.post('/ai/chat', { message });
    return response.data;
  },

  generateBrief: async (title: string, category: string) => {
    const response = await apiClient.post('/ai/generate-brief', { title, category });
    return response.data;
  },

  suggestTags: async (description: string) => {
    const response = await apiClient.post('/ai/suggest-tags', { description });
    return response.data;
  },

  auditProjectBids: async (projectId: string) => {
    const response = await apiClient.get(`/ai/audit-bids/${projectId}`);
    return response.data;
  },

  optimizeProfile: async () => {
    const response = await apiClient.get('/ai/optimize-profile');
    return response.data;
  }
};
