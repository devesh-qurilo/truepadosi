import { professionApi } from '../api/professionApi';
import { storage } from '../utils/storage';

export const professionService = {
  submitProfession: async (professionData) => {
    try {
      const token = await storage.getItem('authToken');
      const response = await professionApi.submitProfession(professionData, token);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to submit profession');
    }
  },
};