import axiosInstance from './axios';

export const googlePhotosAPI = {
  // Validate album link
  validateLink: async (shareLink) => {
    return axiosInstance.post('/google-photos/validate-link', { shareLink });
  },

  // Sync photos from album
 syncPhotos: async (data) => {
  return axiosInstance.post('/google-photos/sync', data);
},

  // Get sync status
  getSyncStatus: async () => {
    return axiosInstance.get('/google-photos/sync-status');
  }
};