// Services/errorHandler.js
import Toast from 'react-native-toast-message';

export const handleAPIError = (error) => {
  let errorMessage = 'An unexpected error occurred';
  
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        errorMessage = data.message || 'Unauthorized access';
        // Add token refresh logic here
        break;
      case 403:
        errorMessage = data.message || 'Forbidden resource';
        break;
      case 404:
        errorMessage = data.message || 'Resource not found';
        break;
      case 500:
        errorMessage = data.message || 'Internal server error';
        break;
      default:
        errorMessage = data.message || `Request failed with status ${status}`;
    }
  } else if (error.request) {
    // Request made but no response
    errorMessage = 'Network error: Please check your connection';
  } else {
    // Setup error
    errorMessage = error.message || 'Request configuration error';
  }

  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: errorMessage,
  });

  return errorMessage;
};

export const withErrorHandling = (fn) => async (...args) => {
  try {
    return await fn(...args);
  } catch (error) {
    handleAPIError(error);
    throw error; // Re-throw for local handling
  }
};