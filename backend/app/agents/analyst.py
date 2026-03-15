"""agents/analyst.py — Data Synthesizer sub-agent."""
from google.adk import Agent
from google.genai import types
from .instructions import ANALYST_INSTRUCTION
from ..tools import TOOLS

_MODEL = "gemini-2.0-flash"
_CONFIG = types.GenerateContentConfig(response_modalities=[types.Modality.AUDIO])


def get_analyst_agent() -> Agent:
    """Returns an Analyst Agent that generates quantitative clarity metrics."""
    return Agent(
        name="Analyst",
        model=_MODEL,
        generate_content_config=_CONFIG,
        instruction=ANALYST_INSTRUCTION,
        tools=TOOLS,
    )
