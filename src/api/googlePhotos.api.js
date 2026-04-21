import axiosInstance from './axios';

export const googlePhotosAPI = {
  validateLink: async (shareLink) => {
    return axiosInstance.post("/google-photos/validate-link", { shareLink });
  },

  syncPhotos: async (data) => {
    return axiosInstance.post("/google-photos/sync", data);
  },

  getSyncProgress: async (jobId) => {
    return axiosInstance.get(`/google-photos/progress/${jobId}`);
  },

  getSyncStatus: async () => {
    return axiosInstance.get("/google-photos/sync-status");
  },
};
