import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../api/admin.api';
import { Check, X, Eye, MapPin, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const PendingPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchPendingPhotos();
  }, [page]);

  const fetchPendingPhotos = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getPendingPhotos({ page, limit: 20 });

      if (page === 1) {
        setPhotos(response.data);
      } else {
        setPhotos(prev => [...prev, ...response.data]);
      }

      setHasMore(response.pagination.currentPage < response.pagination.totalPages);
    } catch (error) {
      toast.error('Failed to load pending photos');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (photoId) => {
    try {
      await adminAPI.approvePhoto(photoId);
      toast.success(`Photo approved! `);
      
      // Remove from list
      setPhotos(prev => prev.filter(p => p._id !== photoId));
    } catch (error) {
      toast.error('Failed to approve photo');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      await adminAPI.rejectPhoto(selectedPhoto._id, rejectionReason);
      toast.success('Photo rejected');
      
      // Remove from list
      setPhotos(prev => prev.filter(p => p._id !== selectedPhoto._id));
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedPhoto(null);
    } catch (error) {
      toast.error('Failed to reject photo');
    }
  };

  const openRejectModal = (photo) => {
    setSelectedPhoto(photo);
    setShowRejectModal(true);
  };

  if (loading && page === 1) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <p className="text-xl text-gray-600">All caught up!</p>
        <p className="text-sm text-gray-500 mt-2">No pending photos to review</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Pending Photos ({photos.length})</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div key={photo._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Image */}
            <div className="relative h-64 bg-gray-200">
              <img
                src={photo.originalUrl}
                alt="Pending photo"
                className="w-full h-full object-cover"
              />
              <button
                className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
                onClick={() => window.open(photo.originalUrl, '_blank')}
              >
                <Eye className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Info */}
            <div className="p-4">
              {/* User */}
              <div className="flex items-center mb-3">
                <User className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-700">
                  {photo.userId?.name || 'Unknown User'}
                </span>
              </div>

              {/* Location */}
              {photo.placeName && (
                <div className="flex items-center mb-3">
                  <MapPin className="w-4 h-4 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-700 truncate">
                    {photo.placeName}
                    {photo.city && `, ${photo.city}`}
                  </span>
                </div>
              )}

              {/* Date */}
              <div className="flex items-center mb-4">
                <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-xs text-gray-500">
                  {format(new Date(photo.createdAt), 'PPp')}
                </span>
              </div>

              {/* Photo Details */}
              <div className="text-xs text-gray-500 mb-4 space-y-1">
                {photo.dimensions && (
                  <div>
                    Size: {photo.dimensions.width} × {photo.dimensions.height}
                  </div>
                )}
                <div>
                  File: {(photo.fileSize / (1024 * 1024)).toFixed(2)} MB
                </div>
                {photo.source && (
                  <div className="capitalize">
                    Source: {photo.source.replace('_', ' ')}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApprove(photo._id)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => openRejectModal(photo)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={() => setPage(prev => prev + 1)}
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-semibold mb-4">Reject Photo</h3>
            
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 mb-4"
            />

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedPhoto(null);
                }}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingPhotos;