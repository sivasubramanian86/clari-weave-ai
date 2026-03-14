import asyncio
import os
import json
import logging
import uuid
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from google.genai import types
from google import genai
from dotenv import load_dotenv

from .agent import get_clariweave_agent
from .tools import TOOLS

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ADK Imports
from google.adk import Runner
from google.adk.agents.live_request_queue import LiveRequestQueue
from google.adk.agents.run_config import RunConfig
from google.adk.sessions.in_memory_session_service import InMemorySessionService

# Initialize global ADK components
API_KEY = os.environ.get("GEMINI_API_KEY")
if API_KEY:
    os.environ["GOOGLE_API_KEY"] = API_KEY  # Ensure ADK/GenAI SDK finds it
    logger.info("GEMINI_API_KEY mirrored to GOOGLE_API_KEY for ADK compatibility")

client = genai.Client(api_key=API_KEY, http_options={'api_version': 'v1alpha'})
session_service = InMemorySessionService()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.websocket("/ws/session")
async def live_session(websocket: WebSocket):
    """
    WebSocket endpoint for Gemini Live Agent bidirectional streaming.
    Uses the ADK Runner lifecycle.
    """
    await websocket.accept()
    logger.info("WebSocket connection established")

    user_id = "default_user"
    session_id = str(uuid.uuid4())
    
    try:
        # 1. Setup ADK Agent and Runner
        clara_agent = get_clariweave_agent()
        runner = Runner(
            app_name="ClariWeave", 
            agent=clara_agent, 
            session_service=session_service,
            auto_create_session=True
        )
        live_request_queue = LiveRequestQueue()
        
        run_config = RunConfig(
            response_modalities=["AUDIO"],
            input_audio_transcription=types.AudioTranscriptionConfig(),
            output_audio_transcription=types.AudioTranscriptionConfig()
        )

        is_tool_executing = False

        # 2. ADK Event Loop (Downstream: Gemini -> Client)
        async def run_adk_loop():
            nonlocal is_tool_executing
            logger.info(f"Starting ADK run_live for session {session_id}")
            try:
                async for event in runner.run_live(
                    user_id=user_id,
                    session_id=session_id,
                    live_request_queue=live_request_queue,
                    run_config=run_config
                ):
                    logger.debug(f"ADK Event received: {event}")
                    
                    # Handle audio data
                    if event.content and event.content.parts:
                        for part in event.content.parts:
                            if part.inline_data:
                                logger.debug(f"Sending audio bytes to client: {len(part.inline_data.data)}")
                                await websocket.send_bytes(part.inline_data.data)
                            elif part.text:
                                logger.info(f"Model Transcript: {part.text}")
                                await websocket.send_json({
                                    "type": "transcript",
                                    "text": part.text
                                })
                            elif part.function_call:
                                logger.info(f"Tool Call Detected: {part.function_call.name}")
                                is_tool_executing = True
                                if part.function_call.name == "rag_search_history":
                                    await websocket.send_json({"type": "rag_notification", "status": "Searching past wisdom..."})

                    # Handle tool responses (Tool Gate unlock)
                    if event.get_function_responses():
                        logger.info(f"Tool Responses detected: {len(event.get_function_responses())}")
                        is_tool_executing = False

                    if event.usage_metadata:
                         logger.info(f"Session Usage: {event.usage_metadata.total_token_count} tokens")
                
                logger.warning("ADK run_live loop finished naturally")

            except Exception as e:
                logger.error(f"ADK Loop EXCEPTION: {e}", exc_info=True)
                await websocket.send_json({"error": f"Internal Loop Error: {str(e)}"})
                await websocket.close()
            finally:
                logger.info("ADK Loop Task finishing")

        # Start ADK loop as a background task
        logger.info("Spawning ADK loop task")
        adk_task = asyncio.create_task(run_adk_loop())

        # 3. Client Message Loop (Upstream: Client -> Gemini)
        try:
            # Initial Greeting Trigger restored to prompt the agent to speak first
            logger.info("Sending initial greeting content to LiveRequestQueue")
            live_request_queue.send_content(types.Content(
                role="user",
                parts=[types.Part.from_text(text="User has joined. Introduce yourself as Clara and ask how you can help.")]
            ))

            while True:
                try:
                    message = await websocket.receive()
                except Exception as ws_err:
                    logger.warning(f"WebSocket receive error: {ws_err}")
                    break
                
                if message.get("type") == "websocket.receive":
                    if "bytes" in message:
                        # AUDIO UPSTREAM (Tool Gate)
                        if not is_tool_executing:
                            audio_data = message["bytes"]
                            live_request_queue.send_realtime(types.Blob(
                                mime_type="audio/pcm;rate=16000",
                                data=audio_data
                            ))
                        else:
                            # Drop audio but log if it happens too much
                            pass
                    elif "text" in message:
                        try:
                            data = json.loads(message["text"])
                            msg_type = data.get("type")
                            logger.info(f"Control message from client: {msg_type}")
                            
                            if msg_type == "finalize":
                                logger.info("Client requested session finalization")
                                break
                            elif msg_type == "audio_start":
                                live_request_queue.send_activity_start()
                            elif msg_type == "audio_end":
                                live_request_queue.send_activity_end()
                            elif msg_type == "text":
                                logger.info(f"Text message from client: {data.get('text', '')[:50]}...")
                                live_request_queue.send_content(types.Content(
                                    role="user",
                                    parts=[types.Part.from_text(text=data["text"])]
                                ))
                            
                        except json.JSONDecodeError:
                            logger.info(f"Raw unparsed text message from client: {message['text'][:50]}...")
                            live_request_queue.send_content(types.Content(
                                role="user",
                                parts=[types.Part.from_text(text=message["text"])]
                            ))
                
                elif message.get("type") == "websocket.disconnect":
                    logger.info(f"WebSocket disconnect received (code: {message.get('code')})")
                    break

        except Exception as client_err:
            logger.error(f"Upstream loop error: {client_err}", exc_info=True)
        finally:
            logger.info("Cleaning up WebSocket session...")
            live_request_queue.close()
            if not adk_task.done():
                adk_task.cancel()
                try:
                    await adk_task
                except asyncio.CancelledError:
                    pass
            logger.info("Session cleanup complete")

    except Exception as e:
        logger.error(f"Session error: {e}", exc_info=True)
        try:
            await websocket.send_json({"error": str(e)})
            await websocket.close()
        except:
            pass

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8082))
    logger.info(f"Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
