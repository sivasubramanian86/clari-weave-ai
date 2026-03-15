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
async def handle_analyze_media(payload: MediaPayload, request: Request):
    """
    Robust REST endpoint for deep media analysis.
    Delegates to the media_analyzer service and pushes to active session queue.
    """
    client = request.app.state.genai_client
    # analyze_media is sync, so we run it as is or in a threadpool if needed.
    # For now, it's fine as it's a shell for a GenAI call.
    result = analyze_media(client, payload.data, payload.mime_type)
    
    # Proactively push to the active Clara session if session_id is found
    if result["status"] == "success" and payload.session_id in active_sessions:
        logger.info(f"Pushing analysis for session {payload.session_id} to Clara")
        queue = active_sessions[payload.session_id]
        analysis_text = result["analysis"]
        try:
            # Assuming LiveRequestQueue follows a queue interface
            # We wrap the content in a way the agent can consume it
            content = types.Content(
                role="user",
                parts=[types.Part.from_text(text=f"[Media Analysis Insight]: {analysis_text}")]
            )
            # Try put first; if it's an ADK specific method we might need to adjust
            if hasattr(queue, 'put'):
                await queue.put(content)
            elif hasattr(queue, 'enqueue'):
                queue.enqueue(content)
            else:
                logger.warning(f"Queue {type(queue)} has no known put/enqueue method")
        except Exception as e:
            logger.error(f"Failed to push insight to queue for session {payload.session_id}: {e}")
            # Don't fail the whole request if queue-push fails
            
    return result
