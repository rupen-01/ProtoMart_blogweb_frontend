import { useRoutes, Navigate } from "react-router-dom";

import Home from "../src/pages/HomePage";
import Login from "../src/pages/LoginPage";
import Register from "../src/pages/RegisterPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import CreatePost from "./pages/Post/CreatePost";
import Wallet from "./pages/Wallet/Wallet";
import AdminDashboard from "../src/pages/AdminDashboardPage";
import Profile from "../src/pages/ProfilePage";
// import GooglePhotos from "../src/pages/";
import GoogleAuthSuccess from "../src/pages/GoogleAuthSuccess";


/* ================== AUTH GUARDS ================== */

// 🔐 User Protected Route
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// 🧑‍💼 Admin Protected Route
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) return <Navigate to="/login" replace />;

  return user?.role === "admin" ? (
    children
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

/* ================== ROUTES ================== */

export default function AppRouter() {
  return useRoutes([
    /* 🌍 PUBLIC */
    { path: "/", element: <Home /> },

    /* 🔐 AUTH */
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },

    /* 👤 USER */
    {
      path: "/dashboard",
      element: (
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      ),
    },
    {
      path: "/profile",
      element: (
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      ),
    },
    {
      path: "/create-post",
      element: (
        <PrivateRoute>
          <CreatePost />
        </PrivateRoute>
      ),
    },
    {
      path: "/wallet",
      element: (
        <PrivateRoute>
          <Wallet />
        </PrivateRoute>
      ),
    },
    // {
    //   path: "/google-photos",
    //   element: (
    //     <PrivateRoute>
    //       <GooglePhotos />
    //     </PrivateRoute>
    //   ),
    // },

    /* 🧑‍💼 ADMIN */
    {
      path: "/admin",
      element: (
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      ),
    },

    { path: "/google-auth-success", 
      element: <GoogleAuthSuccess /> },

    /* ❌ FALLBACK */
    { path: "*", element: <Navigate to="/" replace /> },
  ]);
}
