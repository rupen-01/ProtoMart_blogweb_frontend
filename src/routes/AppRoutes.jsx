// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import ProtectedRoute from './ProtectedRoute';
// import AdminRoute from './AdminRoute';

// // Layout
// import Navbar from '../components/common/Navbar';
// import Footer from '../components/common/Footer';

// // Pages
// import HomePage from '../pages/HomePage';
// import LoginPage from '../pages/LoginPage';
// import RegisterPage from '../pages/RegisterPage';
// import ExplorePage from '../pages/ExplorePage';
// import PlaceDetailPage from '../pages/PlaceDetailPage';
// import PhotoDetailPage from '../pages/PhotoDetailPage';
// // import UploadPhotoPage from '../pages/UploadPhotoPage';
// // import MyPhotosPage from '../pages/MyPhotosPage';
// // import GooglePhotosSyncPage from '../pages/GooglePhotosSyncPage';
// import BlogsPage from '../pages/BlogsPage';
// // import BlogDetailPage from '../pages/BlogDetailPage';
// import BlogEditor from '../components/blogs/BlogEditor';
// import WalletPage from '../pages/WalletPage';
// // import ProfilePage from '../pages/ProfilePage';
// import AdminDashboardPage from '../pages/AdminDashboardPage';

// const AppRoutes = () => {
//   return (
//     <BrowserRouter>
//       <div className="flex flex-col min-h-screen">
//         <Navbar />
//         <main className="flex-1">
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<HomePage />} />
//             <Route path="/login" element={<LoginPage />} />
//             <Route path="/register" element={<RegisterPage />} />
//             <Route path="/explore" element={<ExplorePage />} />
//             <Route path="/places/:id" element={<PlaceDetailPage />} />
//             <Route path="/photos/:id" element={<PhotoDetailPage />} />
//             <Route path="/blogs" element={<BlogsPage />} />
//             {/* <Route path="/blogs/:id" element={<BlogDetailPage />} /> */}

//             {/* Protected Routes */}
//             {/* <Route
//               path="/upload"
//               element={
//                 <ProtectedRoute>
//                   <UploadPhotoPage />
//                 </ProtectedRoute>
//               }
//             /> */}
//             {/* <Route
//               path="/my-photos"
//               element={
//                 <ProtectedRoute>
//                   <MyPhotosPage />
//                 </ProtectedRoute>
//               }
//             /> */}
//             {/* <Route
//               path="/google-photos-sync"
//               element={
//                 <ProtectedRoute>
//                   <GooglePhotosSyncPage />
//                 </ProtectedRoute>
//               }
//             /> */}
//             <Route
//               path="/blogs/write"
//               element={
//                 <ProtectedRoute>
//                   <BlogEditor />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/blogs/:id/edit"
//               element={
//                 <ProtectedRoute>
//                   <BlogEditor />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/wallet"
//               element={
//                 <ProtectedRoute>
//                   <WalletPage />
//                 </ProtectedRoute>
//               }
//             />
//             {/* <Route
//               path="/profile"
//               element={
//                 <ProtectedRoute>
//                   <ProfilePage />
//                 </ProtectedRoute>
//               }
//             /> */}

//             {/* Admin Routes */}
//             <Route
//               path="/admin"
//               element={
//                 <AdminRoute>
//                   <AdminDashboardPage />
//                 </AdminRoute>
//               }
//             />

//             {/* 404 Page */}
//             <Route path="*" element={<NotFoundPage />} />
//           </Routes>
//         </main>
//         <Footer />
//       </div>
//     </BrowserRouter>
//   );
// };

// // 404 Page Component
// const NotFoundPage = () => {
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-50">
//       <div className="text-center">
//         <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
//         <p className="text-xl text-gray-600 mb-8">Page not found</p>
//         <a href="/" className="text-blue-600 hover:text-blue-700 underline">
//           Go back home
//         </a>
//       </div>
//     </div>
//   );
// };

// export default AppRoutes;

import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

// Layout
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

// Pages
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
// import ExplorePage from "../pages/ExplorePage";
import PlaceDetailPage from "../pages/PlaceDetailPage";
import PhotoDetailPage from "../pages/PhotoDetailPage";
import BlogsPage from "../pages/BlogsPage";
import BlogEditor from "../components/blogs/BlogEditor";
import WalletPage from "../pages/WalletPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import ProfilePage from "../pages/ProfilePage";
import UploadPhotoPage from '../pages/UploadPhotoPage';
import MyPhotosPage from '../pages/MyPhotosPage';

const AppRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* <Route path="/explore" element={<ExplorePage />} /> */}
          <Route path="/places/:id" element={<PlaceDetailPage />} />
          <Route path="/photos/:id" element={<PhotoDetailPage />} />
          <Route path="/blogs" element={<BlogsPage />} />

          {/* Protected */}
          <Route
            path="/blogs/write"
            element={
              <ProtectedRoute>
                <BlogEditor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/blogs/:id/edit"
            element={
              <ProtectedRoute>
                <BlogEditor />
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

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
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

          {/* 404 */}
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
