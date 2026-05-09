import apiClient from "@/lib/axios";

export const messageService = {
  // Start or get existing conversation
  startConversation: async (participantId: string) => {
    const response = await apiClient.post('/messages/conversations', { participantId });
    return response.data;
  },

  // Get all conversations for the logged-in user
  getConversations: async () => {
    const response = await apiClient.get('/messages/conversations');
    return response.data;
  },

  // Get messages for a specific conversation
  getMessages: async (conversationId: string) => {
    const response = await apiClient.get(`/messages/conversations/${conversationId}`);
    return response.data;
  },

  // Send a message
  sendMessage: async (conversationId: string, content: string, attachmentUrl?: string, attachmentType?: string) => {
    const response = await apiClient.post(`/messages/conversations/${conversationId}/messages`, { 
      content, 
      attachmentUrl, 
      attachmentType 
    });
    return response.data;
  }
};
