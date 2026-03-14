import inspect
from google import genai
from google.genai import types

# To get the signature of send_client_content
client = genai.Client(http_options={'api_version': 'v1alpha'})
# we can't easily get AsyncSession without instantiating, but we can inspect the class if we can find it
from google.genai.live import AsyncSession
print(inspect.signature(AsyncSession.send_client_content))
