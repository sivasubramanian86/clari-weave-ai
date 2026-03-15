import google.adk
try:
    import google.adk.sessions as sessions
    print(f"Sessions members: {dir(sessions)}")
except ImportError:
    print("No google.adk.sessions module")

try:
    import google.adk.runners as runners
    print(f"Runners members: {dir(runners)}")
except ImportError:
    print("No google.adk.runners module")

try:
    from google.adk.sessions import SessionService
    print("Found SessionService in google.adk.sessions")
except ImportError:
    print("SessionService NOT in google.adk.sessions")

try:
    from google.adk.runners import LiveRequestQueue
    print("Found LiveRequestQueue in google.adk.runners")
except ImportError:
    print("LiveRequestQueue NOT in google.adk.runners")
