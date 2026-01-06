export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin'
};

export const PHOTO_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const PHOTO_SOURCES = {
  DIRECT_UPLOAD: 'direct_upload',
  GOOGLE_PHOTOS: 'google_photos'
};

export const BLOG_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published'
};

export const TRANSACTION_TYPES = {
  REWARD: 'reward',
  REDEMPTION: 'redemption',
  REFUND: 'refund'
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic'];

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};

export const PHOTO_APPROVAL_REWARD = 1; // Rs per approved photo
export const MINIMUM_REDEMPTION_AMOUNT = 10; // Rs