import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogsAPI } from '../../api/blogs.api';
import { ArrowLeft, MapPin, Calendar, Eye, User, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await blogsAPI.getBlogById(id);

      console.log('Fetched blog:', response.data);
      setBlog(response.data);
    } catch (error) {
      toast.error('Failed to load blog');
      navigate('/blogs');
    } finally {
      setLoading(false);
    }
  };



  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      await blogsAPI.deleteBlog(id);
      toast.success('Blog deleted successfully');
      navigate('/blogs');
    } catch (error) {
      toast.error('Failed to delete blog');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!blog) return null;

  const isAuthor = user && blog.authorId._id === user._id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>
      </div>

      {/* Cover Image */}
      

      {/* Blog Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <div className="mb-6">
            
            <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-sm text-gray-500 pb-4 border-b">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {blog.authorId.profilePhoto ? (
                    <img
                      src={blog.authorId.profilePhoto}
                      alt={blog.authorId.name}
                      className="w-10 h-10 rounded-full mr-2"
                    />
                  ) : (
                    <User className="w-10 h-10 text-gray-400 mr-2" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{blog.authorId.name}</p>
                    <p className="text-xs">{blog.authorId.email}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {blog.publishedAt && format(new Date(blog.publishedAt), 'PPP')}
                </div>

                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {blog.views || 0} views
                </div>
              </div>

              {/* Edit/Delete Buttons */}
              {isAuthor && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/blogs/edit/${blog._id}`)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>

            {/* Place Info */}
            {blog.placeId && (
              <div
                onClick={() => navigate(`/places/${blog.placeId._id}`)}
                className="flex items-center mt-4 text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                <MapPin className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  {blog.placeId.name}
                  {blog.placeId.city && `, ${blog.placeId.city}`}
                  {blog.placeId.state && `, ${blog.placeId.state}`}
                </span>
              </div>
            )}

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Blog Content */}

          {blog.coverImages && (
        blog.coverImages.map((imgUrl, index) => (
          <div
            key={index}
            className="w-full h-64 md:h-96 bg-gray-200 overflow-hidden mb-4"
          >
            <img
              src={imgUrl.url}
              alt={`Cover ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))
      )}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>
      </div>
    </div>
  );
};

export default BlogDetailPage;