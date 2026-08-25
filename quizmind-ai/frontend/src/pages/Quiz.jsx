import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://quiz-mind-ai-project-d651.vercel.app";

function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, difficulty, numQuestions } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (!topic || !difficulty) {
      navigate("/");
      return;
    }
    generateQuiz();
  }, []);

  const generateQuiz = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/quiz/generate`, {
        topic, difficulty, num_questions: numQuestions || 5
      });
      setQuestions(response.data.questions);
    } catch (error) {
      const msg = error.response?.data?.detail || error.message || "Please check backend connection.";
      alert("Error generating quiz: " + msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (label) => {
    if (selectedAnswer) return;
    setSelectedAnswer(label);
    const correct = questions[currentIndex].correct_answer === label;
    setIsCorrect(correct);
    if (correct) setScore(prev => prev + 1);
  };

  const handleBookmark = async () => {
    const q = questions[currentIndex];
    try {
      await axios.post(`${API_BASE_URL}/api/bookmark/save`, {
        question: q.question,
        options: JSON.stringify(q.options),
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        topic
      });
      setBookmarked(true);
    } catch (error) {
      alert("Error saving bookmark!");
    }
  };

  const handleNext = async () => {
    if (currentIndex + 1 >= questions.length) {
      try {
        await axios.post(`${API_BASE_URL}/api/score/save`, {
          topic, difficulty, correct: score, total: questions.length
        });
      } catch (e) {
        console.log("Score save note:", e);
      }
      navigate("/results", { state: { score, total: questions.length, topic, difficulty } });
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setBookmarked(false);
    }
  };

  if (loading) return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      background: "radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 70%, #020617 100%)",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        textAlign: "center",
        background: "rgba(30, 41, 59, 0.6)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "24px",
        padding: "50px 40px"
      }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "15px", animation: "pulse 2s infinite" }}>🤖</div>
        <h2 style={{ color: "#818cf8", fontSize: "1.8rem", fontWeight: "800", marginBottom: "8px" }}>
          AI Generating Questions...
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "1rem" }}>
          Synthesizing real-time {difficulty} questions for <strong>{topic}</strong>
        </p>
      </div>
    </div>
  );

  if (!questions.length) return null;

  const current = questions[currentIndex];

  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      background: "radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 70%, #020617 100%)",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px"
    }}>
      <div style={{ width: "100%", maxWidth: "750px", margin: "0 auto" }}>
        
        {/* Status Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          padding: "12px 20px",
          background: "rgba(30, 41, 59, 0.5)",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.08)"
        }}>
          <span style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
            Topic: <strong style={{ color: "#818cf8" }}>{topic}</strong>
          </span>
          <span style={{ color: "#94a3b8", fontSize: "0.95rem", fontWeight: "bold" }}>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
            Score: <strong style={{ color: "#22c55e" }}>{score}</strong>
          </span>
        </div>

        {/* Question Card */}
        <div style={{
          background: "rgba(30, 41, 59, 0.7)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "20px",
          padding: "35px 30px",
          marginBottom: "20px",
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)"
        }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: "700", lineHeight: "1.6", marginBottom: "25px", color: "#f8fafc" }}>
            {current.question}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {current.options.map(option => (
              <button
                key={option.label}
                onClick={() => handleAnswer(option.label)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  width: "100%",
                  padding: "16px 20px",
                  borderRadius: "14px",
                  border: "2px solid",
                  textAlign: "left",
                  fontSize: "1rem",
                  cursor: selectedAnswer ? "default" : "pointer",
                  borderColor: selectedAnswer
                    ? option.label === current.correct_answer ? "#22c55e"
                    : option.label === selectedAnswer ? "#ef4444" : "rgba(255, 255, 255, 0.1)"
                    : "rgba(255, 255, 255, 0.15)",
                  background: selectedAnswer
                    ? option.label === current.correct_answer ? "rgba(34, 197, 94, 0.2)"
                    : option.label === selectedAnswer ? "rgba(239, 68, 68, 0.2)" : "rgba(15, 23, 42, 0.6)"
                    : "rgba(15, 23, 42, 0.6)",
                  color: "white",
                  transition: "all 0.2s ease"
                }}
              >
                <strong style={{
                  padding: "2px 8px",
                  borderRadius: "6px",
                  background: "rgba(255, 255, 255, 0.1)",
                  fontSize: "0.9rem"
                }}>
                  {option.label}
                </strong>
                <span style={{ lineHeight: "1.4" }}>{option.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Explanation Card */}
        {selectedAnswer && (
          <div style={{
            background: isCorrect ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
            border: `1px solid ${isCorrect ? "#22c55e" : "#ef4444"}`,
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "20px"
          }}>
            <p style={{ color: isCorrect ? "#22c55e" : "#ef4444", fontWeight: "bold", fontSize: "1.1rem", marginBottom: "8px" }}>
              {isCorrect ? "✅ Correct Answer!" : "❌ Incorrect"}
            </p>
            <p style={{ color: "#e2e8f0", fontSize: "0.95rem", lineHeight: "1.5" }}>
              💡 {current.explanation}
            </p>
          </div>
        )}

        {/* Actions Bar */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "space-between" }}>
          <button
            onClick={handleBookmark}
            disabled={bookmarked}
            style={{
              padding: "12px 25px",
              borderRadius: "12px",
              border: "2px solid #6366f1",
              background: bookmarked ? "#6366f1" : "transparent",
              color: "white",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            {bookmarked ? "🔖 Bookmarked!" : "🔖 Bookmark"}
          </button>

          {selectedAnswer && (
            <button
              onClick={handleNext}
              style={{
                padding: "14px 36px",
                borderRadius: "14px",
                border: "none",
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                color: "white",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "800",
                boxShadow: "0 10px 20px -5px rgba(99, 102, 241, 0.5)"
              }}
            >
              {currentIndex + 1 >= questions.length ? "See Results 🏆" : "Next Question →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz;
