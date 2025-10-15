// App.js - Complete with Route Protection
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, createContext } from "react";
import axios from "./axiosConfig";

// layout
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

// pages
import Home from "./pages/Home/Home";
import Question from "./pages/Question/Question"; // Ask Question page
import Answer from "./pages/Answer/Answer"; // Question Detail with Answers page

// auth + about under components
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import About from "./components/About/About";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import VerifyOTP from "./components/VerifyOTP/VerifyOTP";
import ResetPassword from "./components/ResetPassword/ResetPassword";

export const AppState = createContext();

function App() {
  const [user, setuser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Also check auth when location changes (for real-time protection)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isLoggedIn && !loading) {
      checkAuth();
    }
  }, [location.pathname]);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    // If no token, user is not logged in
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    // Verify token with backend
    try {
      const { data } = await axios.get("/users/check", {
        headers: { Authorization: "Bearer " + token },
      });
      setuser(data);
      setIsLoggedIn(true);
    } catch (error) {
      console.log("Auth check failed:", error?.response);
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setuser({});
    } finally {
      setLoading(false);
    }
  };

  // Handle logout and login
  const handleSetIsLoggedIn = (loggedIn) => {
    if (!loggedIn) {
      localStorage.removeItem("token");
      setuser({});
      setIsLoggedIn(false);
      navigate("/login");
    } else {
      setIsLoggedIn(true);
      // Re-check auth after login to get user data
      checkAuth();
    }
  };

  // Redirect logic after loading
  useEffect(() => {
    if (loading) return;

    const publicPaths = [
      "/login",
      "/register",
      "/about",
      "/forgot-password",
      "/verify-otp",
      "/reset-password",
    ];
    const isPublicPath = publicPaths.includes(location.pathname);

    // If not logged in and trying to access protected route, redirect to login
    if (!isLoggedIn && !isPublicPath) {
      navigate("/login", { replace: true });
    }

    // If logged in and trying to access login/register, redirect to home
    if (
      isLoggedIn &&
      (location.pathname === "/login" || location.pathname === "/register")
    ) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, loading, location.pathname, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <AppState.Provider value={{ user, setuser }}>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={handleSetIsLoggedIn} />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={<Login setIsLoggedIn={handleSetIsLoggedIn} />}
        />
        <Route
          path="/register"
          element={<SignUp setIsLoggedIn={handleSetIsLoggedIn} />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes - Only accessible when logged in */}
        <Route path="/" element={<Home />} />
        <Route path="/questions/ask" element={<Question />} />
        <Route path="/questions/:questionid" element={<Answer />} />
      </Routes>

      <Footer />
    </AppState.Provider>
  );
}

export default App;
