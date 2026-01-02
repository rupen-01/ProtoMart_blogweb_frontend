import React, { useState } from 'react';
import { X } from 'lucide-react';
import { photosAPI } from '../../api/photos.api';
import toast from 'react-hot-toast';

const UploadModal = ({ coordinates, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
 // Add safety check
  if (!coordinates) {
    return null;
  }
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a photo');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('photo', selectedFile);
      formData.append('latitude', coordinates.latitude);
      formData.append('longitude', coordinates.longitude);

      await photosAPI.uploadPhoto(formData);
      toast.success('Photo uploaded successfully!');
      onClose();
    } catch (error) {
      toast.error('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center  z-[9999]">
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
            onChange={handleFileSelect}
            className="w-full border rounded p-2"
          />
        </div>

        {preview && (
          <div className="mb-4">
            <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded" />
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
};

export default UploadModal;