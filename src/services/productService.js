import axiosClient from '../utils/axiosClient';
import { API_ENDPOINTS } from '../config/api';

export const productService = {
  filterProducts: async (filters) => {
    return await axiosClient.post(API_ENDPOINTS.PRODUCT_FILTER, filters);
  },
  
  getProductStats: async () => {
    return await axiosClient.post('/api/admin/product/', {});
  }
};
