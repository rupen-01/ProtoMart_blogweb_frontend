import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { photosAPI } from '../../api/photos.api';
import toast from 'react-hot-toast';

const UploadModal = ({ coordinates, onClose }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [portalContainer, setPortalContainer] = useState(null);

  useEffect(() => {
    // Check if we're in fullscreen mode
    const fullscreenElement = document.fullscreenElement || 
                             document.webkitFullscreenElement || 
                             document.mozFullScreenElement || 
                             document.msFullscreenElement;
    
    // Use fullscreen container if available, otherwise use body
    setPortalContainer(fullscreenElement || document.body);
  }, []);

  // Add safety check
  if (!coordinates || !portalContainer) {
    return null;
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles(files);
      setPreviews(files.map(file => URL.createObjectURL(file)));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one photo');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('photo', file);
      });
      formData.append('latitude', coordinates.latitude);
      formData.append('longitude', coordinates.longitude);

      await photosAPI.uploadPhoto(formData);
      toast.success(`${selectedFiles.length} photo(s) uploaded successfully!`);
      onClose();
    } catch (error) {
      toast.error('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Upload Photo</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Location:</p>
          <p className="font-mono text-sm bg-gray-50 p-2 rounded">
            Lat: {coordinates.latitude.toFixed(6)}<br/>
            Lng: {coordinates.longitude.toFixed(6)}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Photo</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="w-full border rounded p-2"
          />
        </div>

        {previews.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">{selectedFiles.length} photo(s) selected</p>
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {previews.map((preview, index) => (
                <img 
                  key={index} 
                  src={preview} 
                  alt={`Preview ${index + 1}`} 
                  className="w-full h-24 object-cover rounded" 
                />
              ))}
            </div>
          </div>
        )}
        
        <div className="flex space-x-3">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, portalContainer);
};

export default UploadModal;