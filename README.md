# ClariWeaveAI

**Unweaving Mental Chaos into Multimodal Clarity.**

ClariWeaveAI is a premium, real-time multimodal mental wellness agent designed to transform overwhelming thoughts and visual clutter into actionable micro-hits of clarity. Guided by **Clara** (powered by **Gemini 2.5 Flash Native Audio**), it orchestrates a specialized mesh of agents (The Linguist, The Weaver, The Archivist, The Analyst, and The Guardian) to provide a seamless, empathic interaction across voice, image, and text.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Gemini](https://img.shields.io/badge/Built%20with-Gemini%203.1-emerald)

## 🌍 Live Deployment

ClariWeave AI is live on Google Cloud Run:
**[View Live App](https://clariweave-agent-1066883661243.us-central1.run.app)**

*Note: The live version requires a dedicated GEMINI_API_KEY. See the [Deployment](#-deployment) section for more details.*

## 🌟 Key Features

- **Multimodal Uplink**: Simultaneous processing of audio (emotions/transcript) and video/images (visual context) for grounded reasoning.
- **Emotion-Aware Hologram**: A reactive visual companion that pulses **Rose** when sensing stress and **Emerald** when the user attains focus, providing non-verbal validation.
- **The "Mind Mesh" Visualizer**: A stunning, transparent map of Clara's "Neural Reasoning," showing the collaboration between specialized agents in real-time.
- **Agent Mesh Architecture**:
  - **The Linguist**: Instant translation and transcription for 100+ languages.
  - **The Weaver**: Empathic specialist suggesting small, non-threatening micro-actions.
  - **The Archivist**: RAG-powered knowledge custodian connecting you to past sessions.
  - **The Analyst**: Quantifies your journey with real-time "Clarity Maps" and metrics.
  - **The Guardian**: Ensures PII protection and safe boundaries.
- **Dual Insights System**: Switch between **Live Insights** for your current session aura and **Past Insights** for historical growth patterns and archive wisdom.
- **Proactive Intervention**: Clara doesn't just wait; she sees. She proactively identifies environmental stressors (like a messy desk) and gently guides you toward wellness.

For an in-depth look at how the Gemini Multimodal Live API and Google ADK power this mesh, see the [ARCHITECTURE.md](ARCHITECTURE.md).

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the Repo**:
   ```bash
   git clone https://github.com/your-username/clari-weave-ai.git
   cd clari-weave-ai
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```
   Create a `.env` file in the `backend` folder:
   ```env
   GEMINI_API_KEY=your_key_here
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the App

1. **Start Backend**:
   ```bash
   cd backend
   python start.py
   ```
2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

## 🛡️ Security

We prioritize your mental safety and data privacy. For details, see [SECURITY.md](SECURITY.md).

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

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
