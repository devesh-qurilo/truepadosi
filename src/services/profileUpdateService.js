import { profileUpdateApi } from '../api/profileUpdateApi';
import { storage } from '../utils/storage';

export const profileUpdateService = {
  updateProfile: async (profileData) => {
    try {
      const token = await storage.getItem('authToken');
      const response = await profileUpdateApi.updateProfile(profileData, token);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update profile');
    }
  },
};