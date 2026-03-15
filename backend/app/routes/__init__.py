"""routes/__init__.py — Aggregate all routers for main.py."""
from fastapi import APIRouter
from .health import router as health_router
from .media import router as media_router
from .websocket import router as ws_router
from .spa import router as spa_router

# Order matters: SPA fallback MUST be last
__all_routers__ = [
    health_router,
    media_router,
    ws_router,
    spa_router
]
