import asyncio
import websockets
import json
import base64

async def test_ws():
    uri = 'ws://localhost:8080/ws/session'
    try:
        async with websockets.connect(uri) as websocket:
            print('Connected to ws://localhost:8080/ws/session')
            
            # Start a background task to receive messages
            async def receive_msgs():
                try:
                    while True:
                        msg = await websocket.recv()
                        if isinstance(msg, bytes):
                            print(f'Received {len(msg)} bytes of audio from agent')
                        else:
                            print(f'Received text from agent: {msg}')
                except websockets.ConnectionClosed:
                    print('Connection closed')
                except Exception as e:
                    print(f'Recv error: {e}')
                    
            recv_task = asyncio.create_task(receive_msgs())
            
            # Send 2 seconds of silent audio data (16000 hz * 2 bytes = 32000 bytes/sec)
            print('Sending silent audio chunks...')
            for _ in range(20): # send 20 chunks of 3200 bytes (0.1s each)
                chunk = b'\x00' * 3200
                await websocket.send(chunk)
                await asyncio.sleep(0.1)
            
            print('Waiting for any response...')
            await asyncio.sleep(3)
            
            # Try asking a text question by sending a 'text' message if the protocol allows it,
            # but the frontend only sends text for finalize right now.
            print('Sending finalize...')
            await websocket.send(json.dumps({'type': 'finalize'}))
            
            await asyncio.sleep(2)
            recv_task.cancel()
    except Exception as e:
        print(f'Connection failed: {e}')

asyncio.run(test_ws())
