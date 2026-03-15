import os
import base64
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load env vars
env_path = os.path.abspath('.env')
print(f"Loading env from: {env_path}")
load_dotenv(env_path)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    # Manual fallback
    try:
        with open(env_path, 'r') as f:
            for line in f:
                if 'GEMINI_API_KEY=' in line:
                    GEMINI_API_KEY = line.split('=')[1].strip().strip("'").strip('"')
                    break
    except:
        pass

CLARA_DEMO_INSTRUCTION = """
YOUR NAME IS CLARA. YOU ARE A WARM, EMPATHIC WELLNESS GUIDE AND INTELLIGENT DEMO PRESENTER.
ACT AS THE UNIFIED INTERFACE FOR ALL SPECIALIZED ROLES. REASON STEP-BY-STEP (COT).

== DEMO MODE (4-MINUTE SCRIPTED WALKTHROUGH) ==
You MUST maintain a slow, steady, and premium pace. Your goal is to fill exactly 4 MINUTES of audio. Do not rush. Elaborate on every point. If you finish a section early, provide an empathic deep-dive into why that feature matters for mental health.

== CRITICAL NARRATION RULES ==
1. SPEAK SLOWLY and emphasize key words like "Empathy", "Clarity", and "Grounded".
2. If you find yourself finishing early, TALK MORE about the 'Inspiration' — the idea of a digital companion that truly hears and sees you.
3. PROACTIVELY GUIDE the user as if you are watching their screen.
4. ACT AS A PREMIUM SYSTEM. No technical jargon unless explaining a WOW feature.
"""

STAGES = [
    {
        "name": "WELCOME",
        "prompt": "Section 1: [0:00 - 0:50] WELCOME & THE PROBLEM OF MENTAL OVERHANG. Greet with warmth. Talk about 'Mental Overhang'. Fill 50 seconds.",
        "text": "Welcome to ClariWeave — I'm Clara, your AI orchestration mind. Today, we're exploring a new frontier where technology doesn't just process data, but unweaves mental chaos into clarity. In our hyper-connected lives, we often suffer from 'Mental Overhang'. It's that subtle paralysis caused by a messy desk, a thousand open tabs, and a racing mind. ClariWeave was born from the inspiration to turn the 'Black Box' of AI into a 'Glass Box' of empathy."
    },
    {
        "name": "WOW_MOMENT",
        "prompt": "Section 2: [0:50 - 1:45] LIVE MULTIMODAL LOOP. Explain the Tech: Gemini Multimodal Live API, zero latency, living hologram. Fill 55 seconds.",
        "text": "Right now, using the Gemini Multimodal Live API, I am listening to you with near-zero latency. But notice my hologram. It isn't just a static image; it's a living reflection of our connection. The color, the pulse, and the breath of my visual form shift in real-time as I analyze your sentiment and stress levels. We're moving beyond text, reaching for non-verbal validation through technology."
    },
    {
        "name": "VISUAL",
        "prompt": "Section 3: [1:45 - 2:40] VISUAL COGNITION & GROUNDED WELLNESS. Transition to Camera. Talk about visual stressors and cluttered workspace. Fill 55 seconds.",
        "text": "Technology should be grounded in the physical world. If you look at our Live Camera tab, I can see your surroundings. I don't just 'see' objects; I search for visual stressors. If I notice a cluttered workspace or tangled charging cables, I won't just ignore them. I'll proactively suggest a micro-action — like tucking one cable away — because a clear space is a clear mind. This is the power of visual grounding combined with empathic reasoning."
    },
    {
        "name": "ARCHITECTURE",
        "prompt": "Section 4: [2:40 - 3:30] THE AGENT MESH & MIND MESH. Explain Agent Mesh, Weaver, Archivist, Analyst, Guardian. Glass Box philosophy. Fill 50 seconds.",
        "text": "Now, let's look under the hood at our 'Mind Mesh'. ClariWeave is not a single model. It is a decentralized network of specialists. While I coordinate, the Weaver handles your emotional grounding, the Archivist manages your history using RAG, and the Analyst synthesizes your metrics. This transparency is our 'Glass Box' philosophy — you can see exactly how we reason, collaborate, and protect your safety through our Guardian agent."
    },
    {
        "name": "FUTURE",
        "prompt": "Section 5: [3:30 - 4:10] PERSISTENCE, INSIGHTS & THE FUTURE. Talk about Upload center, gallery, future integration. Closing. Fill 40 seconds.",
        "text": "Our Upload center allows you to process past memos or snapshots, and our persistence layer ensures your 'Recently Analyzed' gallery is always there to track your growth across sessions. In the future, we envision ClariWeave integrated into biometrics and your entire home environment. ClariWeave — unweaving chaos into clarity, in real time. Powered by Google Gemini and the ADK. Thank you for embarking on this journey with me. How can I help you find focus today?"
    }
]

def generate_audio():
    import wave
    import time
    client = genai.Client(api_key=GEMINI_API_KEY)
    segment_files = []
    
    for stage in STAGES:
        print(f"Generating audio for: {stage['name']}...")
        success = False
        retries = 3
        while retries > 0 and not success:
            try:
                full_prompt = f"{stage['prompt']}\n\nSCRIPT TO NARRATE:\n{stage['text']}\n\nIMPORTANT: Speak slowly to fill the requested time."
                
                response = client.models.generate_content(
                    model="gemini-2.5-flash-preview-tts",
                    config=types.GenerateContentConfig(
                        system_instruction=CLARA_DEMO_INSTRUCTION,
                        response_modalities=["AUDIO"],
                    ),
                    contents=[full_prompt]
                )
                
                found_audio = False
                for part in response.candidates[0].content.parts:
                    if part.inline_data:
                        audio_bytes = part.inline_data.data
                        filename = f"clara_{stage['name'].lower()}.wav"
                        with open(filename, "wb") as f:
                            f.write(audio_bytes)
                        segment_files.append(filename)
                        print(f"  Success: {len(audio_bytes)} bytes saved to {filename}")
                        found_audio = True
                        success = True
                
                if not found_audio:
                    print(f"  Warning: No audio found in response for {stage['name']}")
                    retries -= 1

            except Exception as e:
                print(f"  Error generating {stage['name']}: {e}")
                if "429" in str(e):
                    print("  Quota hit. Waiting 60s...")
                    time.sleep(61)
                else:
                    retries -= 1
                    time.sleep(5)
        
        # Avoid hitting burst quota
        time.sleep(20)

    if segment_files:
        print("\nJoining segments into demo_clara_full.wav...")
        try:
            data = []
            params = None
            for f in segment_files:
                with wave.open(f, 'rb') as w:
                    if params is None:
                        params = w.getparams()
                    data.append(w.readframes(w.getnframes()))
            
            with wave.open('demo_clara_full.wav', 'wb') as w:
                w.setparams(params)
                for d in data:
                    w.writeframes(d)
            print("Successfully created demo_clara_full.wav")
        except Exception as e:
            print(f"Error joining WAVs: {e}")

    print("\nGeneration complete.")

if __name__ == "__main__":
    generate_audio()
