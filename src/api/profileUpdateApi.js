// const API_BASE_URL = 'https://nityambackend.onrender.com/api/v1';

// export const profileUpdateApi = {
//   updateProfile: async (profileData, token) => {
//     console.log("Profile Data in API:", token);
//     const response = await fetch(`${API_BASE_URL}/auth/profiledetails`, {
//       method: 'PUT', // Assuming POST method for profile update
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//       body: JSON.stringify(profileData),
//     });

//     const contentType = response.headers.get('content-type');
    
//     if (!response.ok) {
//       if (contentType && contentType.includes('application/json')) {
//         const error = await response.json();
//         throw new Error(error.message || 'Failed to update profile');
//       } else {
//         const errorText = await response.text();
//         throw new Error(`Server error: ${response.status} ${response.statusText}`);
//       }
//     }

//     if (contentType && contentType.includes('application/json')) {
//       return response.json();
//     } else {
//       throw new Error('Server returned non-JSON response');
//     }
//   },
// };



import axios from 'axios';

const API_BASE_URL = 'https://nityambackend.onrender.com/api/v1';

export const profileUpdateApi = {
  updateProfile: async (profileData, token) => {
    console.log('Profile Data in API:', token);

    try {
      const response = await axios.put(
        `${API_BASE_URL}/auth/profiledetails`,
        profileData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      return response.data; // Axios automatically parses JSON

    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Failed to update profile');
      } else {
        throw new Error(error.message || 'Network error');
      }
    }
  },
};
