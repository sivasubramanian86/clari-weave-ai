"""agents/weaver.py — The Empathic Specialist sub-agent."""
from google.adk import Agent
from google.genai import types
from .instructions import WEAVER_INSTRUCTION
from ..tools import TOOLS

_MODEL = "gemini-2.0-flash"
_CONFIG = types.GenerateContentConfig(response_modalities=[types.Modality.AUDIO])


def get_weaver_agent() -> Agent:
    """Returns an Weaver Agent focused on emotional grounding and micro-actions."""
    return Agent(
        name="Weaver",
        model=_MODEL,
        generate_content_config=_CONFIG,
        instruction=WEAVER_INSTRUCTION,
        tools=TOOLS,
    )
