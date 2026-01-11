import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Upload, Wallet, Globe, TrendingUp, Users } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import useAuthStore from '../store/authStore';
import { placesAPI } from '../api/places.api';
import { photosAPI } from '../api/photos.api';
import toast from 'react-hot-toast';
import UploadModal from '../components/photos/UploadModal';

// Custom marker icon for approved photos
const createPhotoMarker = (count) => {
  const size = Math.min(30 + count * 2, 50);
  return L.divIcon({
    html: `
      <div style="
        background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${Math.min(12 + count, 16)}px;
        border: 3px solid white;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        cursor: pointer;
      ">
        ${count}
      </div>
    `,
    className: 'custom-photo-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};
const LocationButton = () => {
  const map = useMap();
  
  const goToMyLocation = (e) => {
    e.stopPropagation(); // Add this to prevent map click event
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 13);
          toast.success('Moved to your location!');
        },
        (error) => {
          toast.error('Unable to get your location');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      toast.error('Geolocation not supported by your browser');
    }
  };

  return (
    <button
      onClick={goToMyLocation}
      className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000] hover:bg-gray-50 transition"
      title="Go to my location"
    >
      <MapPin className="w-5 h-5 text-blue-600" />
    </button>
  );
};

const PhotoMap = ({ onLocationSelect, refreshKey }) => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
const [userLocation, setUserLocation] = useState(null);
  useEffect(() => {
      if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Could not get location:', error);
      }
    );
  }
    fetchApprovedPhotos();
  }, []); // Refetch when refreshKey changes

const fetchApprovedPhotos = async () => {
  try {
    setLoading(true);
    // Fetch places with grouped photos
    const response = await photosAPI.getPlacesWithPhotos({ 
      status: 'approved',
      limit: 1000
    });

    console.log('Fetched places with photos:', response);
    
    setPhotos(response.data || []);
  } catch (error) {
    console.error('Failed to load photos:', error);
    toast.error('Failed to load map data');
  } finally {
    setLoading(false);
  }
};

  const MapClickHandler = ({ onMapClick }) => {
  const map = useMap();
  
  useEffect(() => {
    const handleClick = (e) => {
      // Check if click is on a marker or control element
      const clickedElement = e.originalEvent?.target;
      
      // Don't trigger upload modal if clicking on markers, popups, or controls
      if (
        clickedElement?.closest('.leaflet-marker-icon') ||
        clickedElement?.closest('.leaflet-popup') ||
        clickedElement?.closest('.leaflet-control') ||
        clickedElement?.closest('button') ||
        clickedElement?.closest('.custom-photo-marker') ||
        clickedElement?.closest('.user-location-marker')
      ) {
        return;
      }
      
      onMapClick(e.latlng);
    };
    
    map.on('click', handleClick);
    
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onMapClick]);
  
  return null;
};

  const createUserLocationMarker = () => {
  return L.divIcon({
    html: `
      <div style="
        background: #3b82f6;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 0 0 2px #3b82f6, 0 2px 6px rgba(0,0,0,0.4);
      "></div>
    `,
    className: 'user-location-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};
  

  // Create custom icon for individual photos
  const createSinglePhotoMarker = () => {
    return L.divIcon({
      html: `
        <div style="
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 16px;
          border: 3px solid white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          cursor: pointer;
        ">
          📷
        </div>
      `,
      className: 'custom-single-photo-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      className="w-full h-full"
      style={{ minHeight: '600px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler onMapClick={onLocationSelect} />
      <LocationButton />
 <FullscreenButton /> 
      {/* Show loading indicator */}
      {loading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg z-[1000]">
          Loading photos...
        </div>
      )}

      {/* Markers for each place with multiple photos */}
{photos.map((place) => {
  if (!place.location || !place.location.coordinates) return null;
  
  const [lng, lat] = place.location.coordinates;
  const photoCount = place.photoCount || 0;
  
  return (
    <Marker
      key={place.placeId}
      position={[lat, lng]}
      icon={createPhotoMarker(photoCount)}
    >
      <Popup>
        <div className="text-center p-2" style={{ minWidth: '250px' }}>
          <h3 className="font-semibold text-sm mb-2">
            {place.placeName || 'Unknown Location'}
          </h3>
          
          <p className="text-xs text-gray-600 mb-3">
            {place.city && `${place.city}, `}
            {place.state && `${place.state}, `}
            {place.country}
          </p>

          <p className="text-xs text-blue-600 font-semibold mb-3">
            📸 {photoCount} photo{photoCount !== 1 ? 's' : ''}
          </p>

          {/* Show thumbnail grid of first few photos */}
          {place.photos && place.photos.length > 0 && (
            <div className="grid grid-cols-3 gap-1 mb-3">
              {place.photos.slice(0, 3).map((photo, idx) => (
                <img
                  key={idx}
                  src={photo.originalUrl}
                  alt={`Photo ${idx + 1}`}
                  className="w-full h-16 object-cover rounded"
                />
              ))}
            </div>
          )}
          
          <button
            onClick={() => navigate(`/places/${place.placeId}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded text-xs hover:bg-blue-700 transition w-full"
          >
            View All Photos
          </button>
        </div>
      </Popup>
    </Marker>
  );
})}
      {userLocation && (
  <Marker
    position={[userLocation.lat, userLocation.lng]}
    icon={createUserLocationMarker()}
  >
    <Popup>
      <div className="text-center">
        <p className="font-semibold">You are here</p>
      </div>
    </Popup>
  </Marker>
)}
    </MapContainer>
  );
};
const HomePage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [stats, setStats] = useState({
    totalPhotos: 0,
    totalPlaces: 0,
    totalUsers: 0
  });


    const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
useEffect(() => {
    fetchStats();
  }, []);

  const handleLocationSelect = (latlng) => {
  setSelectedLocation({
    latitude: latlng.lat,
    longitude: latlng.lng
  });
  setShowUploadModal(true);
};

  
  const fetchStats = async () => {
    try {
      // Fetch basic stats for homepage
      const placesResponse = await placesAPI.getAllPlaces({ limit: 1 });
      setStats({
        totalPhotos: placesResponse.pagination?.totalPhotos || 0,
        totalPlaces: placesResponse.pagination?.totalPlaces || 0,
        totalUsers: 1000 // This should come from backend
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  console.log('Homepage stats:', stats);

  const features = [
    {
      icon: Upload,
      title: 'Upload Photos',
      description: 'Share your travel memories with the world'
    },
    {
      icon: Wallet,
      title: 'Earn Rewards',
      description: 'Earn money for every approved photo'
    },
    {
      icon: MapPin,
      title: 'Explore Places',
      description: 'Discover amazing destinations worldwide'
    },
    {
      icon: Globe,
      title: 'Interactive Map',
      description: 'View photos on an interactive map'
    }
  ];

  return (
    <div className="bg-white">

    {showUploadModal && selectedLocation && (
  <UploadModal 
    coordinates={selectedLocation}
    onClose={() => {
      setShowUploadModal(false);
      // setRefreshKey(prev => prev + 1);
    }}
  />
)}
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-1 bg-black opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Share Your Travel Stories
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Upload photos, earn rewards, and inspire travelers worldwide
            </p>
            
            {/* Stats */}
            <div className="flex justify-center space-x-8 mb-8">
              {/* <div className="text-center">
                <div className="text-3xl font-bold">{stats.totalPhotos.toLocaleString()}</div>
                <div className="text-sm text-blue-200">Photos</div>
              </div> */}
              <div className="text-center">
                <div className="text-3xl font-bold">{stats.totalPlaces.toLocaleString()}</div>
                <div className="text-sm text-blue-200">Places</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}+</div>
                <div className="text-sm text-blue-200">Users</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate('/upload')}
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg"
                  >
                    Upload Photo
                  </button>
                  <button
                    onClick={() => navigate('/file-explorer')}
                    className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
                  >
                    Explore Photos
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/register')}
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg"
                  >
                    Get Started Free
                  </button>
                  <button
                    onClick={() => navigate('/explore')}
                    className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
                  >
                    Explore
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Wave Shape */}
        <div className="absolute bottom-0 w-full">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="#ffffff"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            />
          </svg>
        </div>
      </div>

      {/* Interactive Map Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Explore Photos Around the World</h2>
          <p className="text-xl text-gray-600">
            Click on any location to view photos from that place
          </p>
        </div>

        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mr-2"></div>
              <span className="text-gray-700">Click pins to view photos</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-gray-700">Zoom in for more details</span>
            </div>
          </div>
        </div>

<div className="relative w-full h-[600px] overflow-hidden rounded-xl">
  <PhotoMap 
    key={refreshKey} 
    refreshKey={refreshKey} 
    onLocationSelect={handleLocationSelect} 
  />
</div>     </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
                  <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Why Upload Your Photos Here?</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <TrendingUp className="w-6 h-6 text-green-500 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Earn Real Money</h3>
                  <p className="text-gray-600">
                    Get many for every photo approved. Redeem anytime to ProtoMart.global
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Globe className="w-6 h-6 text-blue-500 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Global Exposure</h3>
                  <p className="text-gray-600">
                    Your photos will be seen by travelers from around the world
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="w-6 h-6 text-purple-500 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Join Community</h3>
                  <p className="text-gray-600">
                    Connect with fellow travelers and share experiences
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-2xl text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Earning?</h3>
            <p className="mb-6">
              Upload your first photo and start earning rewards today!
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  ✓
                </div>
                <span>Free to join</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  ✓
                </div>
                <span>Instant photo approval</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  ✓
                </div>
                <span>Easy redemption</span>
              </div>
            </div>
            {!isAuthenticated && (
              <button
                onClick={() => navigate('/register')}
                className="mt-6 w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Sign Up Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Start Your Journey Today</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of travelers sharing their experiences
          </p>
          {!isAuthenticated && (
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-600 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition shadow-xl"
            >
              Create Free Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const FullscreenButton = () => {
  const map = useMap();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    
    const mapContainer = map.getContainer().parentElement;
    
    if (!isFullscreen) {
      if (mapContainer.requestFullscreen) {
        mapContainer.requestFullscreen();
      } else if (mapContainer.webkitRequestFullscreen) {
        mapContainer.webkitRequestFullscreen();
      } else if (mapContainer.mozRequestFullScreen) {
        mapContainer.mozRequestFullScreen();
      } else if (mapContainer.msRequestFullscreen) {
        mapContainer.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  return (
    <button
      onClick={toggleFullscreen}
      className="absolute top-16 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000] hover:bg-gray-50 transition"
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      )}
    </button>
  );
};

export default HomePage;