# Technology Stack // ClariWeaveAI

ClariWeaveAI leverages a state-of-the-art multimodal stack to deliver low-latency, empathic AI interactions.

## 🧠 Artificial Intelligence
- **Core Engine**: [Google Gemini 2.5 Flash (Native Audio)](https://deepmind.google/technologies/gemini/) for real-time low-latency orchestration.
- **SDK**: `google-genai` 1.x (Multimodal Live API)
- **Framework**: Custom **ROSES** & **BMAD** (Confidential - Internal Agent instructions).
- **Persona Interface**: **Clara** (Emotion-Aware Hologram) with pro-active visual guidance.
- **Vector Storage**: Local RAG via metadata-sharded JSON (Production ready for Firestore).
- **Transparency Layer**: **Mind Mesh Visualizer** showing decentralized neural orchestration.

## ⚡ Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **Communication**: WebSockets for full-duplex audio/image streaming.
- **Processing**: PCM16 Audio encoding, Synchronous Threadpool for Visual Analysis, Canvas-based Frame sampling.

## 🎨 Frontend
- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Visuals**: Framer Motion for **Reactive Holographic Pulsing**.
- **Neural UI**: SVG-driven **Mind Mesh** for internal reasoning transparency.
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: Custom React Hooks (`useAudioStream`) with CustomEvent Fallbacks for "Demo Mode".

## 🛠️ DevOps & Infrastructure
- **Containerization**: Docker (Ready for Cloud Run)
- **Environment**: Cloud-agnostic (Local, GCP, or Vercel/Firebase)
