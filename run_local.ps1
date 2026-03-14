# ClariWeaveAI Local Startup Script
# This will start both the backend and frontend for local testing.

# Start Backend (in new window)
Start-Process powershell -ArgumentList "-NoExit -Command 'cd backend; .\venv\Scripts\activate; uvicorn app.main:app --host 0.0.0.0 --port 8080'"

# Start Frontend (in new window)
Start-Process powershell -ArgumentList "-NoExit -Command 'cd frontend; npm run dev'"

Write-Host "ClariWeaveAI is starting..."
Write-Host "Backend: http://localhost:8080"
Write-Host "Frontend: Check the output of the npm window (usually http://localhost:5173)"
Write-Host "Ensure GEMINI_API_KEY is set in your environment before running!"
