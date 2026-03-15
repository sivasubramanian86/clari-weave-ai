"""agents/guardian.py — Safety & Compliance sub-agent."""
from google.adk import Agent
from google.genai import types
from .instructions import GUARDIAN_INSTRUCTION
from ..tools import TOOLS

_MODEL = "gemini-2.0-flash"
_CONFIG = types.GenerateContentConfig(response_modalities=[types.Modality.AUDIO])


def get_guardian_agent() -> Agent:
    """Returns a Guardian Agent that enforces PII protection and compliance rules."""
    return Agent(
        name="Guardian",
        model=_MODEL,
        generate_content_config=_CONFIG,
        instruction=GUARDIAN_INSTRUCTION,
        tools=TOOLS,
    )
