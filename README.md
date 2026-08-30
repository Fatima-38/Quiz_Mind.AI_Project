# 🧠 Quiz Mind.AI — Adaptive Learning & Quiz Generation Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Framework-teal.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB.svg)](https://react.dev/)
[![Groq](https://img.shields.io/badge/Groq_API-LPU_Inference-orange.svg)](https://groq.com/)

**Quiz Mind.AI** is an intelligent, AI-powered adaptive learning platform that generates dynamic quizzes, evaluates user comprehension in real-time, and personalizes educational roadmaps using high-speed LLM inference powered by the Groq API and FastAPI.

---

## 📌 Overview

| Attribute | Specification |
|---|---|
| **Domain** | Generative AI, EdTech, Adaptive Learning |
| **Architecture** | React (Frontend SPA) + FastAPI (Backend REST API) + Groq API |
| **LLM Engine** | Groq LPU Inference (Llama 3 / Mixtral models) |
| **Core Features** | Dynamic Quiz Generation, Real-Time Scoring, Difficulty Adaptation, Topic Analytics |

---

## ✨ Key Features

- **Dynamic AI Quiz Generation:** Instantly creates multi-topic, tailored quizzes across varying difficulty levels (Beginner, Intermediate, Advanced) using LLMs.
- **Adaptive Questioning:** Adjusts subsequent question complexity based on user response accuracy and time-on-question.
- **Instant Detailed Feedback:** Provides automated explanations for incorrect options to reinforce learning concepts.
- **Performance Analytics:** Visualizes user progress, topic strengths, and historical mastery scores.

---

## 📂 Project Structure

```
Quiz_Mind.AI_Project/
├── quizmind-ai/            # Main application source code
│   ├── frontend/          # React SPA frontend
│   └── backend/           # FastAPI backend & Groq API service
├── .gitattributes
├── LICENSE                # MIT License
└── README.md              # Documentation
```

---

## 🚀 Setup & Installation

### 1. Clone Repository
```bash
git clone https://github.com/Fatima-38/Quiz_Mind_AI_Project.git
cd Quiz_Mind_AI_Project
```

### 2. Backend Setup
```bash
cd quizmind-ai/backend
pip install -r requirements.txt
# Set your Groq API Key
export GROQ_API_KEY="your-groq-api-key"
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Open browser at `http://localhost:5173`.

---

## 🛠️ Technologies Used

- **Frontend:** React, Tailwind CSS, JavaScript (ES6+)
- **Backend:** Python, FastAPI, Uvicorn, Pydantic
- **AI / LLM:** Groq API (High-speed LPU inference)
- **Data & State:** RESTful API architecture, JSON persistence

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👩‍💻 Author

**Fatima Javaid**  
- **GitHub:** [@Fatima-38](https://github.com/Fatima-38)  
- **Email:** fatimajavaid503@gmail.com  
- **Portfolio:** [fatima-portfolio](https://fatima-38.github.io/fatima-portfolio/)
