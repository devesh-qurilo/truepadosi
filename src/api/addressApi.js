


import axios from 'axios';

const API_BASE_URL = 'https://nityambackend.onrender.com/api/v1';

export const addressApi = {
  submitAddress: async (addressData, token) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/auth/communityaddress`,
        addressData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        'Response status:>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',
        response.status
      );

      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Failed to submit address');
      } else {
        throw new Error(error.message || 'Server error');
      }
    }
  },
};
