from google.genai import types
from pydantic import BaseModel
from .models import ClarityMap, SessionMemoryShard
from datetime import datetime
import os

def extract_visual_cues(image_base64: str = None) -> dict:
    """
    Extracts visual cues from an uploaded image (e.g., dates, warnings, clutter).
    """
    # In a real implementation, you'd use a Gemini 1.5 Pro call here with the image_base64
    # or use the one stored in session_state if none provided.
    return {
        "text_snippets": ["DUE: Friday 24th", "Final Notice"],
        "objects": ["Stack of envelopes", "Coffee cup"],
        "urgent_flags": True
    }

def save_clarity_map_and_shard(
    topics: list[str], stressors: list[str], opportunities: list[str], actions: list[str], emotional_tone: str
) -> dict:
    """
    Called by the agent when it has gathered enough visual and audio context 
    to create a Clarity Map and suggest next steps.
    """
    try:
        from google.cloud import firestore
        # In a real environment, project ID defaults to environment GOOGLE_CLOUD_PROJECT
        db = firestore.Client(project="clariweaveai")
        doc_ref = db.collection("session_shards").document()
        
        shard_data = {
            "timestamp": firestore.SERVER_TIMESTAMP,
            "main_topics": topics,
            "emotional_tone": emotional_tone,
            "suggested_actions": actions,
            "stressors": stressors,
            "opportunities": opportunities
        }
        
        doc_ref.set(shard_data)
        return {"status": "success", "saved_id": doc_ref.id}
    except Exception as e:
        print(f"Firestore failed or not configured: {e}. Saving to local JSON instead.")
        import json
        local_data = {
            "timestamp": datetime.now().isoformat(),
            "main_topics": topics,
            "emotional_tone": emotional_tone,
            "suggested_actions": actions,
            "stressors": stressors,
            "opportunities": opportunities
        }
        with open("local_session_shards.json", "a") as f:
            f.write(json.dumps(local_data) + "\n")
        return {"status": "success", "saved_id": "local_storage"}

def rag_search_history(query: str) -> list[dict]:
    """
    Archivist Tool: Searches through historical session shards (RAG) to find 
    patterns or recurring themes from past reflections.
    """
    import json
    results = []
    if not os.path.exists("local_session_shards.json"):
        return []
    
    # Simple semantic-ish search (keyword based for MVP, but structured as RAG)
    query_terms = query.lower().split()
    with open("local_session_shards.json", "r") as f:
        for line in f:
            try:
                shard = json.loads(line)
                shard_text = json.dumps(shard).lower()
                if any(term in shard_text for term in query_terms):
                    results.append(shard)
            except: continue
    return results[:3] # Return top 3 relevant context pieces

def extract_session_metrics(summary: str) -> dict:
    """
    Analyst Tool: Extracts quantitative metrics from the session for infographics.
    """
    # In a real app, this might be a specialized LLM call. Here we mock numeric extraction.
    return {
        "clarity_score": 85,
        "stress_level": 30,
        "topic_affinity": {"Personal": 40, "Work": 50, "Logistics": 10},
        "action_readiness": "High"
    }

TOOLS = [save_clarity_map_and_shard, extract_visual_cues, rag_search_history, extract_session_metrics]
