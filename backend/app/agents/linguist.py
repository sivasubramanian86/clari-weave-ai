"""agents/linguist.py — Multilingual Bridge sub-agent."""
from google.adk import Agent
from google.genai import types
from .instructions import LINGUIST_INSTRUCTION
from ..tools import TOOLS

_MODEL = "gemini-2.0-flash"
_CONFIG = types.GenerateContentConfig(response_modalities=[types.Modality.AUDIO])


def get_linguist_agent() -> Agent:
    """Returns a Linguist Agent for real-time multilingual transcription and translation."""
    return Agent(
        name="Linguist",
        model=_MODEL,
        generate_content_config=_CONFIG,
        instruction=LINGUIST_INSTRUCTION,
        tools=TOOLS,
    )
