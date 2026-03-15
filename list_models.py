import os
from google import genai
from dotenv import load_dotenv

load_dotenv('.env')
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

client = genai.Client(api_key=GEMINI_API_KEY)
for m in client.models.list():
    print(m)
