import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

// Layout
import Navbar from "../components/common/Navbar";
import Navbar2 from "../components/common/Navbar2";
import Footer from "../components/common/Footer";

// Pages
import HomePage from "../pages/HomePage";
import HomePageUpdate from "../pages/HomePageUpdate";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ExplorePage from "../pages/ExplorePage";
import PlaceDetailPage from "../pages/PlaceDetailPage";
import PhotoDetailPage from "../pages/PhotoDetailPage";
import BlogsPage from "../pages/BlogsPage";
import BlogEditor from "../components/blogs/BlogEditor";
import WalletPage from "../pages/WalletPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import ProfilePage from "../pages/ProfilePage";
import UploadPhotoPage from '../pages/UploadPhotoPage';
import MyPhotosPage from '../pages/MyPhotosPage';
import GoogleAuthSuccess from '../pages/GoogleAuthSuccess'; // ✅ ADD THIS
import BlogDetailPage from "../components/blogs/BlogDetail";

const AppRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar2 className="mb-10" />

      <main className="flex-1 pt-20">
        <Routes>
          {/* ==================== PUBLIC ROUTES ==================== */}
          <Route path="/" element={<HomePageUpdate />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/file-explorer" element={<ExplorePage />} />
          <Route path="/places/:id" element={<PlaceDetailPage />} />
          <Route path="/photos/:id" element={<PhotoDetailPage />} />
          <Route path="/blogs" element={<BlogsPage />} />

          {/* ✅ GOOGLE AUTH SUCCESS ROUTE - MUST BE PUBLIC */}
          <Route path="/google-auth-success" element={<GoogleAuthSuccess />} />

          {/* ==================== PROTECTED ROUTES ==================== */}
          <Route
            path="/blogs/write"
            element={
              <ProtectedRoute>
                <BlogEditor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/blogs/edit/:id"
            element={
              <ProtectedRoute>
                <BlogEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs/:id"
            element={
              <ProtectedRoute>
                <BlogDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <WalletPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadPhotoPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-photos"
            element={
              <ProtectedRoute>
                <MyPhotosPage />
              </ProtectedRoute>
            }
          />

          {/* ==================== ADMIN ROUTES ==================== */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />

          {/* ==================== 404 FALLBACK ==================== */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

const NotFoundPage = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <a href="/" className="text-blue-600 underline">
        Go back home
      </a>
    </div>
  </div>
);

export default AppRoutes;