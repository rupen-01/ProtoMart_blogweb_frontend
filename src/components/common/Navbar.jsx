import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import {
  Menu,
  X,
  User,
  Wallet,
  Upload,
  LogOut,
  Settings,
  Image,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setUserMenuOpen(false);
  };

  // ✅ Upload button handler
  const handleUploadClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/upload");
    }
  };

  const handleBlogsClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/blogs");
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-[9999]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Image className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">LOGO</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/file-explorer"
              className="text-gray-700 hover:text-blue-600"
            >
              File Explorer
            </Link>

            <button
              onClick={handleBlogsClick}
              className="text-gray-700 hover:text-blue-600"
            >
              Blogs
            </button>

            {/* ✅ Upload (Login check) */}
            <button
              onClick={handleUploadClick}
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>

            {isAuthenticated ? (
              <>
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                  >
                    {user?.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span>{user?.name}</span>
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                      />

                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>

                        <Link
                          to="/my-photos"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                        >
                          <Image className="w-4 h-4" />
                          <span>My Photos</span>
                        </Link>

                        <Link
                          to="/wallet"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                        >
                          <Wallet className="w-4 h-4" />
                          <span>Wallet</span>
                        </Link>

                        {(user?.role === "admin" ||
                          user?.role === "superadmin") && (
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Admin</span>
                          </Link>
                        )}

                        <hr className="my-2" />

                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-gray-100 w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <Link to="/blogs" onClick={() => setMobileMenuOpen(false)}>
                Blogs
              </Link>

              {/* ✅ Upload (Login check) */}
              <button
                onClick={() => {
                  handleUploadClick();
                  setMobileMenuOpen(false);
                }}
                className="text-left text-gray-700 hover:text-blue-600"
              >
                Upload Photo
              </button>

              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    Profile
                  </Link>
                  <Link
                    to="/my-photos"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Photos
                  </Link>
                  <Link to="/wallet" onClick={() => setMobileMenuOpen(false)}>
                    Wallet
                  </Link>

                  {(user?.role === "admin" || user?.role === "superadmin") && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
