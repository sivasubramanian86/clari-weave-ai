import asyncio
import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

async def test_config(api_version, model_name, use_tools=False):
    print(f"\n--- Testing: {model_name} | API: {api_version} | Tools: {use_tools} ---")
    api_key = os.environ.get("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key, http_options={'api_version': api_version})
    
    config_params = {
        "response_modalities": [types.Modality.AUDIO]
    }
    if use_tools:
        from app.tools import TOOLS
        config_params["tools"] = TOOLS

    config = types.LiveConnectConfig(**config_params)
    
    try:
        # Set a timeout for the test
        async def run_test():
            async with client.aio.live.connect(model=model_name, config=config) as session:
                print("Connection: OPEN")
                # Send a simple text trigger
                await session.send(input="Hello", end_of_turn=True)
                print("Message: SENT")
                
                async for response in session.receive():
                    if response.server_content or response.tool_call:
                        print(f"SUCCESS: Received meaningful response part: {type(response)}")
                        return True
        
        return await asyncio.wait_for(run_test(), timeout=10)
    except asyncio.TimeoutError:
        print("FAILURE: Timed out waiting for response")
    except Exception as e:
        print(f"FAILURE: {e}")
    return False

async def main():
    # Only test the most likely candidates to save time
    models = ['gemini-2.5-flash-native-audio-latest']
    versions = ['v1alpha', 'v1beta']
    
    for m in models:
        for v in versions:
            await test_config(v, m, use_tools=False)
            await test_config(v, m, use_tools=True)

if __name__ == "__main__":
    asyncio.run(main())
