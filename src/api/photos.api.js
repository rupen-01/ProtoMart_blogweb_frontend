import axiosInstance from './axios';

export const photosAPI = {
  // Upload photo
  uploadPhoto: async (formData) => {
    return axiosInstance.post('/photos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`
       }
    });
  },

  searchPhotos: async (query) => {
    return axiosInstance.get('/photos/search', {
      params: { q: query }
    });
  },

  // Get all photos (approved by default)
  getPhotos: async (params) => {
    return axiosInstance.get('/photos', { params });
  },
  getPlacesWithPhotos: async (params) => {
  return axiosInstance.get('/photos/places-with-photos', { params });
},
  getPhotosByCoordinates: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`/photos?${queryString}`);
    return response.data;
  },
  // ✅ Home page photos (approved + latest)
  getHomePhotos: async () => {
    return axiosInstance.get('/photos/home');
  },

  // Get photo by ID
  getPhotoById: async (id) => {
    return axiosInstance.get(`/photos/${id}`);
  },

  // ⚠️ Small fix (route naming)
  getMyPhotos: async (params) => {
    return axiosInstance.get('/photos/my-photos', { params });
  },

  // Delete photo
  deletePhoto: async (id) => {
    return axiosInstance.delete(`/photos/${id}`);
  },

  // Like photo
  likePhoto: async (id) => {
    return axiosInstance.post(`/photos/${id}/like`);
  },

  // Get nearby photos
  getNearbyPhotos: async (latitude, longitude, radius) => {
    return axiosInstance.get('/photos/nearby', {
      params: { latitude, longitude, radius }
    });
  }
};
