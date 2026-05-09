import apiClient from "@/lib/axios";

export const adminService = {
  getStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },

  getPendingApplications: async () => {
    const response = await apiClient.get('/admin/applications');
    return response.data;
  },

  approveApplication: async (applicantId: string) => {
    const response = await apiClient.post('/users/approve-freelancer', { applicantId });
    return response.data;
  },

  getUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },

  updateUser: async (userId: string, data: any) => {
    const response = await apiClient.patch(`/admin/users/${userId}`, data);
    return response.data;
  },
  
  getProjects: async (params: { page?: number; limit?: number; search?: string; status?: string }) => {
    const response = await apiClient.get('/admin/projects', { params });
    return response.data;
  },
};
