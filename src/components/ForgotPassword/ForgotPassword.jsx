import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../axiosConfig";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await API.post("/users/forgot-password", { email });
      console.log("✅ Forgot password response:", response.data);
      setSuccess("OTP has been sent to your email. Please check your inbox.");
      
      // Navigate to OTP verification page with email
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      console.error("❌ Forgot password error:", err.response || err);
      setError(
        err.response?.data?.msg || "Failed to send OTP. Please try again."
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
            <h2 className="form-heading">Forgot Password</h2>
            <p className="form-subheading">
              Enter your email address and we'll send you an OTP to reset your password.
            </p>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="form-input"
                required
              />

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>

              <div className="auth-links">
                <Link to="/login" className="toggle-link">
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>

        <div className="auth-about-section">
          <span className="about-label">Security</span>
          <h1 className="about-title">Password Recovery</h1>
          <div className="about-text">
            <p>
              We'll send you a secure one-time password (OTP) to your registered email address.
            </p>
            <p>
              This OTP will be valid for 10 minutes. Please check your spam folder if you don't see the email.
            </p>
          </div>
          <div className="decoration-circle"></div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
