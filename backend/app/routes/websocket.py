"""routes/websocket.py — Gemini Live Agent WebSocket handler."""
import asyncio
import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from google.genai import types
from google.adk import Runner
from google.adk.agents.live_request_queue import LiveRequestQueue
from google.adk.agents.run_config import RunConfig

from ..agents import get_clariweave_agent, get_demo_agent
from ..services import session_service, active_sessions
from ..config import GEMINI_API_KEY

logger = logging.getLogger(__name__)
router = APIRouter()


@router.websocket("/ws/demo")
async def demo_session(websocket: WebSocket):
    """
    WebSocket endpoint for the Hackathon Demo narration.
    Triggers a proactive intro immediately.
    """
    await websocket.accept()
    logger.info("Demo WebSocket connection established")

    user_id = "demo_user"
    session_id = f"demo_session_{int(asyncio.get_event_loop().time())}"

    try:
        agent = get_demo_agent()
        runner = Runner(app_name="ClariWeaveDemo", agent=agent, session_service=session_service)
        try:
            runner.auto_create_session = True
        except:
            pass

        # Robust session registration
        try:
            await session_service.create_session(
                app_name="ClariWeaveDemo",
                user_id=user_id,
                session_id=session_id
            )
            logger.info(f"Demo Session {session_id} created")
        except Exception as e:
            logger.warning(f"Demo Registration note: {e}")

        live_request_queue = LiveRequestQueue()
        active_sessions[session_id] = live_request_queue
        
        run_config = RunConfig(
            response_modalities=["AUDIO"],
            session_resumption=types.SessionResumptionConfig()
        )

        async def run_adk_loop():
            max_retries = 3
            retry_count = 0
            while retry_count < max_retries:
                try:
                    logger.info(f"Starting Demo ADK run_live (Attempt {retry_count + 1})")
                    async for event in runner.run_live(
                        user_id=user_id,
                        session_id=session_id,
                        live_request_queue=live_request_queue,
                        run_config=run_config
                    ):
                        if event.content and event.content.parts:
                            for part in event.content.parts:
                                if part.inline_data:
                                    await websocket.send_bytes(part.inline_data.data)
                                elif part.text:
                                    await websocket.send_json({"type": "transcript", "text": part.text})
                    break # Loop finished naturally
                except Exception as e:
                    retry_count += 1
                    logger.warning(f"Demo ADK Loop Error (Attempt {retry_count}): {e}")
                    if retry_count >= max_retries:
                        logger.error("Max retries reached for Demo ADK Loop")
                        await websocket.close()
                        break
                    await asyncio.sleep(1) # Small delay before retry

        adk_task = asyncio.create_task(run_adk_loop())

        # Demo Controller: Sends timed prompts to keep narration moving for 4 minutes
        async def demo_controller():
            stages = [
                "Proceed to Section 1: Welcome & Vision. Talk slowly for 60 seconds.",
                "Proceed to Section 2: Live Interaction & Emotion. Talk slowly for 60 seconds.",
                "Proceed to Section 3: Visual Intelligence & Grounded Wellness. Talk slowly for 60 seconds.",
                "Proceed to Section 4: Mind Mesh & system architecture. Talk slowly for 60 seconds.",
                "Final Closure & Vision for the future. You are at minute 4. Wrap up now."
            ]
            for stage_text in stages:
                if websocket.client_state.value == 3: break
                logger.info(f"Triggering Demo Stage: {stage_text}")
                live_request_queue.send_content(types.Content(
                    role="user",
                    parts=[types.Part.from_text(text=stage_text)]
                ))
                await asyncio.sleep(60)

        controller_task = asyncio.create_task(demo_controller())

        while True:
            try:
                message = await websocket.receive()
                if message.get("type") == "websocket.receive":
                    if "bytes" in message:
                        live_request_queue.send_realtime(types.Blob(
                            mime_type="audio/pcm;rate=16000",
                            data=message["bytes"]
                        ))
                    elif "text" in message:
                        data = json.loads(message["text"])
                        if data.get("type") == "finalize": break
                elif message.get("type") == "websocket.disconnect": break
            except Exception:
                break
        
        live_request_queue.close()
        if not adk_task.done(): adk_task.cancel()
        if not controller_task.done(): controller_task.cancel()

    except Exception as e:
        logger.error(f"Demo session error: {e}")
        await websocket.close()


@router.websocket("/ws/session")
async def live_session(websocket: WebSocket):
    """
    WebSocket endpoint for Gemini Live Agent bidirectional streaming.
    Uses the ADK Runner lifecycle.
    """
    await websocket.accept()
    logger.info("WebSocket connection established")

    user_id = "default_user"
    session_id = "default_session"

    try:
        if not GEMINI_API_KEY:
            await websocket.send_json({
                "error": "Gemini API Key not configured. Please set GEMINI_API_KEY in environment."
            })
            await websocket.close()
            return

        # 1. Setup ADK Agent and Runner
        clara_agent = get_clariweave_agent()
        runner = Runner(
            app_name="ClariWeave",
            agent=clara_agent,
            session_service=session_service
        )
        try:
            runner.auto_create_session = True
        except:
            pass

        # Robust session registration
        try:
            await session_service.create_session(
                app_name="ClariWeave",
                user_id=user_id,
                session_id=session_id
            )
            logger.info(f"Session {session_id} created in InMemorySessionService")
        except Exception as e:
            logger.warning(f"Registration note: {e}")

        live_request_queue = LiveRequestQueue()
        active_sessions[session_id] = live_request_queue

        run_config = RunConfig(
            response_modalities=["AUDIO"],
            session_resumption=types.SessionResumptionConfig()
        )

        is_tool_executing = False

        # 2. ADK Event Loop (Downstream: Gemini -> Client)
        async def run_adk_loop():
            nonlocal is_tool_executing
            max_retries = 3
            retry_count = 0
            while retry_count < max_retries:
                try:
                    logger.info(f"Starting ADK run_live (Attempt {retry_count + 1})")
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
                                    logger.debug(f"Sending audio bytes: {len(part.inline_data.data)}")
                                    await websocket.send_bytes(part.inline_data.data)
                                elif part.text:
                                    logger.info(f"Model Transcript: {part.text}")
                                    await websocket.send_json({
                                        "type": "transcript",
                                        "text": part.text
                                    })
                                elif part.function_call:
                                    logger.info(f"Tool Call: {part.function_call.name}")
                                    is_tool_executing = True
                                    if part.function_call.name == "rag_search_history":
                                        await websocket.send_json({
                                            "type": "rag_notification",
                                            "status": "Searching past wisdom..."
                                        })

                        # Handle tool responses
                        function_responses = event.get_function_responses()
                        if function_responses:
                            logger.info(f"Tool Responses: {len(function_responses)}")
                            is_tool_executing = False
                            for response in function_responses:
                                if getattr(response, "name", None) == "extract_session_metrics":
                                    await websocket.send_json({
                                        "type": "session_metrics",
                                        "data": getattr(response, "response", {})
                                    })

                        if event.usage_metadata:
                            logger.info(f"Usage: {event.usage_metadata.total_token_count} tokens")

                    break # Loop finished naturally
                except Exception as e:
                    retry_count += 1
                    logger.warning(f"ADK Loop Error (Attempt {retry_count}): {e}")
                    if retry_count >= max_retries:
                        logger.error("Max retries reached for ADK Loop")
                        await websocket.send_json({"error": f"Internal Loop Error: {str(e)}"})
                        await websocket.close()
                        break
                    await asyncio.sleep(1) # Small delay before retry

        # Start ADK loop as a background task
        adk_task = asyncio.create_task(run_adk_loop())

        # 3. Client Message Loop (Upstream: Client -> Gemini)
        try:
            # Initial Greeting Trigger
            live_request_queue.send_content(types.Content(
                role="user",
                parts=[types.Part.from_text(text="User has joined. Introduce yourself as Clara and ask how you can help.")]
            ))

            while True:
                try:
                    message = await websocket.receive()
                except Exception:
                    break

                if message.get("type") == "websocket.receive":
                    if "bytes" in message:
                        if not is_tool_executing:
                            live_request_queue.send_realtime(types.Blob(
                                mime_type="audio/pcm;rate=16000",
                                data=message["bytes"]
                            ))
                    elif "text" in message:
                        try:
                            data = json.loads(message["text"])
                            msg_type = data.get("type")
                            if msg_type == "finalize":
                                break
                            elif msg_type == "audio_start":
                                live_request_queue.send_activity_start()
                            elif msg_type == "audio_end":
                                live_request_queue.send_activity_end()
                            elif msg_type == "text":
                                live_request_queue.send_content(types.Content(
                                    role="user",
                                    parts=[types.Part.from_text(text=data["text"])]
                                ))
                        except json.JSONDecodeError:
                            live_request_queue.send_content(types.Content(
                                role="user",
                                parts=[types.Part.from_text(text=message["text"])]
                            ))

                elif message.get("type") == "websocket.disconnect":
                    break

        except Exception as client_err:
            logger.error(f"Upstream loop error: {client_err}")
        finally:
            if session_id in active_sessions:
                del active_sessions[session_id]
            live_request_queue.close()
            if not adk_task.done():
                adk_task.cancel()
                try:
                    await adk_task
                except asyncio.CancelledError:
                    pass
            logger.info("Session cleanup complete")

    except Exception as e:
        logger.error(f"Session error: {e}")
        try:
            await websocket.close()
        except:
            pass
