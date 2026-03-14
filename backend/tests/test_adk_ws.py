import asyncio
import websockets
import json
import base64

async def test_live_agent():
    uri = "ws://localhost:8082/ws/session"
    print(f"Connecting to {uri}...")
    
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected!")
            
            # 1. Wait for greeting or transcript
            async def receive_messages():
                try:
                    while True:
                        msg = await websocket.recv()
                        if isinstance(msg, bytes):
                            print(f"Received audio chunk: {len(msg)} bytes")
                        else:
                            data = json.loads(msg)
                            print(f"Received message: {data}")
                except websockets.ConnectionClosed:
                    print("Connection closed by server.")
            
            receiver = asyncio.create_task(receive_messages())
            
            # 2. Send some silent audio to trigger activity (simulated)
            # 16kHz, 16-bit PCM mono = 32000 bytes per second
            # Send 0.1s chunks (3200 bytes)
            silent_chunk = b'\x00' * 3200
            
            print("Sending simulated audio...")
            for _ in range(5):
                await websocket.send(b'\x00' * 3200) # 0.1s of silence
            
            print("Sending text message...")
            await websocket.send(json.dumps({"type": "text", "text": "Hello Clara, are you there?"}))

            print("Done sending. Waiting for responses...")
                
            # 3. Send a manual activity end signal if supported
            # await websocket.send(json.dumps({"type": "audio_end"}))
            
            await asyncio.sleep(5)
            
            receiver.cancel()
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_live_agent())
