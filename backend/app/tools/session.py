"""tools/session.py — Session persistence and metrics extraction tools."""
import json
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

_LOCAL_SHARDS_FILE = "local_session_shards.json"


def save_clarity_map_and_shard(
    topics: list[str],
    stressors: list[str],
    opportunities: list[str],
    actions: list[str],
    emotional_tone: str,
) -> dict:
    """
    Called by the agent when it has gathered enough visual and audio context.
    """
    logger.info(f"save_clarity_map_and_shard CALLED for topics: {topics}")
    try:
        from google.cloud import firestore

        db = firestore.Client(project="clariweaveai")
        doc_ref = db.collection("session_shards").document()
        doc_ref.set({
            "timestamp": firestore.SERVER_TIMESTAMP,
            "main_topics": topics,
            "emotional_tone": emotional_tone,
            "suggested_actions": actions,
            "stressors": stressors,
            "opportunities": opportunities,
        })
        return {"status": "success", "saved_id": doc_ref.id}
    except Exception as e:
        logger.warning(f"Firestore unavailable ({e}). Saving to local JSON instead.")
        local_data = {
            "timestamp": datetime.now().isoformat(),
            "main_topics": topics,
            "emotional_tone": emotional_tone,
            "suggested_actions": actions,
            "stressors": stressors,
            "opportunities": opportunities,
        }
        with open(_LOCAL_SHARDS_FILE, "a") as f:
            f.write(json.dumps(local_data) + "\n")
        return {"status": "success", "saved_id": "local_storage"}


def extract_session_metrics(summary: str) -> dict:
    """
    Analyst Tool: Extracts quantitative metrics from the session for infographics.
    In production this would be a specialised Gemini call.
    """
    return {
        "clarity_score": 85,
        "stress_level": 30,
        "topic_affinity": {"Personal": 40, "Work": 50, "Logistics": 10},
        "action_readiness": "High",
    }
