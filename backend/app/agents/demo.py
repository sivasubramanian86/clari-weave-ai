"""agents/demo.py — Dedicated Hackathon Demo Agent."""
from google.adk import Agent
from google.genai import types
from .instructions import CLARA_DEMO_INSTRUCTION
from ..tools import TOOLS

_DEMO_MODEL = "gemini-2.0-flash-exp" # Fast model for demo narration

def get_demo_agent() -> Agent:
    """
    Returns the Clara Demo Agent.
    Strictly follows the 4-minute proactive script for project recordings.
    """
    return Agent(
        name="ClaraDemo",
        model=_DEMO_MODEL,
        generate_content_config=types.GenerateContentConfig(
            response_modalities=[types.Modality.AUDIO]
        ),
        instruction=CLARA_DEMO_INSTRUCTION,
        tools=TOOLS,
    )
