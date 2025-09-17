// import { authApi } from '../api/authApi';
// import { storage } from '../utils/storage';

// export const authService = {
//   login: async (email, password) => {
//     try {
//       const response = await authApi.login({ email, password });
      
//       if (response.success) {
//         // Store token securely and user data
//         await storage.setItem('authToken', response.token);
//         await storage.setObject('userData', response.user);
//       }
      
//       return response;
//     } catch (error) {
//       throw new Error(error.message || 'Login failed');
//     }
//   },

//   register: async (userData) => {
//     try {
//       const response = await authApi.register(userData);
//       return response;
//     } catch (error) {
//       throw new Error(error.message || 'Registration failed');
//     }
//   },

//   logout: async () => {
//     try {
//       // Clear stored data
//       await storage.removeItem('authToken');
//       await storage.removeItem('userData');
//       return { success: true };
//     } catch (error) {
//       throw new Error('Logout failed');
//     }
//   },

//   getStoredAuth: async () => {
//     try {
//       const token = await storage.getItem('authToken');
//       const userData = await storage.getObject('userData');
      
//       if (token && userData) {
//         return {
//           token,
//           user: userData,
//         };
//       }
//       return null;
//     } catch (error) {
//       console.error('getStoredAuth error:', error);
//       return null;
//     }
//   },

//   // Additional auth utility methods
//   getToken: async () => {
//     return await storage.getItem('authToken');
//   },

//   getUser: async () => {
//     return await storage.getObject('userData');
//   },

//   isAuthenticated: async () => {
//     const token = await storage.getItem('authToken');
//     return !!token;
//   },
// };



import { authApi } from '../api/authApi';
import { storage } from '../utils/storage';

export const authService = {
  // Send OTP
  sendOtp: async (phoneNumber, email) => {
    try {
      console.log('Sending OTP to:', { phoneNumber, email });
      const response = await authApi.sendOtp(phoneNumber, email);
      console.log('OTP response:', response);
      return response;
    } catch (error) {
      console.error('OTP error:', error.message);
      throw new Error(error.message || 'Failed to send OTP');
    }
  },

  // Register with OTP
  register: async (userData) => {
    try {
      const response = await authApi.register(userData);
      
      if (response.success) {
        // Store token and user data upon successful registration
        await storage.setItem('authToken', response.token);
        await storage.setObject('userData', response.user);
      }
      
      return response;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  },

  // Login
  login: async (email, password) => {
    try {
      const response = await authApi.login({ email, password });
      console.log("Login response:", response);
      
      if (response.success) {
        await storage.setItem('authToken', response.token);
        await storage.setObject('userData', response.user);
      }
      
      return response;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  },

  logout: async () => {
    try {
      await storage.removeItem('authToken');
      await storage.removeItem('userData');
      return { success: true };
    } catch (error) {
      throw new Error('Logout failed');
    }
  },

  getStoredAuth: async () => {
    try {
      const token = await storage.getItem('authToken');
      const userData = await storage.getObject('userData');
      
      if (token && userData) {
        return {
          token,
          user: userData,
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  },
};