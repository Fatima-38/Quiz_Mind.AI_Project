import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

CANDIDATE_MODELS = [
    "qwen/qwen3.6-27b",
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "groq/compound-mini"
]

def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError(
            "GROQ_API_KEY is not set. Please add GROQ_API_KEY in your Vercel Dashboard under Project Settings > Environment Variables."
        )
    return Groq(api_key=api_key)

def clean_json_response(raw_text: str):
    # Strip <think>...</think> chain-of-thought tags
    cleaned = re.sub(r'<think>.*?</think>', '', raw_text, flags=re.DOTALL).strip()
    
    # Strip markdown code fences ```json ... ```
    if "```" in cleaned:
        code_blocks = re.findall(r'```(?:json)?(.*?)```', cleaned, flags=re.DOTALL)
        if code_blocks:
            cleaned = code_blocks[0].strip()
        else:
            cleaned = cleaned.replace("```json", "").replace("```", "").strip()

    # Locate the outer JSON array brackets [ ... ]
    start_bracket = cleaned.find("[")
    end_bracket = cleaned.rfind("]")
    if start_bracket != -1 and end_bracket != -1:
        cleaned = cleaned[start_bracket:end_bracket + 1]

    return cleaned

def generate_questions(topic: str, difficulty: str, num_questions: int):
    client = get_groq_client()
    
    prompt = f"""Generate {num_questions} multiple choice questions about {topic} at {difficulty} difficulty level.

Return ONLY a valid JSON array matching this exact format:
[
  {{
    "question": "Question text here?",
    "options": [
      {{"label": "A", "text": "Option A text"}},
      {{"label": "B", "text": "Option B text"}},
      {{"label": "C", "text": "Option C text"}},
      {{"label": "D", "text": "Option D text"}}
    ],
    "correct_answer": "A",
    "explanation": "Brief explanation why A is correct"
  }}
]

Topics can include: DSA, OOP, DBMS, OS, Computer Networks, Algorithms, Software Engineering, System Design.
Ensure questions are technically accurate and educational.
Do NOT include any conversational text before or after the JSON. Return only the JSON array."""

    last_error = None

    for model_name in CANDIDATE_MODELS:
        try:
            response = client.chat.completions.create(
                model=model_name,
                messages=[
                    {"role": "system", "content": "You are an expert CS professor. Always output ONLY a raw JSON array matching the requested schema without markdown fences or pleasantries."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.6,
                max_tokens=2500
            )

            raw_content = response.choices[0].message.content or ""
            cleaned = clean_json_response(raw_content)
            questions = json.loads(cleaned)
            if isinstance(questions, list) and len(questions) > 0:
                return questions
        except Exception as e:
            last_error = e
            continue

    raise ValueError(f"Failed to generate questions across available AI models. Detail: {last_error}")
