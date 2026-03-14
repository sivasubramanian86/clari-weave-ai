import asyncio
import websockets
import json
import base64
import random

async def simulate_noisy_frontend():
    uri = 'ws://localhost:8080/ws/session'
    try:
        async with websockets.connect(uri) as websocket:
            print('Connected to ws://localhost:8080/ws/session')
            
            async def receive_msgs():
                try:
                    while True:
                        msg = await websocket.recv()
                        if isinstance(msg, bytes):
                            print(f'Received {len(msg)} bytes of audio')
                        else:
                            print(f'Received text: {msg}')
                except Exception as e:
                    print(f'Recv error: {e}')
                    
            recv_task = asyncio.create_task(receive_msgs())
            
            # Send continuous low-volume white noise to simulate room ambiance forever
            print('Streaming endless noisy audio...')
            sample_rate = 16000
            chunk_size = 4096
            
            for _ in range(100):  # send 100 chunks (~25 seconds) of continuous noise
                pcm_data = bytearray()
                for i in range(chunk_size):
                    val = random.randint(-500, 500) # low room noise
                    pcm_data.extend(val.to_bytes(2, byteorder='little', signed=True))
                
                b64 = base64.b64encode(pcm_data).decode('utf-8')
                await websocket.send(json.dumps({'type': 'audio', 'base64': b64}))
                await asyncio.sleep(chunk_size / sample_rate)
            
            print('Finished streaming noise.')
            await websocket.send(json.dumps({'type': 'finalize'}))
            await asyncio.sleep(2)
            recv_task.cancel()
    except Exception as e:
        print(f'Connection failed: {e}')

asyncio.run(simulate_noisy_frontend())
