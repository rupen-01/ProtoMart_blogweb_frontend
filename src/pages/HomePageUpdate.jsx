import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Upload, Wallet, Globe, TrendingUp, Users, Camera, Award, Sparkles, Navigation, Maximize2, Minimize2, Compass } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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

const LocationButton = () => {
  const map = useMap();
  
  const goToMyLocation = (e) => {
    e.stopPropagation();
    
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
      className="group bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg hover:bg-white transition-all hover:scale-110 border border-gray-200"
      title="Go to my location"
    >
      <MapPin className="w-5 h-5 text-blue-600 group-hover:animate-pulse" />
    </button>
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
      className="group bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg hover:bg-white transition-all hover:scale-110 border border-gray-200"
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? (
        <Minimize2 className="w-5 h-5 text-blue-600" />
      ) : (
        <Maximize2 className="w-5 h-5 text-blue-600" />
      )}
    </button>
  );
};

const MapClickHandler = ({ onMapClick }) => {
  const map = useMap();
  
  useEffect(() => {
    const handleClick = (e) => {
      const clickedElement = e.originalEvent?.target;
      
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
  }, [refreshKey]);

  const fetchApprovedPhotos = async () => {
    try {
      setLoading(true);
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
      
      {/* Enhanced Map Controls */}
      <div className="absolute top-6 right-6 space-y-3 z-[1000]">
        <LocationButton />
        <FullscreenButton />
      </div>

      {loading && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-xl shadow-lg z-[1000] border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-gray-700">Loading photos...</span>
          </div>
        </div>
      )}

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  
  const [stats, setStats] = useState({
    totalPhotos: 0,
    totalPlaces: 0,
    totalUsers: 0
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleMouseMove = (e) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height
      });
    }
  };

  const handleLocationSelect = (latlng) => {
    setSelectedLocation({
      latitude: latlng.lat,
      longitude: latlng.lng
    });
    setShowUploadModal(true);
  };

  const fetchStats = async () => {
    try {
      const placesResponse = await placesAPI.getAllPlaces({ limit: 1 });
      setStats({
        totalPhotos: placesResponse.pagination?.totalPhotos || 0,
        totalPlaces: placesResponse.pagination?.totalPlaces || 0,
        totalUsers: 1000
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const features = [
    {
      icon: Camera,
      title: 'Upload & Share',
      description: 'Capture moments, share stories, inspire millions',
      color: 'from-blue-500 to-cyan-500',
      accent: '#06b6d4'
    },
    {
      icon: Award,
      title: 'Earn Rewards',
      description: 'Turn your passion into profit with every upload',
      color: 'from-purple-500 to-pink-500',
      accent: '#ec4899'
    },
    {
      icon: Globe,
      title: 'Explore World',
      description: 'Discover hidden gems across continents',
      color: 'from-green-500 to-emerald-500',
      accent: '#10b981'
    },
    {
      icon: Sparkles,
      title: 'AI Enhanced',
      description: 'Smart tagging and location detection',
      color: 'from-orange-500 to-red-500',
      accent: '#f59e0b'
    }
  ];

  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Upload Modal */}
      {showUploadModal && selectedLocation && (
        <UploadModal 
          coordinates={selectedLocation}
          onClose={() => {
            setShowUploadModal(false);
          }}
        />
      )}

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-10 animate-float"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: Math.random() * 10 + 10 + 's'
            }}
          ></div>
        ))}
      </div>

      {/* Hero Section */}
      <div 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-4 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-6 py-2 mb-8 backdrop-blur-sm animate-fade-in">
            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Join {stats.totalUsers.toLocaleString()}+ Travel Storytellers
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
              Share Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              World Vision
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transform your travel memories into rewards. Upload stunning photos, 
            <span className="text-blue-400 font-semibold"> earn real money</span>, and inspire explorers worldwide.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {[
              { value: stats.totalPhotos, label: 'Photos', icon: Camera, color: 'blue' },
              { value: stats.totalPlaces, label: 'Places', icon: MapPin, color: 'purple' },
              { value: stats.totalUsers, label: 'Creators', icon: Users, color: 'pink' }
            ].map((stat, i) => (
              <div 
                key={i} 
                className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-110"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <stat.icon className="min-w-32 max-w-32 min-h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold mb-1">{stat.value.toLocaleString()}</div>
                  {/* <div className="text-sm text-gray-400">{stat.label}</div> */}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/upload')}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold text-lg overflow-hidden hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Photo
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
                
                <button
                  onClick={() => navigate('/file-explorer')}
                  className="group px-8 py-4 bg-white/5 backdrop-blur-md border-2 border-white/20 rounded-full font-bold text-lg hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    <Compass className="w-5 h-5" />
                    Explore Photos
                  </span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/register')}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold text-lg overflow-hidden hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Get Started Free
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
                
                <button
                  onClick={() => navigate('/explore')}
                  className="group px-8 py-4 bg-white/5 backdrop-blur-md border-2 border-white/20 rounded-full font-bold text-lg hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    <Compass className="w-5 h-5" />
                    Explore
                  </span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="absolute bottom-2  left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Interactive Map Section */}
      <div className="relative pt-8 pb-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-6 py-2 mb-6">
              <Globe className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Interactive Experience</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Explore the Globe
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Navigate through thousands of stunning locations. Click anywhere on the map to discover or upload photos.
            </p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            
            <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <PhotoMap 
                key={refreshKey}
                refreshKey={refreshKey}
                onLocationSelect={handleLocationSelect}
              />
              
              <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 z-[999]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">Interactive Map</div>
                    <div className="text-xs text-gray-400">Click to explore or upload</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Carousel */}
      <div className="relative px-4 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Why Creators Love Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeFeature === index;
              
              return (
                <div
                  key={index}
                  className={`group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border transition-all duration-500 cursor-pointer ${
                    isActive ? 'border-white/30 scale-105 shadow-2xl' : 'border-white/10 hover:border-white/20'
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity`}></div>
                  
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 transform transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                    
                    <div className="mt-6 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${feature.color} transition-all duration-3000 ${
                          isActive ? 'w-full' : 'w-0'
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rewards Section */}
      <div className="relative py-20 px-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-full px-6 py-2 mb-6">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">Earning Potential</span>
              </div>
              
              <h2 className="text-5xl font-black mb-6 leading-tight">
                Turn Passion Into
                <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Profit
                </span>
              </h2>
              
              <p className="text-xl text-gray-400 mb-8">
                Every approved photo earns you real money. Cash out anytime to ProtoMart.global or keep earning.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Award, text: 'Instant approval system', color: 'blue' },
                  { icon: Wallet, text: 'Multiple payout options', color: 'purple' },
                  { icon: TrendingUp, text: 'Earn more with quality', color: 'green' }
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all group">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-${benefit.color}-500 to-${benefit.color}-600 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-lg font-semibold">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-10 border border-green-500/30 shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                
                <h3 className="text-3xl font-black mb-6">Start Earning Today</h3>
                
                <div className="space-y-4 mb-8">
                  {[
                    'Upload unlimited photos',
                    'Get instant feedback',
                    'Withdraw anytime',
                    'No hidden fees'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-sm">✓</span>
                      </div>
                      <span className="text-lg">{item}</span>
                    </div>
                  ))}
                </div>

                {!isAuthenticated && (
                  <button
                    onClick={() => navigate('/register')}
                    className="w-full bg-white text-green-600 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
                  >
                    Join Free Today
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-3xl opacity-30"></div>
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-16 border border-white/10">
              <h2 className="text-5xl font-black mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Ready to Share Your Story?
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-10">
                Join our global community of visual storytellers today.
              </p>
              {!isAuthenticated && (
                <button
                  onClick={() => navigate('/register')}
                  className="px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold text-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105"
                >
                  Get Started Free
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-float {
          animation: float ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HomePage;