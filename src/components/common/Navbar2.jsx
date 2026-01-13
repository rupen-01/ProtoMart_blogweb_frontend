import React, { useState, useEffect } from "react";
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
  Compass,
  FileText,
  ChevronDown,
  Sparkles,
} from "lucide-react";

const Navbar = ({ className = "" }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setUserMenuOpen(false);
  };

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
    <nav
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
        scrolled
          ? "bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-blue-900/20 border-b border-white/10"
          : "bg-slate-900/80 backdrop-blur-md"
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <Image className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                TravelVision
              </span>
              <span className="text-[10px] text-gray-400 -mt-1">
                Share Your World
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/file-explorer"
              className="group relative px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4" />
                Explore
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform"></div>
            </Link>

            <button
              onClick={handleBlogsClick}
              className="group relative px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Blogs
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform"></div>
            </button>

            {/* Upload Button */}
            <button
              onClick={handleUploadClick}
              className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-semibold hover:shadow-lg  transition-all hover:scale-105 ml-2"
            >
              <span className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0  transition-opacity"></div>
            </button>

            {isAuthenticated ? (
              <>
                {/* User Menu */}
                <div className="relative ml-2">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
                  >
                    {user?.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={user.name}
                        className="w-8 h-8 rounded-full ring-2 ring-blue-500/50"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-white font-medium hidden lg:block">
                      {user?.name}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                      />

                      <div className="absolute right-0 mt-3 w-64 bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 py-2 z-20 overflow-hidden">
                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b border-white/10">
                          <div className="flex items-center gap-3">
                            {user?.profilePhoto ? (
                              <img
                                src={user.profilePhoto}
                                alt={user.name}
                                className="w-12 h-12 rounded-full ring-2 ring-blue-500/50"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                {user?.name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-white">
                                {user?.name}
                              </div>
                              <div className="text-xs text-gray-400">
                                {user?.email}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="py-2">
                          <Link
                            to="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-all group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                              <User className="w-4 h-4 text-blue-400" />
                            </div>
                            <span>Profile</span>
                          </Link>

                          <Link
                            to="/my-photos"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-all group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                              <Image className="w-4 h-4 text-purple-400" />
                            </div>
                            <span>My Photos</span>
                          </Link>

                          <Link
                            to="/wallet"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-all group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                              <Wallet className="w-4 h-4 text-green-400" />
                            </div>
                            <span>Wallet</span>
                          </Link>

                          {(user?.role === "admin" ||
                            user?.role === "superadmin") && (
                            <Link
                              to="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-all group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                                <Settings className="w-4 h-4 text-orange-400" />
                              </div>
                              <span>Admin Panel</span>
                              <Sparkles className="w-3 h-3 text-yellow-400 ml-auto" />
                            </Link>
                          )}
                        </div>

                        <div className="border-t border-white/10 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all w-full group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                              <LogOut className="w-4 h-4" />
                            </div>
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 ml-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-6 pt-4 border-t border-white/10">
            <div className="flex flex-col space-y-2">
              {/* Mobile User Info */}
              {isAuthenticated && (
                <div className="flex items-center gap-3 px-4 py-4 bg-white/5 rounded-xl mb-4">
                  {user?.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user.name}
                      className="w-12 h-12 rounded-full ring-2 ring-blue-500/50"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-white">{user?.name}</div>
                    <div className="text-xs text-gray-400">{user?.email}</div>
                  </div>
                </div>
              )}

              <Link
                to="/file-explorer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <Compass className="w-5 h-5" />
                <span>Explore</span>
              </Link>

              <button
                onClick={() => {
                  handleBlogsClick();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all text-left"
              >
                <FileText className="w-5 h-5" />
                <span>Blogs</span>
              </button>

              <button
                onClick={() => {
                  handleUploadClick();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Photo</span>
              </button>

              {isAuthenticated ? (
                <>
                  <div className="border-t border-white/10 my-2"></div>

                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>

                  <Link
                    to="/my-photos"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    <Image className="w-5 h-5" />
                    <span>My Photos</span>
                  </Link>

                  <Link
                    to="/wallet"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    <Wallet className="w-5 h-5" />
                    <span>Wallet</span>
                  </Link>

                  {(user?.role === "admin" || user?.role === "superadmin") && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Admin Panel</span>
                      <Sparkles className="w-4 h-4 text-yellow-400 ml-auto" />
                    </Link>
                  )}

                  <div className="border-t border-white/10 my-2"></div>

                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-white/10 my-2"></div>

                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
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
