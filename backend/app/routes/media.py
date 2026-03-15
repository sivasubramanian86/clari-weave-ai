"""routes/media.py — REST endpoint for deep media analysis."""
from fastapi import APIRouter, Request
from ..models import MediaPayload
from ..services.media_analyzer import analyze_media
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/api/analyze-media")
def handle_analyze_media(payload: MediaPayload, request: Request):
    """
    Robust REST endpoint for deep media analysis.
    Delegates to the media_analyzer service.
    """
    client = request.app.state.genai_client
    return analyze_media(client, payload.data, payload.mime_type)
