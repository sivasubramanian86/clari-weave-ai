import os
import asyncio
import inspect
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

async def discover_api():
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"), http_options={'api_version': 'v1alpha'})
    model_id = "models/gemini-2.5-flash-native-audio-latest"
    
    config = types.LiveConnectConfig(
        response_modalities=[types.Modality.AUDIO]
    )
    
    print(f"DEBUG: Attempting discovery with {model_id}...")
    try:
        async with client.aio.live.connect(model=model_id, config=config) as session:
            print(f"DEBUG: Session object: {session}")
            
            method = session.send_realtime_input
            print(f"DEBUG: send_realtime_input signature: {inspect.signature(method)}")
            
            # Also check send_client_content
            print(f"DEBUG: send_client_content signature: {inspect.signature(session.send_client_content)}")
            
    except Exception as e:
        print(f"DEBUG: Discovery FAILED: {e}")

if __name__ == "__main__":
    asyncio.run(discover_api())
