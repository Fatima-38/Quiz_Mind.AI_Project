import { useLocation, useNavigate } from "react-router-dom";

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, total, topic, difficulty } = location.state || { score: 0, total: 5, topic: "General", difficulty: "Easy" };
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const getMessage = () => {
    if (percentage >= 80) return { text: "Outstanding Work! 🎉", color: "#22c55e" };
    if (percentage >= 60) return { text: "Good Job! 👍", color: "#f59e0b" };
    return { text: "Keep Practicing! 💪", color: "#ef4444" };
  };

  const message = getMessage();

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
      <div style={{
        width: "100%",
        maxWidth: "550px",
        margin: "0 auto",
        textAlign: "center",
        background: "rgba(30, 41, 59, 0.6)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "24px",
        padding: "45px 35px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
      }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "10px" }}>🏆</div>
        <h2 style={{ fontSize: "2.2rem", fontWeight: "900", color: "#818cf8", marginBottom: "25px" }}>
          Quiz Complete!
        </h2>

        <div style={{
          background: "rgba(15, 23, 42, 0.7)",
          borderRadius: "20px",
          padding: "30px",
          marginBottom: "30px",
          border: "1px solid rgba(255, 255, 255, 0.08)"
        }}>
          <p style={{ color: "#94a3b8", fontSize: "1rem", marginBottom: "6px" }}>
            Topic: <strong style={{ color: "white" }}>{topic}</strong>
          </p>
          <p style={{ color: "#94a3b8", fontSize: "1rem", marginBottom: "25px" }}>
            Difficulty: <strong style={{ color: "white" }}>{difficulty}</strong>
          </p>

          <div style={{ fontSize: "4.5rem", fontWeight: "900", color: message.color, marginBottom: "10px", lineHeight: "1" }}>
            {percentage}%
          </div>

          <p style={{ fontSize: "1.4rem", fontWeight: "700", color: message.color, marginBottom: "20px" }}>
            {message.text}
          </p>

          <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>
            You scored <strong style={{ color: "#22c55e" }}>{score}</strong> out of <strong style={{ color: "white" }}>{total}</strong> correct!
          </p>
        </div>

        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "14px 32px",
              borderRadius: "14px",
              border: "2px solid #6366f1",
              background: "transparent",
              color: "white",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "700"
            }}
          >
            🏠 Home
          </button>

          <button
            onClick={() => navigate("/quiz", { state: { topic, difficulty, numQuestions: total } })}
            style={{
              padding: "14px 32px",
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
            🔄 Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;
