# Technology Stack // ClariWeaveAI

ClariWeaveAI leverages a state-of-the-art multimodal stack to deliver low-latency, empathic AI interactions.

## 🧠 Artificial Intelligence
- **Core Engine**: [Google Gemini 2.5 Flash (Native Audio)](https://deepmind.google/technologies/gemini/) for real-time low-latency orchestration.
- **SDK**: `google-genai` 1.x (Multimodal Live API)
- **Framework**: Custom **ROSES** & **BMAD** (Confidential - Internal Agent instructions).
- **Persona Interface**: **Clara** (Robot Girl Avatar) with pro-active wellness guidance.
- **Vector Storage**: Local RAG via metadata-sharded JSON (Production ready for Firestore).

## ⚡ Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **Communication**: WebSockets for full-duplex audio/image streaming.
- **Processing**: PCM16 Audio encoding, Canvas-based Video Frame sampling.

## 🎨 Frontend
- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: Custom React Hooks (`useAudioStream`)

## 🛠️ DevOps & Infrastructure
- **Containerization**: Docker (Ready for Cloud Run)
- **Environment**: Cloud-agnostic (Local, GCP, or Vercel/Firebase)
