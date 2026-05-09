import api from "@/services/api";

export const syncUserAction = async (userData: any) => {
  try {
    const response = await api.post("/users/sync", userData);
    return response.data;
  } catch (error) {
    console.error("Error syncing user:", error);
    throw error;
  }
};

export const getUserProfileAction = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
