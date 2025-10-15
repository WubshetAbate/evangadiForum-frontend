import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaChevronRight, FaSearch } from "react-icons/fa";
import axios from "../../axiosConfig";
import { AppState } from "../../App";
import "./Home.css";

const Home = () => {
  const { user } = useContext(AppState);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/questions", {
        params: searchTerm ? { q: searchTerm } : {},
      });
      setQuestions(response.data.questions || []);
      setError("");
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Failed to load questions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = () => {
    navigate("/questions/ask");
  };

  const handleQuestionClick = (questionid) => {
    navigate(`/questions/${questionid}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Refetch on search term debounce
  useEffect(() => {
    const t = setTimeout(() => {
      fetchQuestions();
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const filteredQuestions = questions; // server-side filtering applied

  // Pagination calculations
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  // Pagination handlers
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getInitials = (username) => {
    if (!username) return "U";
    const names = username.split(" ");
    if (names.length >= 2) {
      return (
        names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase()
      );
    }
    return username.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <div className="welcome-text">
            <span className="welcome-label">Welcome:</span>
            <span className="username">{user?.username || "Guest"}</span>
          </div>
          <button className="ask-question-btn" onClick={handleAskQuestion}>
            Ask Question
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>

      {/* Questions Section */}
      <div className="questions-section">
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchQuestions} className="retry-btn">
              Try Again
            </button>
          </div>
        )}

        {!error && filteredQuestions.length === 0 && !loading && (
          <div className="no-questions">
            <p>No questions found.</p>
            <button onClick={handleAskQuestion} className="ask-question-btn">
              Be the first to ask a question!
            </button>
          </div>
        )}

        {!error && filteredQuestions.length > 0 && (
          <>
            <div className="questions-list">
              {currentQuestions.map((question) => (
                <div
                  key={question.questionid}
                  className="question-item"
                  onClick={() => handleQuestionClick(question.questionid)}
                >
                  <div className="question-user">
                    <div className="user-avatar">
                      <FaUser />
                    </div>
                    <div className="user-info">
                      <span className="username">
                        {question.username || "U"}
                      </span>
                      {question.created_at && (
                        <span className="meta-date">
                          {new Date(question.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="question-content">
                    <h3 className="question-title">{question.title}</h3>
                    <p className="question-description">
                      {question.description.length > 100
                        ? `${question.description.substring(0, 100)}...`
                        : question.description}
                    </p>
                    {question.tag && (
                      <span className="question-tag">{question.tag}</span>
                    )}
                    <div className="question-meta">
                      <span className="meta-item">
                        Asked:{" "}
                        {new Date(question.created_at).toLocaleDateString()}
                      </span>
                      <span className="meta-item">
                        Answers: {question.answer_count ?? 0}
                      </span>
                      {question.latest_answer_date && (
                        <span className="meta-item">
                          Last answer:{" "}
                          {new Date(
                            question.latest_answer_date
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="question-arrow">
                    <FaChevronRight />
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination">
                <div className="pagination-info">
                  <span className="page-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`page-number ${
                            currentPage === pageNum ? "active" : ""
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    )}
                  </span>
                  <span className="page-text">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
