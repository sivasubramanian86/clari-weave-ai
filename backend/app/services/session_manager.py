"""services/session_manager.py — Shared ADK session service and active-session registry."""
from google.adk.sessions import InMemorySessionService

# Shared ADK session service (singleton for the process lifetime)
session_service = InMemorySessionService()

# Maps session_id -> LiveRequestQueue for in-flight WebSocket sessions
active_sessions: dict = {}
