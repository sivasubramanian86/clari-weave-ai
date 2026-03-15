"""routes/spa.py — Single Page Application (SPA) fallback route."""
import os
import logging
from fastapi import APIRouter
from fastapi.responses import FileResponse

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/{full_path:path}")
async def serve_spa(full_path: str):
    """
    SPA Fallback: Serve static files from frontend/dist if they exist,
    otherwise fallback to index.html for client-side routing.
    """
    dist_path = os.path.join(os.getcwd(), "frontend", "dist")
    file_path = os.path.join(dist_path, full_path)
    
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    
    index_path = os.path.join(dist_path, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    
    return {"error": "Frontend not built. Please run npm run build."}
