const Toast = require('react-native-toast-message');

const handleAPIError = (error) => {
  let errorMessage = 'An unexpected error occurred';

  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 401:
        errorMessage = data.message || 'Unauthorized access';
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
    errorMessage = 'Network error: Please check your connection';
  } else {
    errorMessage = error.message || 'Request configuration error';
  }

  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: errorMessage,
  });

  return errorMessage;
};

const withErrorHandling = (fn) => async (...args) => {
  try {
    return await fn(...args);
  } catch (error) {
    handleAPIError(error);
    throw error;
  }
};

module.exports = {
  handleAPIError,
  withErrorHandling,
};