import axiosInstance from './axios';

// Add medicine to cabinet
export const addToCabinet = async (medicineData) => {
  try {
    const response = await axiosInstance.post('/api/medicine/add', medicineData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user's cabinet medicines
export const getCabinet = async () => {
  try {
    const response = await axiosInstance.get('/api/medicine/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};