"""
Test script to verify the /api/analyze-media endpoint works with each model
using the actual test_media files in the project.

Run from the project root (using backend venv Python):
    backend\\venv\\Scripts\\python.exe backend/tests/test_visual_analysis.py

Make sure GEMINI_API_KEY is set in your .env or environment.
"""
import os
import sys
import json
import time

# Load .env
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("ERROR: GEMINI_API_KEY not set. Add it to your .env file.")
    sys.exit(1)

from google import genai
from google.genai import types

# Initialize client (same config as main.py)
client = genai.Client(api_key=API_KEY, http_options={'api_version': 'v1beta'})

# Models to test (priority order used in main.py)
MODELS = [
    "gemini-3.1-flash-image-preview",  # Gemini 3.1 multimodal (user's preferred)
    "gemini-2.5-flash",                # Stable Gemini 2.5 flash
    "gemini-2.5-flash-lite",           # Lighter Gemini 2.5
    "gemini-2.0-flash",                # Legacy fallback
]

SYSTEM_PROMPT = """Analyze this media for visual stressors and emotional cues. 
Return ONLY a JSON object with:
{
  "analysis": "summary",
  "metrics": {
    "clarity_score": 0-100,
    "stress_level": 0-100,
    "topic_affinity": {"topic": 50},
    "action_readiness": "status"
  }
}"""

# Test files relative to project root
TEST_FILES = [
    ("test_media/messy_desk.png", "image/png"),
]

def test_model_with_file(model_name: str, file_path: str, mime_type: str) -> dict:
    with open(file_path, "rb") as f:
        media_bytes = f.read()

    start = time.time()
    response = client.models.generate_content(
        model=model_name,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            response_mime_type="application/json"
        ),
        contents=[
            types.Content(
                role="user",
                parts=[
                    types.Part.from_bytes(data=media_bytes, mime_type=mime_type),
                    types.Part.from_text(text="Extract structured metrics. JSON only.")
                ]
            )
        ]
    )
    elapsed = time.time() - start
    return {"response": response.text, "time_s": round(elapsed, 2)}


def run_tests():
    # Force UTF-8 output
    sys.stdout.reconfigure(encoding='utf-8') if hasattr(sys.stdout, 'reconfigure') else None

    print("=" * 60)
    print("ClariWeave Visual Analysis Model Test")
    print("=" * 60)
    print()

    results = {}

    for file_path, mime_type in TEST_FILES:
        abs_path = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', '..', file_path))

        if not os.path.exists(abs_path):
            print(f"[SKIP] File not found: {abs_path}")
            continue

        print(f"[FILE] {file_path} ({mime_type})")
        print("-" * 60)

        for model in MODELS:
            print(f"  [TRY] {model} ...", end="", flush=True)
            try:
                result = test_model_with_file(model, abs_path, mime_type)
                try:
                    parsed = json.loads(result["response"])
                    metrics = parsed.get("metrics", {})
                    analysis = parsed.get("analysis", "")[:80]
                    print(f" PASS ({result['time_s']}s)")
                    print(f"       Analysis  : {analysis}...")
                    print(f"       Clarity   : {metrics.get('clarity_score')} | Stress: {metrics.get('stress_level')} | Readiness: {metrics.get('action_readiness')}")
                except json.JSONDecodeError:
                    print(f" PASS BUT INVALID JSON. Raw: {result['response'][:80]}")
                results[model] = "PASS"
            except Exception as e:
                err = str(e)
                if '429' in err or 'RESOURCE_EXHAUSTED' in err:
                    print(f" RATE LIMITED (quota exceeded for this model)")
                    results[model] = "RATE_LIMITED"
                elif '404' in err or 'NOT_FOUND' in err:
                    print(f" NOT FOUND (model unavailable in v1beta API)")
                    results[model] = "NOT_FOUND"
                else:
                    short_err = err[:100].replace('\n', ' ')
                    print(f" ERROR: {short_err}")
                    results[model] = f"ERROR"
            print()

    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)
    for model, status in results.items():
        print(f"  [{status}]  {model}")
    print()
    
    if any(v == "PASS" for v in results.values()):
        first_pass = next(m for m, v in results.items() if v == "PASS")
        print(f"RECOMMENDATION: Use '{first_pass}' as primary model in main.py")
    else:
        print("WARNING: No models passed! Check API key and quota.")


if __name__ == "__main__":
    run_tests()
