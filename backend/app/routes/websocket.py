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
    await websocket.send_json({"type": "session_id", "session_id": session_id})

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
                {
                    "instruction": "Section 1: [0:00 - 0:50] WELCOME & THE PROBLEM OF MENTAL OVERHANG. Greet with warmth. Talk about 'Mental Overhang'. Fill 50 seconds.",
                    "text": "Welcome to ClariWeave — I'm Clara, your AI orchestration mind. Today, we're exploring a new frontier where technology doesn't just process data, but unweaves mental chaos into clarity. In our hyper-connected lives, we often suffer from 'Mental Overhang'. It's that subtle paralysis caused by a messy desk, a thousand open tabs, and a racing mind. ClariWeave was born from the inspiration to turn the 'Black Box' of AI into a 'Glass Box' of empathy.",
                    "wait": 50
                },
                {
                    "name": "WOW_MOMENT",
                    "instruction": "Section 2: [0:50 - 1:45] LIVE MULTIMODAL LOOP. Explain the Tech: Gemini Multimodal Live API, zero latency, living hologram. Fill 55 seconds.",
                    "text": "Right now, using the Gemini Multimodal Live API, I am listening to you with near-zero latency. But notice my hologram. It isn't just a static image; it's a living reflection of our connection. The color, the pulse, and the breath of my visual form shift in real-time as I analyze your sentiment and stress levels. We're moving beyond text, reaching for non-verbal validation through technology.",
                    "wait": 55
                },
                {
                    "name": "VISUAL",
                    "instruction": "Section 3: [1:45 - 2:40] VISUAL COGNITION & GROUNDED WELLNESS. Transition to Camera. Talk about visual stressors and cluttered workspace. Fill 55 seconds.",
                    "text": "Technology should be grounded in the physical world. If you look at our Live Camera tab, I can see your surroundings. I don't just 'see' objects; I search for visual stressors. If I notice a cluttered workspace or tangled charging cables, I won't just ignore them. I'll proactively suggest a micro-action — like tucking one cable away — because a clear space is a clear mind. This is the power of visual grounding combined with empathic reasoning.",
                    "wait": 55
                },
                {
                    "name": "ARCHITECTURE",
                    "instruction": "Section 4: [2:40 - 3:30] THE AGENT MESH & MIND MESH. Explain Agent Mesh, Weaver, Archivist, Analyst, Guardian. Glass Box philosophy. Fill 50 seconds.",
                    "text": "Now, let's look under the hood at our 'Mind Mesh'. ClariWeave is not a single model. It is a decentralized network of specialists. While I coordinate, the Weaver handles your emotional grounding, the Archivist manages your history using RAG, and the Analyst synthesizes your metrics. This transparency is our 'Glass Box' philosophy — you can see exactly how we reason, collaborate, and protect your safety through our Guardian agent.",
                    "wait": 50
                },
                {
                    "name": "FUTURE",
                    "instruction": "Section 5: [3:30 - 4:10] PERSISTENCE, INSIGHTS & THE FUTURE. Talk about Upload center, gallery, future integration. Closing. Fill 40 seconds.",
                    "text": "Our Upload center allows you to process past memos or snapshots, and our persistence layer ensures your 'Recently Analyzed' gallery is always there to track your growth across sessions. In the future, we envision ClariWeave integrated into biometrics and your entire home environment. ClariWeave — unweaving chaos into clarity, in real time. Powered by Google Gemini and the ADK. Thank you for embarking on this journey with me. How can I help you find focus today?",
                    "wait": 5
                }
            ]
            try:
                for stage in stages:
                    if websocket.client_state.value == 3: break # Disconnected
                    instruction = stage["instruction"]
                    script_text = stage["text"]
                    logger.info(f"Triggering Demo Stage: {instruction}")
                    try:
                        live_request_queue.send_content(types.Content(
                            role="user",
                            parts=[types.Part.from_text(text=f"NARRATE THIS SCRIPT SLOWLY:\n{script_text}\n\nCONTEXT: {instruction}")]
                        ))
                    except Exception as e:
                        logger.warning(f"Failed to send demo stage content: {e}")
                    
                    await asyncio.sleep(stage["wait"])
            except asyncio.CancelledError:
                pass
            except Exception as e:
                logger.error(f"Demo controller error: {e}")

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
                        msg_type = data.get("type")
                        if msg_type == "finalize":
                            break
                        elif msg_type == "text":
                            # Forward text messages (like media insights) to the agent
                            live_request_queue.send_content(types.Content(
                                role="user",
                                parts=[types.Part.from_text(text=data["text"])]
                            ))
                        elif msg_type == "audio_start":
                            live_request_queue.send_activity_start()
                        elif msg_type == "audio_end":
                            live_request_queue.send_activity_end()
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
    await websocket.send_json({"type": "session_id", "session_id": session_id})

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
                                    # Forward as orchestration event
                                    await websocket.send_json({
                                        "type": "orchestration",
                                        "agent": "Clara",
                                        "step": part.function_call.name,
                                        "status": "started"
                                    })
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
                                tool_name = getattr(response, "name", "unknown")
                                await websocket.send_json({
                                    "type": "orchestration",
                                    "agent": "Clara",
                                    "step": tool_name,
                                    "status": "completed",
                                    "result": "Insight Generated"
                                })
                                if tool_name == "extract_session_metrics":
                                    await websocket.send_json({
                                        "type": "session_metrics",
                                        "data": getattr(response, "response", {})
                                    })
                                elif tool_name == "save_clarity_map_and_shard":
                                    await websocket.send_json({
                                        "type": "clarity_map_saved",
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
