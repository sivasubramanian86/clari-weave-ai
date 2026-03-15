"""tools/rag.py — RAG history search tool used by the Archivist agent."""
import json
import os
import logging

logger = logging.getLogger(__name__)

_LOCAL_SHARDS_FILE = "local_session_shards.json"


def rag_search_history(query: str) -> list[dict]:
    """
    Archivist Tool: Searches through historical session shards (RAG) to find
    patterns or recurring themes from past reflections.
    Uses simple keyword search for MVP — structured as RAG for future embedding upgrade.
    """
    if not os.path.exists(_LOCAL_SHARDS_FILE):
        return []

    results = []
    query_terms = query.lower().split()
    try:
        with open(_LOCAL_SHARDS_FILE, "r") as f:
            for line in f:
                try:
                    shard = json.loads(line)
                    shard_text = json.dumps(shard).lower()
                    if any(term in shard_text for term in query_terms):
                        results.append(shard)
                except Exception:
                    continue
    except Exception as e:
        logger.error(f"RAG search failed: {e}")

    return results[:3]  # Return top 3 relevant context pieces
