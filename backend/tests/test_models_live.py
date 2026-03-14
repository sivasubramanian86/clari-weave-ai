import asyncio
import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

async def test_model(client, model_id):
    print(f"Testing model: {model_id}...")
    try:
        config = types.LiveConnectConfig(
            response_modalities=[types.Modality.AUDIO]
        )
        async with client.aio.live.connect(model=model_id, config=config) as session:
            print(f"SUCCESS: {model_id} supports bidiGenerateContent")
            return True
    except Exception as e:
        print(f"FAILURE: {model_id} error: {e}")
        return False

async def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key, http_options={'api_version': 'v1alpha'})
    
    # List of models to try
    models_to_try = [
        "gemini-3.1-pro-preview",
        "gemini-2.0-flash",
        "gemini-2.0-flash-exp",
        "gemini-1.5-flash-002",
        "gemini-3.1-flash-lite-preview"
    ]
    
    results = {}
    for m in models_to_try:
        results[m] = await test_model(client, m)
    
    print("\n--- Summary ---")
    for m, res in results.items():
        print(f"{m}: {'SUPPORTED' if res else 'UNSUPPORTED'}")

if __name__ == "__main__":
    asyncio.run(main())
