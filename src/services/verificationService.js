import { verificationApi } from '../api/verificationApi';
import { storage } from '../utils/storage';

export const verificationService = {
  submitVerification: async (verificationData) => {
    try {
      const token = await storage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await verificationApi.submitVerification(verificationData, token);
      return response;
    } catch (error) {
      console.error('Verification service error:', error);
      throw new Error(error.message || 'Failed to submit verification');
    }
  },
};