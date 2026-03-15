"""tools/__init__.py — Assembles the TOOLS list consumed by all agents."""
from .visual import extract_visual_cues
from .session import save_clarity_map_and_shard, extract_session_metrics
from .rag import rag_search_history

TOOLS = [
    save_clarity_map_and_shard,
    extract_visual_cues,
    rag_search_history,
    extract_session_metrics,
]

__all__ = [
    "TOOLS",
    "extract_visual_cues",
    "save_clarity_map_and_shard",
    "extract_session_metrics",
    "rag_search_history",
]
