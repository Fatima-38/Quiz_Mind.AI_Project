import { useNavigate } from "react-router-dom";
import { useState } from "react";

const topics = [
  "DSA", "OOP", "DBMS", "Operating System",
  "Computer Networks", "Algorithms", "Software Engineering", "System Design"
];

const difficulties = ["Easy", "Medium", "Hard"];

function Home() {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);

  const handleStart = () => {
    if (!selectedTopic || !selectedDifficulty) {
      alert("Please select a topic and difficulty!");
      return;
    }
    navigate("/quiz", {
      state: { topic: selectedTopic, difficulty: selectedDifficulty, numQuestions }
    });
  };

  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      background: "radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 70%, #020617 100%)",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 20px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "720px",
        margin: "0 auto",
        textAlign: "center",
        background: "rgba(30, 41, 59, 0.6)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "24px",
        padding: "40px 30px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
      }}>
        <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🧠</div>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "900", color: "#818cf8", marginBottom: "8px", letterSpacing: "-0.5px" }}>
          QuizMind AI
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem", marginBottom: "35px" }}>
          Test your Computer Science knowledge with adaptive AI-generated questions!
        </p>

        {/* Select Topic */}
        <div style={{ marginBottom: "30px", textAlign: "left" }}>
          <h3 style={{ fontSize: "0.95rem", color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold", marginBottom: "12px", textAlign: "center" }}>
            Select Topic
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
            {topics.map(topic => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "14px",
                  border: "2px solid",
                  borderColor: selectedTopic === topic ? "#6366f1" : "rgba(255, 255, 255, 0.15)",
                  background: selectedTopic === topic ? "#6366f1" : "rgba(15, 23, 42, 0.7)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: selectedTopic === topic ? "700" : "500",
                  transition: "all 0.2s ease"
                }}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Select Difficulty */}
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ fontSize: "0.95rem", color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold", marginBottom: "12px" }}>
            Select Difficulty
          </h3>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            {difficulties.map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                style={{
                  padding: "10px 28px",
                  borderRadius: "14px",
                  border: "2px solid",
                  borderColor: selectedDifficulty === diff ? "#6366f1" : "rgba(255, 255, 255, 0.15)",
                  background: selectedDifficulty === diff ? "#6366f1" : "rgba(15, 23, 42, 0.7)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: selectedDifficulty === diff ? "700" : "500",
                  transition: "all 0.2s ease"
                }}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Questions */}
        <div style={{ marginBottom: "35px" }}>
          <h3 style={{ fontSize: "0.95rem", color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold", marginBottom: "12px" }}>
            Number of Questions
          </h3>
          <select
            value={numQuestions}
            onChange={e => setNumQuestions(Number(e.target.value))}
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              background: "#0f172a",
              color: "white",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            {[3, 5, 10, 15].map(n => <option key={n} value={n}>{n} Questions</option>)}
          </select>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          style={{
            padding: "16px 60px",
            fontSize: "1.15rem",
            fontWeight: "800",
            borderRadius: "30px",
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            color: "white",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.5)",
            transition: "all 0.2s ease"
          }}
        >
          Start Quiz 🚀
        </button>
      </div>
    </div>
  );
}

export default Home;
