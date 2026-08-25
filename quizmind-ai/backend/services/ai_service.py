import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError(
            "GROQ_API_KEY environment variable is missing. "
            "Please add GROQ_API_KEY in your Vercel Dashboard under Project Settings > Environment Variables."
        )
    return Groq(api_key=api_key)

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
Ensure questions are technically accurate, educational, and free of typos.
Return ONLY raw JSON with no extra commentary or conversational text."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a senior Computer Science professor creating rigorous exam questions. You always return valid JSON array only."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=2500
    )

    content = response.choices[0].message.content.strip()
    
    # Strip markdown code blocks if present
    if "```" in content:
        code_blocks = re.findall(r'```(?:json)?(.*?)```', content, flags=re.DOTALL)
        if code_blocks:
            content = code_blocks[0].strip()
        else:
            content = content.replace("```json", "").replace("```", "").strip()

    # Extract JSON array substring if model included leading/trailing text
    start_bracket = content.find("[")
    end_bracket = content.rfind("]")
    if start_bracket != -1 and end_bracket != -1:
        content = content[start_bracket:end_bracket + 1]

    try:
        questions = json.loads(content)
    except json.JSONDecodeError as err:
        raise ValueError(f"Failed to parse AI response into valid JSON: {err}. Raw output: {content[:200]}")

    return questions
