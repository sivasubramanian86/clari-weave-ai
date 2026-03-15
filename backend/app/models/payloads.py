"""models/payloads.py — FastAPI request/response payload schemas."""
from pydantic import BaseModel


class MediaPayload(BaseModel):
    data: str          # Base64-encoded media bytes
    mime_type: str
    session_id: str = "default_session"
