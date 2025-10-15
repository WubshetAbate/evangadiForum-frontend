import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../axiosConfig";
import "./ResetPassword.css";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { email, token } = location.state || {};

  // Redirect if no email or token
  useEffect(() => {
    if (!email || !token) {
      navigate("/forgot-password");
    }
  }, [email, token, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid:
        minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError(
        "Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/users/reset-password", {
        email,
        token,
        password: formData.password,
      });

      console.log("✅ Password reset response:", response.data);

      // Navigate to login page with success message
      navigate("/login", {
        state: {
          message:
            "Password reset successfully! Please login with your new password.",
        },
      });
    } catch (err) {
      console.error("❌ Password reset error:", err.response || err);
      setError(
        err.response?.data?.msg || "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!email || !token) {
    return null; // Will redirect
  }

  const passwordValidation = validatePassword(formData.password);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-section">
          <div className="auth-form-card">
            <h2 className="form-heading">Reset Password</h2>
            <p className="form-subheading">
              Create a new password for <strong>{email}</strong>
            </p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="New password"
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Password strength indicator */}
              {formData.password && (
                <div className="password-strength">
                  <h4>Password Requirements:</h4>
                  <div className="requirement">
                    <span
                      className={
                        passwordValidation.minLength ? "valid" : "invalid"
                      }
                    >
                      ✓
                    </span>
                    At least 8 characters
                  </div>
                  <div className="requirement">
                    <span
                      className={
                        passwordValidation.hasUpperCase ? "valid" : "invalid"
                      }
                    >
                      ✓
                    </span>
                    One uppercase letter
                  </div>
                  <div className="requirement">
                    <span
                      className={
                        passwordValidation.hasLowerCase ? "valid" : "invalid"
                      }
                    >
                      ✓
                    </span>
                    One lowercase letter
                  </div>
                  <div className="requirement">
                    <span
                      className={
                        passwordValidation.hasNumbers ? "valid" : "invalid"
                      }
                    >
                      ✓
                    </span>
                    One number
                  </div>
                  <div className="requirement">
                    <span
                      className={
                        passwordValidation.hasSpecialChar ? "valid" : "invalid"
                      }
                    >
                      ✓
                    </span>
                    One special character
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="submit-btn"
                disabled={
                  loading ||
                  !passwordValidation.isValid ||
                  formData.password !== formData.confirmPassword
                }
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </button>

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
          <h1 className="about-title">New Password</h1>
          <div className="about-text">
            <p>
              Choose a strong password that you haven't used before. A strong
              password helps protect your account.
            </p>
            <p>
              Make sure to use a combination of letters, numbers, and special
              characters for maximum security.
            </p>
          </div>
          <div className="decoration-circle"></div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
