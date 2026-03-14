from google import genai
from google.genai import types

print(types.LiveConnectConfig.model_fields['input_audio_transcription'])
print("---")
print(types.LiveConnectConfig.model_fields['output_audio_transcription'])
