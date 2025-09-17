const API_BASE_URL = 'https://nityambackend.onrender.com/api/v1';



export const authApi = {


  // Login
  login: async (credentials) => {
    const shiva = JSON.stringify(credentials)
    console.log("shivaaaaaaaaaaa", shiva);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

 sendOtp: async (phoneNumber, email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/sendotp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          email: email
        }),
      });

      const contentType = response.headers.get('content-type');
      
      if (!response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to send OTP');
        } else {
          const errorText = await response.text();
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }

      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        throw new Error('Server returned non-JSON response');
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to send OTP');
    }
  },
  // Register with OTP
  register: async (userData) => {
    console.log("userData in api", userData);
    const rahul = JSON.stringify(userData)
    console.log("rahulllllllllll", rahul);
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  
};