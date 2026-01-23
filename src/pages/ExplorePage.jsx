import React, { useState, useEffect } from "react";
import { placesAPI } from "../api/places.api";
import { photosAPI } from "../api/photos.api";
import {
  FolderIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ImageIcon,
  MapPinIcon,
  CalendarIcon,
  EyeIcon,
  HeartIcon,
  ExternalLinkIcon,
  LoaderIcon,
} from "lucide-react";

const ExplorePage = () => {
  const [hierarchy, setHierarchy] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedPlaceName, setSelectedPlaceName] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [allPhotos, setAllPhotos] = useState([]);

  useEffect(() => {
    loadHierarchy();
    loadAllPhotos();
  }, []);

  const loadHierarchy = async () => {
    try {
      setLoading(true);
      const res = await placesAPI.getPlacesHierarchy();
      setHierarchy(res.data.data || res.data);
    } catch (error) {
      console.error("Failed to load hierarchy:", error);
    } finally {
      setLoading(false);
    }
  };
  const loadAllPhotos = async () => {
    try {
      setPhotosLoading(true);
      const res = await photosAPI.getPlacesWithPhotos({
        status: "approved",
        limit: 1000,
      });

      // Flatten all photos from all places
      const allPhotosFlattened = (res.data || []).flatMap((place) =>
        (place.photos || []).map((photo) => ({
          ...photo,
          placeName: place.placeName,
          city: place.city,
          state: place.state,
          country: place.country,
        }))
      );

      setPhotos(allPhotosFlattened); // Set initial photos to show all
      console.log("All Photos Loaded:", allPhotosFlattened);
      setAllPhotos(allPhotosFlattened);
    } catch (error) {
      console.error("Failed to load all photos:", error);
    } finally {
      setPhotosLoading(false);
    }
  };

  const loadPhotosByLocation = async (
    level,
    country,
    state = null,
    city = null
  ) => {
    try {
      setPhotosLoading(true);
      setSelectedPlace(null); // Clear place selection

      // Filter photos based on level
      let filteredPhotos = allPhotos;

      if (level === "country") {
        filteredPhotos = allPhotos.filter((photo) => photo.country === country);
        setSelectedPlaceName(country);
      } else if (level === "state") {
        filteredPhotos = allPhotos.filter(
          (photo) => photo.country === country && photo.state === state
        );
        setSelectedPlaceName(`${state}, ${country}`);
      } else if (level === "city") {
        filteredPhotos = allPhotos.filter(
          (photo) =>
            photo.country === country &&
            photo.state === state &&
            photo.city === city
        );
        setSelectedPlaceName(`${city}, ${state}, ${country}`);
      }

      setPhotos(filteredPhotos);
    } catch (error) {
      console.error("Failed to filter photos:", error);
    } finally {
      setPhotosLoading(false);
    }
  };

  const toggleExpand = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const loadPlacePhotos = async (placeId, placeName, city, state, country) => {
    try {
      setPhotosLoading(true);
      setSelectedPlace(placeId);
      setSelectedPlaceName(placeName);
      const res = await placesAPI.getPlacePhotos(placeId, { limit: 100 });

      // Add location metadata if not present
      const photosWithLocation = (res.data.data || res.data).map((photo) => ({
        ...photo,
        placeName: placeName,
        city: city,
        state: state,
        country: country,
      }));

      setPhotos(photosWithLocation);
    } catch (error) {
      console.error("Failed to load photos:", error);
      setPhotos([]);
    } finally {
      setPhotosLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query || query.trim() === "") {
      setSearchMode(false);
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      setSearchMode(true);
      const res = await photosAPI.searchPhotos(query);
      setSearchResults(res.data.data || res.data);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const debounceSearch = (func, delay = 500) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSearch = debounceSearch(handleSearch);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Header */}
      <div className="bg-white border-b shadow-sm px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FolderIcon className="text-blue-600" size={28} />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Photo Explorer
              </h1>
              <p className="text-sm text-gray-500">Browse photos by location</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  debouncedSearch(e.target.value);
                }}
                placeholder="Search by place, city, state, or country..."
                className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <ImageIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchMode(false);
                    setSearchResults([]);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Folder Tree */}
        <div className="w-80 bg-white border-r shadow-sm flex flex-col">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Locations
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <LoaderIcon className="animate-spin text-blue-600" size={32} />
              </div>
            ) : hierarchy.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <FolderIcon size={48} className="mx-auto mb-2 opacity-50" />
                <p>No locations found</p>
              </div>
            ) : (
              hierarchy.map((country) => (
                <CountryFolder
                  key={country._id}
                  country={country}
                  expanded={expanded}
                  toggleExpand={toggleExpand}
                  loadPlacePhotos={loadPlacePhotos}
                  loadPhotosByLocation={loadPhotosByLocation}
                  selectedPlace={selectedPlace}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Photo Grid */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          {/* Breadcrumb / Header */}
          {(selectedPlace || searchMode || photos.length > 0) && (
            <div className="bg-white border-b px-6 py-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {searchMode ? (
                  <>
                    <ImageIcon size={18} className="text-blue-600" />
                    <span className="font-semibold text-gray-800">
                      Search Results for "{searchQuery}"
                    </span>
                    <span className="text-gray-400">•</span>
                    <span>{searchResults.length} photos</span>
                  </>
                ) : selectedPlace ? (
                  <>
                    <MapPinIcon size={18} className="text-blue-600" />
                    <span className="font-semibold text-gray-800">
                      {selectedPlaceName}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span>{photos.length} photos</span>
                  </>
                ) : (
                  <>
                    <ImageIcon size={18} className="text-blue-600" />
                    <span className="font-semibold text-gray-800">
                      All Photos
                    </span>
                    <span className="text-gray-400">•</span>
                    <span>{photos.length} photos</span>
                  </>
                )}
              </div>
            </div>
          )}
          <div className="flex-1 overflow-y-auto">
            <PhotoGrid
              photos={searchMode ? searchResults : photos}
              loading={searchMode ? isSearching : photosLoading}
              selectedPlace={searchMode ? "search" : selectedPlace}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const CountryFolder = ({
  country,
  expanded,
  toggleExpand,
  loadPlacePhotos,
  loadPhotosByLocation,
  selectedPlace,
}) => {
  const countryKey = `country-${country._id}`;
  const isExpanded = expanded[countryKey];

  return (
    <div className="mb-1">
      <div
        onClick={(e) => {
          e.stopPropagation();
          toggleExpand(countryKey);
          loadPhotosByLocation("country", country._id);
        }}
        className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors group"
      >
        <div className="flex-shrink-0">
          {isExpanded ? (
            <ChevronDownIcon size={16} className="text-gray-600" />
          ) : (
            <ChevronRightIcon size={16} className="text-gray-600" />
          )}
        </div>
        <FolderIcon
          size={20}
          className={`flex-shrink-0 ${
            isExpanded ? "text-yellow-500" : "text-yellow-400"
          }`}
        />
        <span className="font-semibold text-gray-800 flex-1 truncate">
          {country._id}
        </span>
        {/* <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
          {country.countryTotalPhotos}
        </span> */}
      </div>

      {isExpanded && (
        <div className="ml-4 mt-1 border-l-2 border-gray-200 pl-2">
          {country.states && country.states.length > 0 ? (
            country.states.map((state, idx) => (
              <StateFolder
                key={idx}
                state={state}
                countryId={country._id}
                expanded={expanded}
                toggleExpand={toggleExpand}
                loadPlacePhotos={loadPlacePhotos}
                loadPhotosByLocation={loadPhotosByLocation}
                selectedPlace={selectedPlace}
              />
            ))
          ) : (
            <div className="px-3 py-2 text-xs text-gray-400">
              No states found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StateFolder = ({
  state,
  countryId,
  expanded,
  toggleExpand,
  loadPlacePhotos,
  loadPhotosByLocation,
  selectedPlace,
}) => {
  const stateKey = `state-${countryId}-${state.state}`;
  const isExpanded = expanded[stateKey];

  return (
    <div className="mb-1">
      <div
        onClick={(e) => {
          e.stopPropagation();
          toggleExpand(stateKey);
          loadPhotosByLocation("state", countryId, state.state);
        }}
        className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
      >
        <div className="flex-shrink-0">
          {isExpanded ? (
            <ChevronDownIcon size={14} className="text-gray-500" />
          ) : (
            <ChevronRightIcon size={14} className="text-gray-500" />
          )}
        </div>
        <FolderIcon size={18} className="text-yellow-400 flex-shrink-0" />
        <span className="text-gray-700 font-medium flex-1 truncate text-sm">
          {state.state}
        </span>
        {/* <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
          {state.totalPhotos}
        </span> */}
      </div>

      {isExpanded && (
        <div className="ml-4 mt-1 border-l-2 border-gray-200 pl-2">
          {state.cities && state.cities.length > 0 ? (
            state.cities.map((city, idx) => (
              <CityFolder
                key={idx}
                city={city}
                loadPhotosByLocation={loadPhotosByLocation}
                loadPlacePhotos={loadPlacePhotos}
                selectedPlace={selectedPlace}
                countryId={countryId}
                stateId={state.state}
              />
            ))
          ) : (
            <div className="px-3 py-2 text-xs text-gray-400">
              No cities found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CityFolder = ({
  city,
  loadPhotosByLocation,
  selectedPlace,
  countryId,
  stateId,
  loadPlacePhotos,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-1">
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
          loadPhotosByLocation("city", countryId, stateId, city.city);
        }}
        className="flex items-center gap-2 px-3 py-1.5 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
      >
        <div className="flex-shrink-0">
          {isExpanded ? (
            <ChevronDownIcon size={14} className="text-gray-400" />
          ) : (
            <ChevronRightIcon size={14} className="text-gray-400" />
          )}
        </div>
        <FolderIcon size={16} className="text-yellow-300 flex-shrink-0" />
        <span className="text-gray-600 text-sm flex-1 truncate">
          {city.city}
        </span>
        {/* <span className="text-xs text-gray-400">{city.totalPhotos}</span> */}
      </div>

      {isExpanded && (
        <div className="ml-6 mt-1 space-y-0.5">
          {city.places && city.places.length > 0 ? (
            city.places.map((place) => (
              <div
                key={place._id}
                onClick={() =>
                  loadPlacePhotos(
                    place._id,
                    place.name,
                    city.city,
                    stateId,
                    countryId
                  )
                }
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all text-sm ${
                  selectedPlace === place._id
                    ? "bg-blue-500 text-white shadow-md"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <MapPinIcon
                  size={14}
                  className={
                    selectedPlace === place._id ? "text-white" : "text-blue-500"
                  }
                />
                <span className="flex-1 truncate">{place.name}</span>
                {/* <span
                  className={`text-xs px-1.5 py-0.5 rounded ${
                    selectedPlace === place._id
                      ? "bg-blue-400 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {place.photoCount}
                </span> */}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-xs text-gray-400">
              No places found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PhotoGrid = ({ photos, loading, selectedPlace }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoaderIcon
            className="animate-spin text-blue-600 mx-auto mb-3"
            size={40}
          />
          <p className="text-gray-500">Loading photos...</p>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-400">
          <ImageIcon size={64} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No photos found</p>
          <p className="text-sm mt-1">
            This location doesn't have any photos yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {photos.map((photo) => (
          <PhotoCard key={photo._id} photo={photo} />
        ))}
      </div>
    </div>
  );
};

const PhotoCard = ({ photo }) => {
  const [showDetails, setShowDetails] = useState(false);

  const imageUrl =
    photo.originalUrl || photo.thumbnailUrl || photo.watermarkedUrl;
  const fullImageUrl = photo.originalUrl || photo.watermarkedUrl;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const openInNewTab = () => {
    window.open(fullImageUrl, "_blank");
  };

  return (
    <div
      className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      {/* Image */}
      <div className="aspect-video relative overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={photo.fileName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 shadow-md"
          loading="lazy"
        />

        {/* Overlay on Hover */}
        {showDetails && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-3 text-white">
            {/* Location Info */}
            {/* <div className="space-y-1.5 mb-2">
              {photo.placeName && (
                <div className="flex items-start gap-1.5">
                  <MapPinIcon size={14} className="mt-0.5 flex-shrink-0" />
                  <span className="text-xs font-medium line-clamp-2">
                    {photo.placeName}
                  </span>
                </div>
              )}

              {(photo.city || photo.state || photo.country) && (
                <div className="text-xs text-gray-300">
                  {[photo.city, photo.state, photo.country]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              )}

              {photo.createdAt && (
                <div className="flex items-center gap-1.5 text-xs text-gray-300">
                  <CalendarIcon size={12} />
                  <span>{formatDate(photo.createdAt)}</span>
                </div>
              )}
            </div> */}

            {/* Action Button */}
            <button
              onClick={openInNewTab}
              className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors"
            >
              <ExternalLinkIcon size={14} />
              Open Full Image
            </button>
          </div>
        )}
      </div>

      {/* Bottom Info Bar (Always Visible) */}

      <div className="p-3 ">
        {/* Location Name */}
        {photo.placeName && (
          <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
            {photo.placeName}
          </h3>
        )}

        {/* Location Details with Icon */}
        {(photo.city || photo.state || photo.country) && (
          <div className="flex items-start gap-1.5 mb-2">
            <MapPinIcon
              size={14}
              className="mt-0.5 text-gray-500 flex-shrink-0"
            />
            <span className="text-xs text-gray-600 line-clamp-1">
              {[photo.city, photo.state, photo.country]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>
        )}

        {/* Stats and User */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          {/* <div className="flex items-center gap-3">
            {photo.views > 0 && (
              <div className="flex items-center gap-1">
                <EyeIcon size={12} />
                <span>{photo.views}</span>
              </div>
            )}
            {photo.likes > 0 && (
              <div className="flex items-center gap-1">
                <HeartIcon size={12} className="text-red-500" />
                <span>{photo.likes}</span>
              </div>
            )}
          </div> */}
          {/* {photo.userId?.name && (
            <span className="text-xs text-gray-400 truncate max-w-[100px]">
              {photo.userId.name}
            </span>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
