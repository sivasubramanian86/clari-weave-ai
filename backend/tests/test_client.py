import asyncio
import websockets
import json

async def test_ws():
    uri = "ws://localhost:8000/ws/session"
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected to WebSocket")
            # Wait for greeting
            try:
                while True:
                    msg = await asyncio.wait_for(websocket.recv(), timeout=10)
                    if isinstance(msg, str):
                        print(f"Received text: {msg[:100]}...")
                    else:
                        print(f"Received bytes: {len(msg)}")
            except asyncio.TimeoutError:
                print("Timed out waiting for message")
    except Exception as e:
        print(f"Client error: {e}")

if __name__ == "__main__":
    asyncio.run(test_ws())
