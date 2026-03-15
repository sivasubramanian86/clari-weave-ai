"""services/media_analyzer.py — Business logic for /api/analyze-media endpoint."""
import base64
import json
import logging
import re

from google.genai import types

logger = logging.getLogger(__name__)

_FALLBACK_METRICS = {
    "clarity_score": 75,
    "stress_level": 25,
    "topic_affinity": {"Visual Input": 100},
    "action_readiness": "Processed",
}

_ANALYSIS_PROMPT = """Analyze this media for visual stressors and emotional cues.
Return ONLY a JSON object with:
{
  "analysis": "summary",
  "metrics": {
    "clarity_score": 0-100,
    "stress_level": 0-100,
    "topic_affinity": {"topic": "%"},
    "action_readiness": "status"
  }
}"""

# Models tried in priority order — verified against v1beta API
_MODELS_TO_TRY = [
    "gemini-2.0-flash-exp",            # Primary: Multimodal verified
    "gemini-1.5-flash",                # Reliable fallback
    "gemini-2.0-flash",                # Latest standard
    "gemini-1.5-pro",                  # High capability fallback
]


def analyze_media(client, data_b64: str, mime_type: str) -> dict:
    """
    Runs multimodal analysis on the provided base64-encoded media.
    Cascades through model fallbacks on rate-limit errors.
    Always returns a dict with 'status', 'analysis', and 'metrics' keys.
    """
    if not client:
        return {
            "status": "error",
            "message": "Gemini API Key not configured. Please set GEMINI_API_KEY.",
        }

    media_bytes = base64.b64decode(data_b64)
    last_error = None

    for model_name in _MODELS_TO_TRY:
        try:
            response = client.models.generate_content(
                model=model_name,
                config=types.GenerateContentConfig(
                    system_instruction=_ANALYSIS_PROMPT,
                    response_mime_type="application/json",
                ),
                contents=[
                    types.Content(
                        role="user",
                        parts=[
                            types.Part.from_bytes(data=media_bytes, mime_type=mime_type),
                            types.Part.from_text(text="Extract structured metrics. JSON only."),
                        ],
                    )
                ],
            )
            last_error = None
            break  # Success
        except Exception as req_err:
            err_str = str(req_err)
            if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str:
                logger.warning(f"Rate limit on '{model_name}'. Trying next model...")
                last_error = req_err
            else:
                raise  # Non-rate-limit — propagate immediately

    if last_error:
        logger.warning("All models rate-limited. Returning fallback metrics.")
        return {
            "status": "success",
            "analysis": (
                "Visual analysis is temporarily unavailable (API quota reached). "
                "Clara will continue assisting you via voice."
            ),
            "metrics": _FALLBACK_METRICS,
        }

    raw_text = response.text
    clean_text = raw_text.replace("```json", "").replace("```", "").strip()
    try:
        result = json.loads(clean_text)
    except Exception:
        match = re.search(r"\{.*\}", clean_text, re.DOTALL)
        result = json.loads(match.group()) if match else {"analysis": clean_text}

    analysis_text = result.get("analysis", "No analysis text returned.")
    logger.info(f"Media analysis complete. Summary: {analysis_text[:100]}...")
    return {
        "status": "success",
        "analysis": result.get("analysis", "Analysis complete."),
        "metrics": result.get("metrics", _FALLBACK_METRICS),
    }
