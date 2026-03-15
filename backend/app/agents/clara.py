"""agents/clara.py — Clara: the main Orchestrator Agent that composes all specialist sub-agents."""
from google.adk import Agent
from google.genai import types
from .instructions import COORDINATOR_INSTRUCTION, CLARA_DEMO_INSTRUCTION
from ..tools import TOOLS

_ORCHESTRATOR_MODEL = "gemini-2.5-flash-native-audio-latest"


def get_clariweave_agent() -> Agent:
    """
    Returns the Clara orchestrator Agent.

    Clara is the primary agent the user interacts with. She embodies the
    combined persona of all specialist sub-agents (Weaver, Guardian,
    Archivist, Linguist, Analyst) and coordinates their logic through
    her own unified prompting.
    """
    return Agent(
        name="Clara",
        model=_ORCHESTRATOR_MODEL,
        generate_content_config=types.GenerateContentConfig(
            response_modalities=[types.Modality.AUDIO]
        ),
        instruction=COORDINATOR_INSTRUCTION + CLARA_DEMO_INSTRUCTION,
        tools=TOOLS,
    )
