"""routes/media.py — REST endpoint for deep media analysis."""
from fastapi import APIRouter, Request
from ..models import MediaPayload
from ..services.media_analyzer import analyze_media
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


from ..services import active_sessions
from google.genai import types

@router.post("/api/analyze-media")
def handle_analyze_media(payload: MediaPayload, request: Request):
    """
    Robust REST endpoint for deep media analysis.
    Delegates to the media_analyzer service and pushes to active session queue.
    """
    client = request.app.state.genai_client
    result = analyze_media(client, payload.data, payload.mime_type)
    
    # Proactively push to the active Clara session if session_id is found
    if result["status"] == "success" and payload.session_id in active_sessions:
        logger.info(f"Pushing analysis for session {payload.session_id} to Clara")
        queue = active_sessions[payload.session_id]
        analysis_text = result["analysis"]
        try:
            queue.send_content(types.Content(
                role="user",
                parts=[types.Part.from_text(text=f"[Real-time Insight]: {analysis_text}\n\nPlease mention these observations to the user if relevant.")]
            ))
        except Exception as e:
            logger.warning(f"Failed to push insight to queue: {e}")
            
    return result
