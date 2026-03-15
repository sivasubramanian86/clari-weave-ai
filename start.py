import subprocess
import sys
import os
import time
import signal

def start_processes():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, 'backend')
    frontend_dir = os.path.join(root_dir, 'frontend')

    print("🚀 Starting ClariWeaveAI Local Services...")

    # Check for .env file
    if not os.path.exists(os.path.join(root_dir, '.env')):
        print("⚠️  Warning: .env file not found in root directory.")
        print("Please copy .env.example to .env and add your GEMINI_API_KEY.")

    # Determine backend python path
    if os.name == 'nt':  # Windows
        backend_python = os.path.join(backend_dir, 'venv', 'Scripts', 'python.exe')
    else:  # Unix/Mac
        backend_python = os.path.join(backend_dir, 'venv', 'bin', 'python')

    # Start Backend
    print("📦 Starting Backend (FastAPI)...")
    backend_process = subprocess.Popen(
        [backend_python, "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8082"],
        cwd=backend_dir
    )

    # Start Frontend
    print("🌐 Starting Frontend (Vite)...")
    # Using shell=True for npm because it's often a .cmd or .ps1 on Windows
    frontend_process = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=frontend_dir,
        shell=(os.name == 'nt')
    )

    print("\n✅ Both services are starting.")
    print("Backend: http://localhost:8082")
    print("Frontend: Check the output above (usually http://localhost:5173)")
    print("\nPress Ctrl+C to stop both services.")

    try:
        while True:
            time.sleep(1)
            if backend_process.poll() is not None:
                print("❌ Backend process stopped unexpectedly.")
                break
            if frontend_process.poll() is not None:
                print("❌ Frontend process stopped unexpectedly.")
                break
    except KeyboardInterrupt:
        print("\n🛑 Stopping ClariWeaveAI...")
    finally:
        backend_process.terminate()
        frontend_process.terminate()
        print("👋 Goodbye!")

if __name__ == "__main__":
    start_processes()
