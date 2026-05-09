import apiClient from '@/lib/axios';

// Better Auth uses cookie-based sessions - no manual token needed
export const stripeService = {
  createPaymentIntent: async (amount: number, currency: string) => {
    const response = await apiClient.post('/payments/create-intent', { amount, currency });
    return response.data;
  },

  verifyPayment: async (paymentIntentId: string) => {
    const response = await apiClient.post('/payments/verify', { paymentIntentId });
    return response.data;
  }
};
