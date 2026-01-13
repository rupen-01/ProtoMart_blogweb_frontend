import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { placesAPI } from "../api/places.api";
import { MapPin, Image as ImageIcon, ArrowLeft, Upload } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import PhotoGrid from "../components/photos/PhotoGrid";
import toast from "react-hot-toast";

const PlaceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [place, setPlace] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photosLoading, setPhotosLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  useEffect(() => {
    fetchPlace();
    fetchPlacePhotos();
    fetchPlaceBlogs();
  }, [id]);

  const fetchPlace = async () => {
    try {
      setLoading(true);
      const response = await placesAPI.getPlaceById(id);
      setPlace(response.data);
    } catch (error) {
      toast.error("Failed to load place");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };
  const handleBlogClick = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };

  const fetchPlacePhotos = async () => {
    try {
      setPhotosLoading(true);
      const response = await placesAPI.getPlacePhotos(id, {
        page: 1,
        limit: 20,
      });
      setPhotos(response.data);
    } catch (error) {
      toast.error("Failed to load photos");
    } finally {
      setPhotosLoading(false);
    }
  };
  const fetchPlaceBlogs = async () => {
    try {
      setBlogsLoading(true);
      const response = await placesAPI.getPlaceBlogs(id, {
        page: 1,
        limit: 10,
      });
      setBlogs(response.data);
    } catch (error) {
      toast.error("Failed to load blogs");
    } finally {
      setBlogsLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!place) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Map
          </button>
        </div>
      </div>

      {/* Place Header */}
      <div className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {place.name}
              </h1>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                <span>
                  {place.city && `${place.city}, `}
                  {place.state && `${place.state}, `}
                  {place.country}
                </span>
              </div>
            </div>

            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <div className="flex items-center">
                <ImageIcon className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-2xl font-bold text-blue-600">
                  {place.photoCount + 1}
                </span>
                <span className="text-gray-600 ml-2">Photos</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {place.description && (
            <p className="mt-4 text-gray-700">{place.description}</p>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-96">
            <MapContainer
              center={[
                place.location.coordinates[1],
                place.location.coordinates[0],
              ]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[
                  place.location.coordinates[1],
                  place.location.coordinates[0],
                ]}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-semibold">{place.name}</h3>
                    <p className="text-sm text-gray-600">{place.city}</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold mb-6">Photos from {place.name}</h2>
          <button
            onClick={() =>
              navigate("/upload", {
                state: {
                  place: {
                    _id: place._id,
                    name: place.name,
                    city: place.city,
                    state: place.state,
                    country: place.country,
                    coordinates: place.location.coordinates,
                  },
                },
              })
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-green-700 flex items-center"
          >
            <Upload className="w-5 h-5 mr-2" />
            <span>Upload Photo</span>
          </button>
        </div>
        <PhotoGrid photos={photos} loading={photosLoading} />
      </div>
      {/* Blogs Section */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between ">
          <h2 className="text-2xl font-bold mb-6">Blogs about {place.name}</h2>

          <button
            onClick={() =>
              navigate("/blogs/write", {
                state: {
                  place: {
                    _id: place._id,
                    name: place.name,
                    city: place.city,
                    state: place.state,
                    country: place.country,
                  },
                },
              })
            }
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <span>Write Blog</span>
          </button>
        </div>

        {blogsLoading ? (
          <div className="text-center py-8">Loading blogs...</div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleBlogClick(blog._id)}
              >
                {blog.coverImages?.[0] && (
                  <img
                    src={blog.coverImages[0].url}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{blog.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {blog.content}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <span>{blog.views} views</span>
                    <span>{blog.likes} likes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No blogs yet for this place
          </p>
        )}
      </div>
    </div>
  );
};

export default PlaceDetailPage;
