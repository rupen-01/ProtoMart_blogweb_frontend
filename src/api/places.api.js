import axiosInstance from './axios';

export const placesAPI = {
  // Get all places
  getPlacesHierarchy: async () => {
    return axiosInstance.get('/places/hierarchy');
  },
  
  // Get places by country
  getPlacesByCountry: async (country) => {
    return axiosInstance.get('/places', { params: { country } });
  },
  
  getAllPlaces: async (params) => {
    return axiosInstance.get('/places', { params });
  },

  // Get places for map
  getPlacesForMap: async (bounds) => {
    return axiosInstance.get('/places/map', { params: bounds });
  },

  // Get place by ID
  getPlaceById: async (id) => {
    return axiosInstance.get(`/places/${id}`);
  },

  // Get place photos
  getPlacePhotos: async (id, params) => {
    return axiosInstance.get(`/places/${id}/photos`, { params });
  }
};