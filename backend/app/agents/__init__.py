"""agents/__init__.py — Public API for the agents package."""
from .clara import get_clariweave_agent
from .weaver import get_weaver_agent
from .guardian import get_guardian_agent
from .archivist import get_archivist_agent
from .linguist import get_linguist_agent
from .analyst import get_analyst_agent
from .demo import get_demo_agent

__all__ = [
    "get_clariweave_agent",
    "get_weaver_agent",
    "get_guardian_agent",
    "get_archivist_agent",
    "get_linguist_agent",
    "get_analyst_agent",
    "get_demo_agent",
]
