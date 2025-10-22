import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import { AppState } from "../../App";
import "./SignUp.css";

const SignUp = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const { setuser } = useContext(AppState);
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
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
    setLoading(true);

    try {
      const response = await axios.post("/users/register", formData);
      console.log("✅ Registration response:", response.data);

      // Optional: clear form fields
      setFormData({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "",
      });
      // Auto-login after successful registration
      const loginResponse = await axios.post("/users/login", {
        email: formData.email.trim(),
        password: formData.password.trim(),
      });

      const token = loginResponse.data.token;
      localStorage.setItem("token", token);

      // Fetch and set user
      const userResponse = await axios.get("/users/check", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      setuser(userResponse.data);
      if (typeof setIsLoggedIn === "function") {
        setIsLoggedIn(true);
      }

      // Navigate to home
      navigate("/");
    } catch (err) {
      console.error("❌ Registration error:", err.response || err);
      setError(
        err.response?.data?.msg || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-section">
          <div className="auth-form-card">
            <h2 className="form-heading">Join the network</h2>
            <p className="form-subheading">
              Already have an account?{" "}
              <Link to="/login" className="toggle-link">
                Sign in
              </Link>
            </p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="form-input"
                required
              />

              <div className="name-row">
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder="First name"
                  className="form-input"
                  required
                />
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="form-input"
                  required
                />
              </div>

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

              <p className="terms-text">
                I agree to the{" "}
                <Link to="/terms" className="link">
                  privacy policy
                </Link>{" "}
                and{" "}
                <Link to="/terms" className="link">
                  terms of service
                </Link>
                .
              </p>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Creating account..." : "Agree and Join"}
              </button>
            </form>
          </div>
        </div>

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

export default SignUp;
