import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://quiz-mind-ai-project-d651.vercel.app";

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
    generateQuiz();
  }, []);

  const generateQuiz = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/quiz/generate`, {
        topic, difficulty, num_questions: numQuestions
      });
      setQuestions(response.data.questions);
    } catch (error) {
      alert("Error generating quiz! Check backend.");
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
      await axios.post(`${API_BASE_URL}/api/score/save`, {
        topic, difficulty, correct: score, total: questions.length
      });
      navigate("/results", { state: { score, total: questions.length, topic, difficulty } });
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setBookmarked(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ color: "#6366f1" }}>🤖 AI generating questions...</h2>
        <p style={{ color: "#94a3b8" }}>Please wait!</p>
      </div>
    </div>
  );

  if (!questions.length) return null;

  const current = questions[currentIndex];

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "white", padding: "40px 20px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <span style={{ color: "#94a3b8" }}>Topic: <strong style={{ color: "#6366f1" }}>{topic}</strong></span>
          <span style={{ color: "#94a3b8" }}>Question {currentIndex + 1}/{questions.length}</span>
          <span style={{ color: "#94a3b8" }}>Score: <strong style={{ color: "#22c55e" }}>{score}</strong></span>
        </div>

        <div style={{ background: "#1e293b", borderRadius: "15px", padding: "30px", marginBottom: "20px" }}>
          <h2 style={{ marginBottom: "25px", lineHeight: "1.5" }}>{current.question}</h2>

          {current.options.map(option => (
            <button key={option.label} onClick={() => handleAnswer(option.label)}
              style={{
                display: "block", width: "100%", padding: "15px 20px",
                marginBottom: "10px", borderRadius: "10px", border: "2px solid",
                textAlign: "left", cursor: selectedAnswer ? "default" : "pointer",
                borderColor: selectedAnswer
                  ? option.label === current.correct_answer ? "#22c55e"
                  : option.label === selectedAnswer ? "#ef4444" : "#334155"
                  : "#334155",
                background: selectedAnswer
                  ? option.label === current.correct_answer ? "#14532d"
                  : option.label === selectedAnswer ? "#450a0a" : "#0f172a"
                  : "#0f172a",
                color: "white"
              }}>
              <strong>{option.label}.</strong> {option.text}
            </button>
          ))}
        </div>

        {selectedAnswer && (
          <div style={{ background: "#1e293b", borderRadius: "15px", padding: "20px", marginBottom: "20px" }}>
            <p style={{ color: isCorrect ? "#22c55e" : "#ef4444", fontWeight: "bold", marginBottom: "10px" }}>
              {isCorrect ? "✅ Correct!" : "❌ Wrong!"}
            </p>
            <p style={{ color: "#94a3b8" }}>💡 {current.explanation}</p>
          </div>
        )}

        <div style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
          <button onClick={handleBookmark} disabled={bookmarked}
            style={{
              padding: "12px 25px", borderRadius: "10px", border: "2px solid #6366f1",
              background: bookmarked ? "#6366f1" : "transparent", color: "white", cursor: "pointer"
            }}>
            {bookmarked ? "🔖 Bookmarked!" : "🔖 Bookmark"}
          </button>

          {selectedAnswer && (
            <button onClick={handleNext}
              style={{
                padding: "12px 30px", borderRadius: "10px", border: "none",
                background: "#6366f1", color: "white", cursor: "pointer", fontSize: "1rem"
              }}>
              {currentIndex + 1 >= questions.length ? "See Results 🏆" : "Next Question →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz;