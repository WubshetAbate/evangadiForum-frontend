import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import "./Question.css";

const Question = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tag: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Added success state

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "description" && value.length > 1000) return; // limit length
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess(""); // Clear any previous success message

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/questions",
        {
          question: formData.title,
          question_description: formData.description,
          tag: formData.tag || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Question posted successfully:", response.data);

      // Show success message
      setSuccess("Question posted successfully! Redirecting to home...");

      // Clear form
      setFormData({
        title: "",
        description: "",
        tag: "",
      });

      // Navigate to home page after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("Error posting question:", err);
      setError(
        err.response?.data?.msg || "Failed to post question. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="question-page">
      <div className="question-container">
        <div className="question-header">
          <h1 className="question-title">Steps To Write A Good Question</h1>
          <div className="question-date">
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <ul className="question-steps">
            <li>Summarize your problem in a one-line title.</li>
            <li>Describe your problem in more detail.</li>
            <li>Describe what you tried and what you expected to happen.</li>
            <li>Review your question and post it here.</li>
          </ul>
        </div>

        <div className="question-form-section">
          <h2 className="form-title">Post Your Question</h2>

          {/* Success Message */}
          {success && <div className="success-message">{success}</div>}

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="question-form">
            <div className="form-group">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Question title"
                className="form-input"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Question detail ..."
                className="form-textarea"
                rows="8"
                maxLength={1000}
                disabled={loading}
                required
              />
              <div className="char-counter">
                {formData.description.length}/1000
              </div>
            </div>

            <div className="form-group">
              <input
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                placeholder="Tag (optional)"
                className="form-input"
                disabled={loading}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Posting..." : "Post Question"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Question;
