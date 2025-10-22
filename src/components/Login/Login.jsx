import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import { AppState } from "../../App";
import "./Login.css";

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const { setuser } = useContext(AppState);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate fields are not empty
    if (!formData.email || !formData.password) {
      setError("Please provide both email and password");
      return;
    }

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Email and password cannot be empty");
      return;
    }

    setLoading(true);

    try {
      console.log("Attempting login with:", {
        email: formData.email,
        password: "***",
      });

      // Step 1: Login and get token
      const loginResponse = await axios.post("/users/login", {
        email: formData.email.trim(),
        password: formData.password.trim(),
      });

      console.log("Login response:", loginResponse.data);

      const token = loginResponse.data.token;
      localStorage.setItem("token", token);

      // Step 2: Fetch user data with the token
      const userResponse = await axios.get("/users/check", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      console.log("User data:", userResponse.data);

      // Step 3: Set user in context
      setuser(userResponse.data);
      setIsLoggedIn(true);

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      console.error("Error response:", err.response?.data);

      setError(
        err.response?.data?.msg ||
          "Login failed. Please check your credentials."
      );
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Login Form */}
        <div className="auth-form-section">
          <div className="auth-form-card">
            <h2 className="form-heading">Login to your account</h2>

            <p className="form-subheading">
              Don't have an account?{" "}
              <Link to="/register" className="toggle-link">
                Create a new account
              </Link>
            </p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className="form-input"
                required
              />

              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <div className="forgot-password-link">
                <Link to="/forgot-password" className="forgot-link">
                  Forgot your password?
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - About Section */}
        <div className="auth-about-section">
          <span className="about-label">About</span>
          <h1 className="about-title">Evangadi Networks</h1>

          <div className="about-text">
            <p>
              No matter what stage of life you are in, whether you're just
              starting elementary school or being promoted to CEO of a Fortune
              500 company, you have much to offer to those who are trying to
              follow in your footsteps.
            </p>

            <p>
              Whether you are willing to share your knowledge or you are just
              looking to meet mentors of your own, please start by joining the
              network here.
            </p>
          </div>

          <button className="how-it-works-btn">HOW IT WORKS</button>

          <div className="decoration-circle"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
