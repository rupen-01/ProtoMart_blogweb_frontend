import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { blogsAPI } from "../api/blogs.api";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import BlogCard from "../components/blogs/BlogCard";
import { PlusCircle } from "lucide-react";

const BlogsPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user); 
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      // Fetch all published blogs
      const res = await blogsAPI.getBlogs({ status: "published" });
      setBlogs(res.data);
    } catch (err) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    if (!isAuthenticated) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    navigate("/blogs/write");
  };

  // Filter blogs by search query
  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.placeId?.name?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Blogs</h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by title or place"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {isAuthenticated && (
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                <PlusCircle className="w-5 h-5" />
                Write Blog
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            No blogs found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
