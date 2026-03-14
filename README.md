# ClariWeaveAI

**Unweaving Mental Chaos into Multimodal Clarity.**

ClariWeaveAI is a premium, real-time multimodal mental wellness agent designed to transform overwhelming thoughts and visual clutter into actionable micro-hits of clarity. Guided by **Clara** (powered by **Gemini 2.5 Flash Native Audio**), it orchestrates a specialized mesh of agents (The Linguist, The Weaver, The Archivist, The Analyst, and The Guardian) to provide a seamless, empathic interaction across voice, image, and text.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Gemini](https://img.shields.io/badge/Built%20with-Gemini%203.1-emerald)

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
