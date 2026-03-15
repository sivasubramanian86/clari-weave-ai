"""
tools.py — Shim for backward compatibility.
Re-exports from the tools package.
"""
from .tools import (
    TOOLS,
    extract_visual_cues,
    save_clarity_map_and_shard,
    extract_session_metrics,
    rag_search_history,
)

__all__ = [
    "TOOLS",
    "extract_visual_cues",
    "save_clarity_map_and_shard",
    "extract_session_metrics",
    "rag_search_history",
]
