# ClariWeaveAI

**Unweaving Mental Chaos into Multimodal Clarity.**

ClariWeaveAI is a premium, real-time multimodal mental wellness agent designed to transform overwhelming thoughts and visual clutter into actionable micro-hits of clarity. Guided by **Clara** (powered by **Gemini 2.5 Flash Native Audio**), it orchestrates a specialized mesh of agents to provide a seamless, empathic interaction across voice, image, and text.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Gemini](https://img.shields.io/badge/Built%20with-Gemini%202.0%20Flash-emerald)

## 🌍 Live Deployment

ClariWeave AI is live on Google Cloud Run:
**[View Live App](https://clariweave-agent-1066883661243.us-central1.run.app)**

## 🌟 Key Features

- **Multimodal Uplink**: Simultaneous processing of audio (emotions/transcript) and video/images (visual context).
- **Agent Mesh Architecture**: Modularized backend with specialized agents (Weaver, Guardian, Archivist, Linguist, Analyst) coordinated by Clara.
- **Robust Voice Control**: Advanced "Stop/Shutdown" detection with interim analysis for near-instant response.
- **Media Persistence**: Visual gallery of recent uploads and analysis history.
- **Mind Mesh Visualizer**: Real-time graph showing agent collaboration.

## 📁 Project Structure

```
├── backend/
│   ├── app/
│   │   ├── agents/    # Specialist agent modules (Clara, Weaver, etc.)
│   │   ├── routes/    # Modular API endpoints (WS, Media, Health)
│   │   ├── services/  # Business logic (Media analysis, Sessions)
│   │   ├── tools/     # Multimodal tool definitions (RAG, Visual)
│   │   └── models/    # Pydantic data schemas
│   └── tests/         # Unit and integration tests
├── scripts/           # Debugging & Verification utilities
├── frontend/          # React + Vite application
└── deploy.py          # Google Cloud Deployment automation
```

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation & Running

1. **Setup Environment**:
   Copy `.env.example` to `.env` in the root and add your `GEMINI_API_KEY`.

2. **Run Locally**:
   The easiest way to start both services:
   ```bash
   python start.py
   ```

### 🛠️ Utilities (Verification)
We provide several scripts in `scripts/` to verify your environment and API access:
- `python scripts/verify_models.py`: List all available Gemini models.
- `python scripts/verify_live.py`: Test the Multimodal Live API connection.
- `python scripts/discover_api.py`: Inspect the GenAI SDK capabilities.

## 🧠 The Story behind ClariWeaveAI

### 💡 Inspiration
In an era of hyper-productivity, we often face "Mental Overhang"—the paralysis that comes from an messy desk, a cluttered screen, and a racing mind. We wanted to build more than a chatbot; we wanted a **Grounded Companion** that can see your environment and hear your heart, gently unweaving chaos into clarity.

### 🏗️ How we built it
- **Orchestration**: Built with the **Google ADK**, we created a decentralized "Agent Mesh" where Clara (the Coordinator) delegates specialized tasks to 5 distinct agent personas.
- **Multimodal Grounding**: We use **Gemini 2.5 Flash Native Audio** for near-zero latency vocal comfort, coupled with visual frame analysis to verify the user's physical environment.
- **Reactive UI**: The frontend uses **Framer Motion** and **Tailwind 4** to create a "Living Hologram" that reacts to the user's emotional state in real-time.

### 🚧 Challenges we ran into
- **Audio Precision**: Handling raw Float32 to Int16 PCM conversion in the browser required a custom `AudioWorklet` to satisfy the Live API's strict 16kHz requirement.
- **Asynchronous Harmony**: Orchestrating REST-based image analysis with real-time WebSocket audio without breaking "The Engine" was a significant engineering hurdle we solved using a hybrid threadpool approach.

### 🏆 Accomplishments that we're proud of
- **Emotion-Grounded Hologram**: Creating a visual feedback loop where Clara "breathes" with the user.
- **Mind Mesh Transparency**: Building a visualizer that shows *exactly* how the agents are collaborating, turning the "black box" of AI into a "Glass Box."

### 📖 What we learned
We learned that the future of AI isn't just about answering questions—it's about **Proactive Empathy**. By combining vision and audio, Gemini can detect subtle environmental stressors that a user might not even realize are affecting them.

### 🔮 What's next for ClariWeaveAI
- **Biometric Integration**: Connecting to wearable devices for deeper heart-rate based grounding.
- **Multi-Room Persistence**: Deploying Clara to smart displays to provide a consistent wellness companion throughout the home.

## 🛡️ Security & Architecture
For deep dives into our security protocols and agent orchestration, see:
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [SECURITY.md](SECURITY.md)
- [TECH_STACK.md](TECH_STACK.md)

## 📄 License
MIT License - See [LICENSE](LICENSE) for details.
