"""agents/archivist.py — Knowledge Custodian / RAG sub-agent."""
from google.adk import Agent
from google.genai import types
from .instructions import ARCHIVIST_INSTRUCTION
from ..tools import TOOLS

_MODEL = "gemini-2.0-flash"
_CONFIG = types.GenerateContentConfig(response_modalities=[types.Modality.AUDIO])


def get_archivist_agent() -> Agent:
    """Returns an Archivist Agent that uses RAG to surface patterns from past sessions."""
    return Agent(
        name="Archivist",
        model=_MODEL,
        generate_content_config=_CONFIG,
        instruction=ARCHIVIST_INSTRUCTION,
        tools=TOOLS,
    )
