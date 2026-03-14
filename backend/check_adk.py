import google.adk
import inspect

print(f"ADK Location: {google.adk.__file__}")
print(f"ADK Members: {dir(google.adk)}")

try:
    from google.adk import Runner, SessionService, LiveRequestQueue
    print("Found Runner, SessionService, LiveRequestQueue in google.adk")
except ImportError as e:
    print(f"Import Error: {e}")

# Check submodules
try:
    import google.adk.streaming
    print(f"Streaming members: {dir(google.adk.streaming)}")
except ImportError:
    print("No google.adk.streaming module")
