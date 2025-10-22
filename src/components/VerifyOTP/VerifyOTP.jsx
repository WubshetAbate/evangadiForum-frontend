import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import "./VerifyOTP.css";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [resendLoading, setResendLoading] = useState(false);

  const email = location.state?.email;

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/users/verify-otp", {
        email,
        otp: otp.trim(),
      });
      console.log("✅ OTP verification response:", response.data);

      // Navigate to reset password page
      navigate("/reset-password", {
        state: {
          email,
          token: response.data.token,
        },
      });
    } catch (err) {
      console.error("❌ OTP verification error:", err.response || err);
      setError(err.response?.data?.msg || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setResendLoading(true);

    try {
      await axios.post("/users/forgot-password", { email });
      setTimeLeft(600); // Reset timer
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("❌ Resend OTP error:", err.response || err);
      setError(
        err.response?.data?.msg || "Failed to resend OTP. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return null; // Will redirect
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-section">
          <div className="auth-form-card">
            <h2 className="form-heading">Verify OTP</h2>
            <p className="form-subheading">
              We've sent a 6-digit code to <strong>{email}</strong>
            </p>
            <p className="timer-text">
              Code expires in:{" "}
              <span className="timer">{formatTime(timeLeft)}</span>
            </p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="otp-input-container">
                <input
                  type="text"
                  name="otp"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="Enter 6-digit code"
                  className="otp-input"
                  maxLength="6"
                  required
                />
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <div className="resend-section">
                <p className="resend-text">Didn't receive the code?</p>
                <button
                  type="button"
                  className="resend-btn"
                  onClick={handleResendOTP}
                  disabled={resendLoading || timeLeft > 0}
                >
                  {resendLoading ? "Sending..." : "Resend OTP"}
                </button>
              </div>

              <div className="auth-links">
                <button
                  type="button"
                  className="back-link"
                  onClick={() => navigate("/forgot-password")}
                >
                  Back to Forgot Password
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="auth-about-section">
          <span className="about-label">Security</span>
          <h1 className="about-title">OTP Verification</h1>
          <div className="about-text">
            <p>Please enter the 6-digit code we sent to your email address.</p>
            <p>
              The code is valid for 10 minutes. If you don't receive it, check
              your spam folder or request a new code.
            </p>
          </div>
          <div className="decoration-circle"></div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
