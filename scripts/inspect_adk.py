from google.adk.sessions.in_memory_session_service import InMemorySessionService
import inspect

service = InMemorySessionService()
print(f"Methods: {dir(service)}")
