"""routes/health.py — Health check and session log retrieval."""
import os
import json
import logging
from fastapi import APIRouter
from ..config import LOCAL_SHARDS_FILE

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/logs")
def get_logs():
    """Returns historical session shards from local_session_shards.json for the Logs view."""
    results = []
    if os.path.exists(LOCAL_SHARDS_FILE):
        try:
            with open(LOCAL_SHARDS_FILE, "r") as f:
                for line in f:
                    line = line.strip()
                    if line:
                        try:
                            results.append(json.loads(line))
                        except Exception:
                            pass
        except Exception as e:
            logger.error(f"Failed to read logs: {e}")
    return results  # Always returns a JSON array
