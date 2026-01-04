// import axiosInstance from './axios';

// export const adminAPI = {
//   // Get pending photos
//   getPendingPhotos: async (params) => {
//     return axiosInstance.get('/admin/photos/pending', { params });
//   },

//   // Approve photo
//   approvePhoto: async (id) => {
//     return axiosInstance.post(`/admin/photos/${id}/approve`);
//   },

//   // Reject photo
//   rejectPhoto: async (id, reason) => {
//     return axiosInstance.post(`/admin/photos/${id}/reject`, { reason });
//   },

//   // Get watermark settings
//   getWatermarkSettings: async () => {
//     return axiosInstance.get('/admin/watermark');
//   },

//   // Update watermark settings
//   updateWatermarkSettings: async (data) => {
//     return axiosInstance.put('/admin/watermark', data);
//   },

//   // Get stats
//   getStats: async () => {
//     return axiosInstance.get('/admin/stats');
//   }
// };


import axiosInstance from './axios';

export const adminAPI = {
  // Get pending photos
  getPendingPhotos: async (params) => {
    return axiosInstance.get('/admin/photos/pending', { params });
  },

  // Approve photo
  approvePhoto: async (id) => {
    return axiosInstance.post(`/admin/photos/${id}/approve`);
  },

  // Reject photo
  rejectPhoto: async (id, reason) => {
    return axiosInstance.post(`/admin/photos/${id}/reject`, { reason });
  },

  // Get watermark settings
  getWatermarkSettings: async () => {
    return axiosInstance.get('/admin/watermark');
  },

  // Update watermark settings
  // ✅ FIXED: Added proper headers for FormData
  updateWatermarkSettings: async (formData) => {
    return axiosInstance.put('/admin/watermark', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Get stats
  getStats: async () => {
    return axiosInstance.get('/admin/stats');
  }
};