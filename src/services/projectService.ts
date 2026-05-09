import apiClient from '@/lib/axios';

// Better Auth uses cookie-based sessions - no manual token needed
export const projectService = {
  getAllProjects: async (params?: any) => {
    const response = await apiClient.get('/projects', { params });
    return response.data;
  },

  createProject: async (projectData: any) => {
    const response = await apiClient.post('/projects', projectData);
    return response.data;
  },

  getProjectById: async (id: string) => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },
  
  getMyProjects: async () => {
    const response = await apiClient.get('/projects/my/all');
    return response.data;
  },

  updateProject: async (id: string, projectData: any) => {
    const response = await apiClient.put(`/projects/${id}`, projectData);
    return response.data;
  },

  deleteProject: async (id: string) => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  },
};
