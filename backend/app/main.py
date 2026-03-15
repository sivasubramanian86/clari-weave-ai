"""
ClariWeave AI Backend — Entry Point
Modularized and Refactored for Maintenance.
"""
import logging
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from google import genai

from .config import GEMINI_API_KEY, PORT, HOST
from .routes import __all_routers__

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="ClariWeave AI")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global GenAI Client Initialization
if GEMINI_API_KEY:
    try:
        # Store in app state so routers can access it
        app.state.genai_client = genai.Client(
            api_key=GEMINI_API_KEY, 
            http_options={'api_version': 'v1beta'}
        )
        logger.info("GenAI Client (v1beta) initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize GenAI Client: {e}")
        app.state.genai_client = None
else:
    logger.warning("GEMINI_API_KEY not found in environment.")
    app.state.genai_client = None

# Static Files Mounting
frontend_path = os.path.join(os.getcwd(), "frontend", "dist")
if os.path.exists(frontend_path):
    assets_path = os.path.join(frontend_path, "assets")
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="static")
        logger.info(f"Mounted static assets from {assets_path}")

# Register Modular Routers
for router in __all_routers__:
    app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    logger.info(f"Starting ClariWeave AI Backend on {HOST}:{PORT}")
    uvicorn.run(app, host=HOST, port=PORT)
