"""
agent.py — Shim for backward compatibility.
Re-exports from the agents package.
"""
from .agents import get_clariweave_agent

__all__ = ["get_clariweave_agent"]
