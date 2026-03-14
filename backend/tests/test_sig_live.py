from google import genai
from google.genai import types

import inspect
from google.genai.live import AsyncSession

# Confirm live audio API structure
for m in dir(types):
    if 'LiveClientRealtimeInput' in m:
        print(m)
