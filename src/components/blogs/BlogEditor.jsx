import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { blogsAPI } from "../../api/blogs.api";
import { placesAPI } from "../../api/places.api";
import { Save, Eye, ArrowLeft, MapPin } from "lucide-react";
import toast from "react-hot-toast";

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [returnPath, setReturnPath] = useState(null);
  const location = useLocation();
  const preselectedPlace = location.state?.place;
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchPlaces();
    if (isEditMode) {
      fetchBlog();
    } else if (preselectedPlace) {
      setValue("placeId", preselectedPlace._id);
      setSelectedPlace(preselectedPlace);
      setReturnPath(`/places/${preselectedPlace._id}`);
    }
  }, [id, preselectedPlace]);

  const fetchPlaces = async () => {
    try {
      const response = await placesAPI.getAllPlaces({ limit: 100 });
      setPlaces(response.data);
    } catch (error) {
      toast.error("Failed to load places");
    }
  };

  const fetchBlog = async () => {
    try {
      const response = await blogsAPI.getBlogById(id);
      const blog = response.data;

      setValue("title", blog.title);
      setValue("content", blog.content);
      setValue("placeId", blog.placeId._id);
      setValue("coverImage", blog.coverImage);
      setValue("tags", blog.tags?.join(", ") || "");
    } catch (error) {
      toast.error("Failed to load blog");
      navigate("/blogs");
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("placeId", data.placeId);
      formData.append(
        "tags",
        JSON.stringify(
          data.tags ? data.tags.split(",").map((t) => t.trim()) : []
        )
      );

      if (data.coverImages) {
        Array.from(data.coverImages).forEach((file) => {
          formData.append("coverImages", file);
        });
      }

      if (isEditMode) {
        await blogsAPI.updateBlog(id, formData);
        toast.success("Blog updated");
      } else {
        await blogsAPI.createBlog(formData);
        toast.success("Blog created");
      }

      // ADD THIS: Redirect back to place detail page or default
      if (returnPath) {
        navigate(returnPath);
      } else {
        navigate("/blogs");
      }
    } catch (err) {
      toast.error("Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!id) {
      toast.error("Please save the blog first");
      return;
    }

    try {
      await blogsAPI.publishBlog(id);
      toast.success("Blog published successfully");
      navigate(`/blogs/${id}`);
    } catch (error) {
      toast.error("Failed to publish blog");
    }
  };

  const filteredPlaces = places.filter(
    (place) =>
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <h1 className="text-3xl font-bold">
            {isEditMode ? "Edit Blog" : "Write New Blog"}
          </h1>

          <div className="w-20"></div>
        </div>

        {selectedPlace && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {selectedPlace.name}
                </h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">
                    {selectedPlace.city && `${selectedPlace.city}, `}
                    {selectedPlace.state && `${selectedPlace.state}, `}
                    {selectedPlace.country}
                  </span>
                </div>
              </div>
              <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                Writing about this place
              </span>
            </div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow-md p-8"
        >
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Blog Title *
            </label>
            <input
              type="text"
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 5,
                  message: "Title must be at least 5 characters",
                },
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter an engaging title..."
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Place Selection */}
          {!preselectedPlace && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Place *</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search places..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <select
                {...register("placeId", { required: "Place is required" })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a place</option>
                {filteredPlaces.map((place) => (
                  <option key={place._id} value={place._id}>
                    {place.name}
                    {place.city && `, ${place.city}`}
                    {place.country && `, ${place.country}`}
                  </option>
                ))}
              </select>
              {errors.placeId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.placeId.message}
                </p>
              )}
            </div>
          )}

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Content *</label>
            <textarea
              {...register("content", {
                required: "Content is required",
                minLength: {
                  value: 50,
                  message: "Content must be at least 50 characters",
                },
              })}
              rows={15}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="Write your travel story here... (HTML supported)"
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              You can use HTML tags for formatting (e.g., &lt;p&gt;, &lt;h2&gt;,
              &lt;strong&gt;, etc.)
            </p>
          </div>

          {/* Cover Image URL */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Cover Images (Multiple)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setValue("coverImages", e.target.files)}
              className="w-full"
            />
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Tags (Optional)
            </label>
            <input
              type="text"
              {...register("tags")}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="travel, adventure, nature (comma separated)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate tags with commas
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>

            <div className="flex items-center space-x-3">
              {isEditMode && (
                <button
                  type="button"
                  onClick={handlePublish}
                  className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Eye className="w-5 h-5" />
                  <span>Publish</span>
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? "Saving..." : "Save Draft"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogEditor;
