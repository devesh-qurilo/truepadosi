const API_BASE_URL = 'https://nityambackend.onrender.com/api/v1';

export const professionApi = {
  submitProfession: async (professionData, token) => {
    const response = await fetch(`${API_BASE_URL}/auth/profession`, {
      method: 'PUT', // Using PUT method as specified
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(professionData),
    });

    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit profession');
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
  },
};