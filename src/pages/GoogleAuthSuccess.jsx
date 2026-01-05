import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../store/authStore";
import axiosInstance from "../api/axios";
import toast from "react-hot-toast";

const GoogleAuthSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    const error = params.get("error");

    // ❌ Handle errors from backend
    if (error) {
      if (error === "google_failed") {
        toast.error("Google login failed");
      } else {
        toast.error("Authentication error");
      }
      navigate("/login");
      return;
    }

    // ❌ No token found
    if (!token) {
      toast.error("Google login failed - no token received");
      navigate("/login");
      return;
    }

    // ✅ Save tokens
    localStorage.setItem("token", token);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    // ✅ Fetch logged-in user data
    axiosInstance
      .get("/auth/me")
      .then((res) => {
        login(res.data.data, token); // Note: backend returns data inside 'data' field
        toast.success("Logged in with Google! 🎉");
        
        // ✅ Check if user is new (optional: you can add a flag from backend)
        // For now, redirect to dashboard for all Google logins
        navigate("/");
      })
      .catch((err) => {
        console.error("Auth failed:", err);
        toast.error("Authentication failed. Please try again.");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        navigate("/login");
      });
  }, [login, navigate, params]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-lg font-semibold text-gray-700">
          Signing you in with Google...
        </p>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;