import axios from "axios";

const API_BASE_URL = "https://nityambackend.onrender.com/api/v1";

export const verificationApi = {
  submitVerification: async (verificationData, token) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Append all fields (convert boolean to string if needed)
      formData.append("verificationByPostalCard", 
        verificationData.verificationByPostalCard === 'yes' ? 'true' : 'false');
      formData.append("address", verificationData.address);

      // Append file (if exists) - Correct format for React Native
      if (verificationData.document) {
        // Create a file object with the correct structure
        const file = {
          uri: verificationData.document.uri,
          type: verificationData.document.type || "image/jpeg",
          name: verificationData.document.name || "document.jpg",
        };
        formData.append("document", file);
      }

      // Send request via axios
      const response = await axios.put(
        `${API_BASE_URL}/auth/verification`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      // Handle axios error structure
      if (error.response) {
        console.log('Error response:', error.response.data);
        console.log('Error status:', error.response.status);
        throw new Error(error.response.data?.message || "Failed to submit verification");
      } else if (error.request) {
        console.log('Error request:', error.request);
        throw new Error("No response from server. Please try again.");
      } else {
        console.log('Error message:', error.message);
        throw new Error(error.message || "Unexpected error occurred");
      }
    }
  },
};