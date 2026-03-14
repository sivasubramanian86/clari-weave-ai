from google import genai
from google.genai import types
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

async def test_live_connection():
    api_key = os.environ.get('GEMINI_API_KEY')
    client = genai.Client(api_key=api_key, http_options={'api_version': 'v1alpha'})
    
    config = types.LiveConnectConfig(
        response_modalities=[types.Modality.AUDIO],
        system_instruction=types.Content(parts=[types.Part.from_text(text='You are Clara. Introduce yourself in one short sentence.')]),
    )
    
    try:
        async with client.aio.live.connect(model='models/gemini-2.5-flash-native-audio-preview-12-2025', config=config) as session:
            await session.send(input="Hello", end_of_turn=True)
            has_text = False
            async for resp in session.receive():
                if resp.server_content and resp.server_content.model_turn:
                    for part in resp.server_content.model_turn.parts:
                        if part.text:
                            print(f'Text part received: {part.text}')
                            has_text = True
            if has_text:
                print('SUCCESS: Transcripts are still active.')
            else:
                print('FAILURE: No transcripts received.')
    except Exception as e:
        print(f'Error: {e}')

asyncio.run(test_live_connection())
