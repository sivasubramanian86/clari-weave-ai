import asyncio
import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

async def test_model(client, model_id):
    try:
        config = types.LiveConnectConfig(
            response_modalities=[types.Modality.AUDIO]
        )
        # using asyncio.wait_for for Python 3.10 compatibility
        async with client.aio.live.connect(model=model_id, config=config) as session:
            await session.send(input="test", end_of_turn=True)
            return True
    except Exception as e:
        if "1008" in str(e) or "not found" in str(e):
            return False
        # If it's a timeout or something else, it might be supported but slow
        if "TimeoutError" in str(type(e)):
             return True 
        return False

async def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("GEMINI_API_KEY not found")
        return

    # Try different API versions
    api_versions = ['v1alpha'] # Live API is typically v1alpha
    
    models_to_try = [
        "gemini-2.5-flash-native-audio-latest",
        "gemini-2.5-flash-native-audio-preview-12-2025",
        "gemini-3.1-pro-preview",
        "gemini-2.0-flash"
    ]
    
    for ver in api_versions:
        print(f"\n--- Testing API Version: {ver} ---")
        client = genai.Client(api_key=api_key, http_options={'api_version': ver})
        for m in models_to_try:
            try:
                res = await asyncio.wait_for(test_model(client, m), timeout=5.0)
                if res:
                    print(f" [OK] {m}")
                else:
                    print(f" [FAIL] {m}")
            except Exception as e:
                print(f" [ERR] {m}: {e}")

if __name__ == "__main__":
    asyncio.run(main())
