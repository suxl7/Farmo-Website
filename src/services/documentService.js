import axiosClient from '../utils/axiosClient';
import { API_ENDPOINTS } from '../config/api';

export const documentService = {
  async approveDocument(userId, documentId, userType) {
    return await axiosClient.post(API_ENDPOINTS.DOCUMENT_APPROVE, {
      user_id: userId,
      document_id: documentId,
      user_type: userType
    });
  },

  async rejectDocument(userId, documentId, comment) {
    return await axiosClient.post(API_ENDPOINTS.DOCUMENT_REJECT, {
      user_id: userId,
      document_id: documentId,
      rejection_comment: comment
    });
  },

  async getDocuments(userId) {
    return await axiosClient.post(API_ENDPOINTS.DOCUMENT_LIST, {
      user_id: userId
    });
  }
};
