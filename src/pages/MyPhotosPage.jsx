import React, { useState } from 'react';
import { usePhotos } from '../hooks/usePhotos';
import PhotoGrid from '../components/photos/PhotoGrid';
import { Upload, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyPhotosPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const { myPhotos, isLoadingMyPhotos } = usePhotos();


  console.log('My Photos:', myPhotos);

  const filterOptions = [
    { value: 'all', label: 'All Photos', count: myPhotos.length },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'approved', label: 'Approved', color: 'green' },
    { value: 'rejected', label: 'Rejected', color: 'red' }
  ];


  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Photos</h1>
            <p className="text-gray-600">Manage your uploaded travel photos</p>
          </div>
          <button
            onClick={() => navigate('/upload')}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            <Upload className="w-5 h-5" />
            <span>Upload New Photo</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Filter:</span>
            </div>
            <div className="flex space-x-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Photos Grid */}
        <PhotoGrid photos={myPhotos} loading={isLoadingMyPhotos} />

        {/* Empty State */}
        {!isLoadingMyPhotos && myPhotos.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No photos yet</h3>
            <p className="text-gray-600 mb-6">
              Start uploading your travel photos to earn rewards!
            </p>
            <button
              onClick={() => navigate('/upload')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Upload Your First Photo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPhotosPage;