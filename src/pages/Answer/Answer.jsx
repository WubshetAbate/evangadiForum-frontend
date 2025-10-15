import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUser, FaArrowLeft } from "react-icons/fa";
import axios from "../../axiosConfig";
import { AppState } from "../../App";
import "./Answer.css";

const Answer = () => {
  const { questionid } = useParams();
  const { user } = useContext(AppState);
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Edit state for question
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editQuestionTitle, setEditQuestionTitle] = useState("");
  const [editQuestionDescription, setEditQuestionDescription] = useState("");
  const [editQuestionTag, setEditQuestionTag] = useState("");

  // Edit state for answers
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editingAnswerText, setEditingAnswerText] = useState("");

  useEffect(() => {
    fetchQuestionAndAnswers();
  }, [questionid]);

  const fetchQuestionAndAnswers = async () => {
    try {
      setLoading(true);

      // Fetch question details
      const questionResponse = await axios.get(`/questions/${questionid}`);
      setQuestion(questionResponse.data.question);
      // Initialize edit fields when question loads
      const q = questionResponse.data.question;
      setEditQuestionTitle(q?.title || "");
      setEditQuestionDescription(q?.description || "");
      setEditQuestionTag(q?.tag || "");

      // Fetch answers for this question
      const answersResponse = await axios.get(`/answers/${questionid}`);
      setAnswers(answersResponse.data.answers || []);

      setError("");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load question details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    if (!newAnswer.trim()) {
      setError("Please write an answer");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const token = localStorage.getItem("token");
      await axios.post(
        "/answers",
        {
          answer: newAnswer,
          question_id: questionid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMsg("Answer posted successfully!");
      setNewAnswer("");

      // Refresh answers
      setTimeout(() => {
        fetchQuestionAndAnswers();
        setSuccessMsg("");
      }, 1500);
    } catch (err) {
      console.error("Error posting answer:", err);
      setError(err.response?.data?.msg || "Failed to post answer");
    } finally {
      setSubmitting(false);
    }
  };

  const userOwnsQuestion =
    user && question && user.userid === question.owner_userid;

  const startEditQuestion = () => {
    setIsEditingQuestion(true);
  };

  const cancelEditQuestion = () => {
    setIsEditingQuestion(false);
    setEditQuestionTitle(question.title || "");
    setEditQuestionDescription(question.description || "");
    setEditQuestionTag(question.tag || "");
  };

  const saveEditQuestion = async () => {
    if (!editQuestionTitle.trim() || !editQuestionDescription.trim()) {
      setError("Please provide title and description");
      return;
    }
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `/questions/${questionid}`,
        {
          title: editQuestionTitle.trim(),
          description: editQuestionDescription.trim(),
          tag: editQuestionTag || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchQuestionAndAnswers();
      setIsEditingQuestion(false);
      setSuccessMsg("Question updated");
      setTimeout(() => setSuccessMsg(""), 1500);
    } catch (err) {
      console.error("Error updating question:", err);
      setError(err.response?.data?.msg || "Failed to update question");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteQuestion = async () => {
    if (!window.confirm("Delete this question? This cannot be undone.")) return;
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.delete(`/questions/${questionid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
    } catch (err) {
      console.error("Error deleting question:", err);
      setError(err.response?.data?.msg || "Failed to delete question");
    } finally {
      setSubmitting(false);
    }
  };

  const userOwnsAnswer = (answer) =>
    user && answer && user.userid === answer.userid;

  const startEditAnswer = (answer) => {
    setEditingAnswerId(answer.answerid);
    setEditingAnswerText(answer.answer);
  };

  const cancelEditAnswer = () => {
    setEditingAnswerId(null);
    setEditingAnswerText("");
  };

  const saveEditAnswer = async (answerid) => {
    if (!editingAnswerText.trim()) {
      setError("Answer cannot be empty");
      return;
    }
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `/answers/${answerid}`,
        { answer: editingAnswerText.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchQuestionAndAnswers();
      setEditingAnswerId(null);
      setEditingAnswerText("");
    } catch (err) {
      console.error("Error updating answer:", err);
      setError(err.response?.data?.msg || "Failed to update answer");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteAnswer = async (answerid) => {
    if (!window.confirm("Delete this answer? This cannot be undone.")) return;
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.delete(`/answers/${answerid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchQuestionAndAnswers();
    } catch (err) {
      console.error("Error deleting answer:", err);
      setError(err.response?.data?.msg || "Failed to delete answer");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="answer-container">
        <div className="loading">Loading question...</div>
      </div>
    );
  }

  if (error && !question) {
    return (
      <div className="answer-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate("/")} className="back-btn">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="answer-container">
      {/* Back Button */}
      <button onClick={() => navigate("/")} className="back-button">
        <FaArrowLeft /> Back to Questions
      </button>

      {/* Question Section */}
      <div className="question-section">
        <h1 className="page-title">Question</h1>

        <div className="question-detail-card">
          <div className="question-header">
            <div className="question-user-info">
              <div className="user-avatar">
                <FaUser />
              </div>
              <span className="username">{question?.username}</span>
            </div>
            {userOwnsQuestion && (
              <div className="question-actions">
                {!isEditingQuestion ? (
                  <>
                    <button
                      className="action-btn"
                      onClick={startEditQuestion}
                      disabled={submitting}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn danger"
                      onClick={deleteQuestion}
                      disabled={submitting}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="action-btn"
                      onClick={saveEditQuestion}
                      disabled={submitting}
                    >
                      Save
                    </button>
                    <button
                      className="action-btn"
                      onClick={cancelEditQuestion}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          {!isEditingQuestion ? (
            <>
              <h2 className="question-title">{question?.title}</h2>
              <p className="question-description">{question?.description}</p>
              {question?.tag && (
                <span className="question-tag">{question.tag}</span>
              )}
            </>
          ) : (
            <div className="question-edit-form">
              <input
                type="text"
                value={editQuestionTitle}
                onChange={(e) => setEditQuestionTitle(e.target.value)}
                className="form-input"
                placeholder="Title"
                disabled={submitting}
              />
              <textarea
                value={editQuestionDescription}
                onChange={(e) => setEditQuestionDescription(e.target.value)}
                className="form-textarea"
                rows="6"
                placeholder="Description"
                disabled={submitting}
              />
              <input
                type="text"
                value={editQuestionTag}
                onChange={(e) => setEditQuestionTag(e.target.value)}
                className="form-input"
                placeholder="Tag (optional)"
                disabled={submitting}
              />
            </div>
          )}
        </div>
      </div>

      {/* Answers Section */}
      <div className="answers-section">
        <h2 className="section-title">
          Answers From The Community ({answers.length})
        </h2>

        {answers.length === 0 ? (
          <p className="no-answers">
            No answers yet. Be the first to answer this question!
          </p>
        ) : (
          <div className="answers-list">
            {answers.map((answer) => (
              <div key={answer.answerid} className="answer-card">
                <div className="answer-user-info">
                  <div className="user-avatar">
                    <FaUser />
                  </div>
                  <span className="username">{answer.username}</span>
                  {/* date removed per request */}
                  {userOwnsAnswer(answer) && (
                    <div className="answer-actions">
                      {editingAnswerId !== answer.answerid ? (
                        <>
                          <button
                            className="action-btn"
                            onClick={() => startEditAnswer(answer)}
                            disabled={submitting}
                          >
                            Edit
                          </button>
                          <button
                            className="action-btn danger"
                            onClick={() => deleteAnswer(answer.answerid)}
                            disabled={submitting}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="action-btn"
                            onClick={() => saveEditAnswer(answer.answerid)}
                            disabled={submitting}
                          >
                            Save
                          </button>
                          <button
                            className="action-btn"
                            onClick={cancelEditAnswer}
                            disabled={submitting}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {editingAnswerId === answer.answerid ? (
                  <textarea
                    className="answer-textarea"
                    rows="4"
                    value={editingAnswerText}
                    onChange={(e) => setEditingAnswerText(e.target.value)}
                    disabled={submitting}
                  />
                ) : (
                  <div className="answer-content">
                    <p className="answer-text">{answer.answer}</p>
                    {answer.created_at && (
                      <div className="answer-date">
                        Posted:{" "}
                        {new Date(answer.created_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Answer Form Section */}
      <div className="answer-form-section">
        <h2 className="section-title">Your Answer</h2>

        {error && <div className="error-message">{error}</div>}
        {successMsg && <div className="success-message">{successMsg}</div>}

        <form onSubmit={handleSubmitAnswer} className="answer-form">
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Write your answer here..."
            className="answer-textarea"
            rows="6"
            disabled={submitting}
          />

          <button
            type="submit"
            className="submit-answer-btn"
            disabled={submitting}
          >
            {submitting ? "Posting..." : "Post Answer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Answer;
