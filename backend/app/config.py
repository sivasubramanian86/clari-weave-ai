"""
config.py — Centralised environment configuration for the ClariWeave backend.
All other modules import from here instead of reading os.environ directly.
"""
from dotenv import load_dotenv
import os
import logging

load_dotenv()

logger = logging.getLogger(__name__)

# --- API Keys ---
GEMINI_API_KEY: str | None = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    os.environ["GOOGLE_API_KEY"] = GEMINI_API_KEY  # Force ADK/GenAI SDK to see it
    logger.info("GEMINI_API_KEY applied globally as GOOGLE_API_KEY")
else:
    logger.warning("GEMINI_API_KEY NOT FOUND. Application will have limited functionality.")

# --- GCP ---
GCP_PROJECT_ID: str = os.environ.get("GOOGLE_CLOUD_PROJECT", "clariweaveai")

# --- Server ---
PORT: int = int(os.environ.get("PORT", 8082))
HOST: str = os.environ.get("HOST", "0.0.0.0")

# --- Storage ---
LOCAL_SHARDS_FILE: str = "local_session_shards.json"
