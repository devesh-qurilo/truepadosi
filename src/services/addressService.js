import { addressApi } from '../api/addressApi';
import { storage } from '../utils/storage';

export const addressService = {
  submitAddress: async (addressData) => {
    try {
      const token = await storage.getItem('authToken');
      const response = await addressApi.submitAddress(addressData, token);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to submit address');
    }
  },
};