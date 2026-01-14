import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { photosAPI } from "../api/photos.api";
import {
  MapPin,
  Calendar,
  Camera,
  Eye,
  Heart,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";

const PhotoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhoto();
  }, [id]);

  const fetchPhoto = async () => {
    try {
      setLoading(true);
      const response = await photosAPI.getPhotoById(id);
      console.log("Fetched photo:", response.data);
      setPhoto(response.data);
    } catch (error) {
      toast.error("Failed to load photo");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await photosAPI.likePhoto(id);
      setPhoto((prev) => ({
        ...prev,
        likes: (prev.likes || 0) + 1,
      }));
      toast.success("Photo liked!");
    } catch (error) {
      toast.error("Failed to like photo");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this photo?")) {
      return;
    }

    try {
      await photosAPI.deletePhoto(id);
      toast.success("Photo deleted successfully");
      navigate("/my-photos");
    } catch (error) {
      toast.error("Failed to delete photo");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Photo not found</p>
      </div>
    );
  }

  const isOwner = user && photo.userId._id === user._id;
  const imageUrl = photo.watermarkedUrl || photo.originalUrl || "/placeholder-image.png";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Photo */}
        <div className="lg:col-span-2">
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img
              src={imageUrl}
              alt={photo.placeName || "Travel photo"}
              className="w-full h-auto rounded-lg shadow-lg cursor-pointer hover:opacity-95 transition"
            />
          </a>

          {/* Actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-500"
              >
                <Heart className="w-6 h-6" />
                <span>{photo.likes || 0}</span>
              </button>
              <div className="flex items-center space-x-2 text-gray-600">
                <Eye className="w-6 h-6" />
                <span>{photo.views || 0}</span>
              </div>
            </div>

            {isOwner && (
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          {/* User Info */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Uploaded by</h3>
            <div className="flex items-center">
              <img
                src={photo.userId.profilePhoto || "/default-avatar.png"}
                alt={photo.userId.name}
                className="w-12 h-12 rounded-full mr-3"
              />
              <div>
                <p className="font-medium">{photo.userId.name}</p>
                <p className="text-sm text-gray-500">{photo.userId.email}</p>
              </div>
            </div>
          </div>

          {/* Location */}
          {photo.placeName && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Location</h3>
              <div className="space-y-2">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">{photo.placeName}</p>
                    {photo.city && (
                      <p className="text-sm text-gray-600">{photo.city}</p>
                    )}
                    {photo.state && (
                      <p className="text-sm text-gray-600">{photo.state}</p>
                    )}
                    {photo.country && (
                      <p className="text-sm text-gray-600">{photo.country}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Photo Info */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Photo Details</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2" />
                <span className="text-sm">
                  Uploaded {format(new Date(photo.createdAt), "PPP")}
                </span>
              </div>

              {photo.exifData?.camera && (
                <div className="flex items-center text-gray-600">
                  <Camera className="w-5 h-5 mr-2" />
                  <span className="text-sm">{photo.exifData.camera}</span>
                </div>
              )}

              {photo.dimensions && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Dimensions: </span>
                  {photo.dimensions.width} × {photo.dimensions.height}
                </div>
              )}

              <div className="text-sm text-gray-600">
                <span className="font-medium">Size: </span>
                {(photo.fileSize / (1024 * 1024)).toFixed(2)} MB
              </div>

              <div className="text-sm">
                <span className="font-medium">Status: </span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    photo.approvalStatus === "approved"
                      ? "bg-green-100 text-green-700"
                      : photo.approvalStatus === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {photo.approvalStatus.charAt(0).toUpperCase() +
                    photo.approvalStatus.slice(1)}
                </span>
              </div>

              {photo.rejectionReason && (
                <div className="text-sm text-red-600">
                  <span className="font-medium">Reason: </span>
                  {photo.rejectionReason}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetailPage;
